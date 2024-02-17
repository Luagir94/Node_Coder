import { type CreateCartDto, type UpdateCartDto } from '@/domain/dto'
import { type CartEntity } from '@/domain/entities'

export abstract class CartDataSource {
    abstract getAll(limit: number, offset: number): Promise<CartEntity[]>

    abstract findById(id: string): Promise<CartEntity | undefined>

    abstract create(product: CreateCartDto): Promise<void>

    abstract delete(id: string): Promise<void>

    abstract update(product: UpdateCartDto | undefined): Promise<void>
}
