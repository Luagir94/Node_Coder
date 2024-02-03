import { type CartDataSource } from '@/domain/datasources/cart'
import { type ProductDataSource } from '@/domain/datasources/product'
import { type CreateCartDto } from '@/domain/dto/cart/create-cart'
import { type UpdateCartDto } from '@/domain/dto/cart/update-cart'
import { UpdateProductDto } from '@/domain/dto/product/update-product'
import { CartEntity, type CartEntityData } from '@/domain/entities/cart'
import { CustomError } from '@/domain/errors'
import * as fs from 'fs'

export class CartDatasourceImpl implements CartDataSource {
    private readonly _FilePath: string
    private readonly _DatabasePath: string = 'data'
    private readonly _ProductDatasource: ProductDataSource

    constructor(path: string, productDatasource: ProductDataSource) {
        this._FilePath = path
        this.databaseInstance(path)
        this._ProductDatasource = productDatasource
    }

    async create(cart: CreateCartDto): Promise<void> {
        const elements = await this.getElements()
        const id = crypto.randomUUID()

        const products = await Promise.all(
            cart.getProducts.map(async (product) => {
                const productEntity = await this._ProductDatasource.findById(product.id)
                if (productEntity.getStock < product.quantity) {
                    throw CustomError.badRequest(
                        `No hay suficiente stock para el producto con id ${product.id}. Stock disponible: ${productEntity.getStock}`
                    )
                }
                productEntity.setStock(productEntity.getStock - product.quantity)
                const [errors, updatedProduct] = UpdateProductDto.create(productEntity.getValues, productEntity.getId)
                if (errors) throw CustomError.badRequest(errors)
                await this._ProductDatasource.update(updatedProduct)
                return { id: productEntity.getId, quantity: product.quantity }
            })
        )
        console.log(products)
        elements.push({ products, id })

        await fs.promises.writeFile(this._FilePath, JSON.stringify(elements))
    }

    async delete(id: string): Promise<void> {
        const carts = await this.getElements()
        const parsedCarts = carts.map((cart) => CartEntity.fromObject(cart))
        const index = parsedCarts.findIndex((p: CartEntity) => p.getId === id)
        const cartToDelete = parsedCarts[index]
        if (index === -1) throw CustomError.notFound(`Carrito con id ${id} no encontrado`)

        await Promise.all(
            cartToDelete.getProducts.map(async (product) => {
                const productEntity = await this._ProductDatasource.findById(product.id)
                productEntity.setStock(productEntity.getStock + product.quantity)
                const [errors, updatedProduct] = UpdateProductDto.create(productEntity.getValues, productEntity.getId)
                if (errors) throw CustomError.badRequest(errors)
                await this._ProductDatasource.update(updatedProduct)
            })
        )
        parsedCarts.splice(index, 1)
        await fs.promises.writeFile(this._FilePath, JSON.stringify(parsedCarts))
    }

    async update(cart: UpdateCartDto): Promise<void> {
        const carts = await this.getElements()

        const parsedCarts = carts.map((cart) => CartEntity.fromObject(cart))

        const index = parsedCarts.findIndex((p: CartEntity) => p.getId === cart.getValues.id)

        if (index === -1) throw CustomError.notFound(`Carrito con id ${cart.getValues.id} no encontrado.`)
        const { id } = cart.getValues
        const mappedProducts = await Promise.all(
            cart.getValues.products.map(async (product) => {
                const productEntity = await this._ProductDatasource.findById(product.id)
                if (productEntity.getStock < product.quantity) {
                    throw CustomError.badRequest(
                        `No hay suficiente stock para el producto con id ${product.id}. Stock disponible: ${productEntity.getStock}`
                    )
                }
                productEntity.setStock(productEntity.getStock - product.quantity)
                const [errors, updatedProduct] = UpdateProductDto.create(productEntity.getValues, productEntity.getId)
                if (errors) throw CustomError.badRequest(errors)
                await this._ProductDatasource.update(updatedProduct)
                return { id: productEntity.getId, quantity: product.quantity }
            })
        )

        const updatedCartProducts = parsedCarts[index].getProducts.map((product) => {
            const productIndex = mappedProducts.findIndex((p) => p.id === product.id)
            if (productIndex === -1) return product
            return { id: product.id, quantity: product.quantity + mappedProducts[productIndex].quantity }
        })

        parsedCarts[index] = new CartEntity(id, updatedCartProducts)
        await fs.promises.writeFile(this._FilePath, JSON.stringify(parsedCarts))
    }

    databaseInstance(path: string): void {
        if (!fs.existsSync(this._DatabasePath)) {
            fs.mkdirSync(this._DatabasePath)
        }
        if (fs.existsSync(path)) return

        fs.writeFileSync(path, '[]')
    }

    async getAll(limit = 0, offset = 0): Promise<CartEntity[]> {
        const carts = JSON.parse(await fs.promises.readFile(this._FilePath, 'utf-8')) as unknown as CartEntityData[]

        if (limit > 0) return carts.slice(offset, offset + limit).map((cart) => CartEntity.fromObject(cart))

        return carts.map((cart) => CartEntity.fromObject(cart))
    }

    async findById(id: string): Promise<CartEntity> {
        const data = await fs.promises.readFile(this._FilePath, 'utf-8')
        const carts = JSON.parse(data).map((cart: CartEntityData) => CartEntity.fromObject(cart))

        const cart = carts.find((p: CartEntity) => p.getId === id)
        if (!cart) throw CustomError.notFound(`Carrito con id ${id} no encontrado`)
        return cart
    }

    async getElements(): Promise<any[]> {
        const data = await fs.promises.readFile(this._FilePath, 'utf-8')
        return JSON.parse(data) as any[]
    }
}
