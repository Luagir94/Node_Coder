import { CartModel } from '@/data/mongo/models/cart'
import { ProductModel } from '@/data/mongo/models/product'
import { type CartDataSource } from '@/domain/datasources'
import { type CreateCartDto, type UpdateCartDto } from '@/domain/dto'
import { CartEntity } from '@/domain/entities'
import { CustomError } from '@/domain/errors'
import { CART_ACTION } from '@/domain/types/enum'

export class CartDatasourceImpl implements CartDataSource {
    async create(cart: CreateCartDto): Promise<void> {
        await CartModel.create(cart)
    }

    async getStock(productId: string, newQuantity: number): Promise<boolean> {
        const product = await ProductModel.findById({ _id: productId })
        if (!product) {
            CustomError.notFound('Producto no encontrado')
            return false
        }
        if (product.stock < newQuantity) {
            CustomError.badRequest('Stock insuficiente')
            return false
        }

        return true
    }

    async getAll(limit = 0, offset = 0): Promise<CartEntity[]> {
        const cart = await CartModel.find().limit(limit).skip(offset)
        return cart.map((cart) => CartEntity.fromObject(cart))
    }

    async findById(id: string): Promise<CartEntity> {
        const cart = await CartModel.findById({ _id: id })
        if (!cart) {
            throw CustomError.notFound('Carrito no encontrado')
        }

        return CartEntity.fromObject(cart)
    }

    async update(newCart: UpdateCartDto): Promise<void> {
        const cart = await CartModel.findById({ _id: newCart.getId })
        if (!cart) {
            CustomError.notFound('Carrito no encontrado')
            return
        }

        switch (newCart.getAction) {
            case CART_ACTION.INCREASE_QUANTITY: {
                await this.getStock(newCart.getProductId, newCart.getQuantity)

                const productToUpdate = cart.products.find((p) => p.product_id === newCart.getId)
                if (!productToUpdate) {
                    throw CustomError.notFound('Carrito no encontrado')
                }

                productToUpdate.quantity += newCart.getQuantity

                break
            }

            case CART_ACTION.DECREASE_QUANTITY: {
                await this.getStock(newCart.getProductId, newCart.getQuantity)
                const productToUpdate = cart.products.find((p) => p.product_id === newCart.getId)
                if (!productToUpdate) {
                    throw CustomError.notFound('Producto no encontrado')
                }

                productToUpdate.quantity -= newCart.getQuantity
                break
            }

            case CART_ACTION.CHANGE_QUANTITY: {
                await this.getStock(newCart.getProductId, newCart.getQuantity)
                const productToUpdate = cart.products.find((p) => p.product_id === newCart.getId)
                if (!productToUpdate) {
                    throw CustomError.notFound('Producto no encontrado')
                }

                productToUpdate.quantity = newCart.getQuantity

                break
            }

            default:
                break
        }

        await cart.save()
    }

    async delete(id: string): Promise<void> {
        const cart = await CartModel.findById({ _id: id })
        if (!cart) {
            throw CustomError.notFound('Producto no encontrado')
        }
        await CartModel.deleteOne({ _id: id })
    }
}
