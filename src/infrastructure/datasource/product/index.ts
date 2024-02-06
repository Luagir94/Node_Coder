import { type ProductDataSource } from '@/domain/datasources/product'
import { type CreateProductDto } from '@/domain/dto'
import { type UpdateProductDto } from '@/domain/dto/product/update-product'
import { ProductEntity, type ProductEntityData } from '@/domain/entities'
import { CustomError } from '@/domain/errors'
import * as fs from 'fs'

export class ProductDatasourceImpl implements ProductDataSource {
    private readonly _FilePath: string
    private readonly _DatabasePath: string = 'data'

    constructor(path: string) {
        this._FilePath = path
        this.databaseInstance(path)
    }

    async create(product: CreateProductDto): Promise<void> {
        const elements = await this.getElements()
        const id = crypto.randomUUID()
        elements.push({ ...product, id })

        await fs.promises.writeFile(this._FilePath, JSON.stringify(elements))
    }

    async delete(id: string): Promise<void> {
        const products = await this.getElements()
        const parsedProducts = products.map((product) => ProductEntity.fromObject(product))
        const index = parsedProducts.findIndex((p: ProductEntity) => p.getId === id)
        if (index === -1) throw CustomError.notFound(`Producto con id ${id} no encontrado`)
        parsedProducts.splice(index, 1)
        await fs.promises.writeFile(this._FilePath, JSON.stringify(parsedProducts))
    }

    async update(product: UpdateProductDto): Promise<void> {
        const products = await this.getElements()

        const parsedProducts = products.map((product) => ProductEntity.fromObject(product))

        const index = parsedProducts.findIndex((p: ProductEntity) => p.getId === product.getValues.id)

        if (index === -1) throw CustomError.notFound(`Producto con id ${product.getValues.id} no encontrado.`)
        const { id, code, name, price, description, thumbnail, stock, status, category } = product.getValues

        parsedProducts[index] = new ProductEntity(
            id,
            code,
            name,
            price,
            description,
            thumbnail,
            stock,
            status,
            category
        )
        await fs.promises.writeFile(this._FilePath, JSON.stringify(parsedProducts))
    }

    databaseInstance(path: string): void {
        if (!fs.existsSync(this._DatabasePath)) {
            fs.mkdirSync(this._DatabasePath)
        }
        if (fs.existsSync(path)) return

        fs.writeFileSync(path, '[]')
    }

    async getAll(limit = 0, offset = 0): Promise<ProductEntity[]> {
        const products = JSON.parse(
            await fs.promises.readFile(this._FilePath, 'utf-8')
        ) as unknown as ProductEntityData[]

        if (limit > 0) return products.slice(offset, offset + limit).map((product) => ProductEntity.fromObject(product))

        return products.map((product) => ProductEntity.fromObject(product))
    }

    async findById(id: string): Promise<ProductEntity> {
        const data = await fs.promises.readFile(this._FilePath, 'utf-8')
        const products = JSON.parse(data).map((product: ProductEntityData) => ProductEntity.fromObject(product))

        const product = products.find((p: ProductEntity) => p.getId === id)
        if (!product) throw CustomError.notFound(`Producto con id ${id} no encontrado`)
        return product
    }

    async getElements(): Promise<any[]> {
        const data = await fs.promises.readFile(this._FilePath, 'utf-8')
        return JSON.parse(data) as any[]
    }
}
