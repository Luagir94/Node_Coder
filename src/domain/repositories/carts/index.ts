import { type CreateCartDto } from '@/domain/dto/cart/create-cart'
import { type UpdateCartDto } from '@/domain/dto/cart/update-cart'
import { type CartEntity } from '@/domain/entities'

export abstract class CartRepository {
    abstract getAll(limit: number, offset: number): Promise<CartEntity[]>
    abstract findById(id: string): Promise<CartEntity>
    abstract create(product: CreateCartDto): Promise<void>
    abstract update(product: UpdateCartDto): Promise<void>
    abstract delete(id: string): Promise<void>
}
