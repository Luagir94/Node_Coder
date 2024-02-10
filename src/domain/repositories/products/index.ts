import { type CreateProductDto, type UpdateProductDto } from '@/domain/dto'
import { type ProductEntity } from '@/domain/entities'

export abstract class ProductRepository {
    abstract getAll(limit: number, offset: number): Promise<ProductEntity[]>
    abstract findById(id: string): Promise<ProductEntity>
    abstract create(product: CreateProductDto): Promise<void>
    abstract update(product: UpdateProductDto): Promise<void>
    abstract delete(id: string): Promise<void>
}
