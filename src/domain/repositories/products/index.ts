import { type ProductEntity } from '@/domain/entities/product'

export abstract class ProductRepository {
    abstract getAll(limit: number, offset: number): Promise<ProductEntity[]>
    abstract findById(id: number): Promise<ProductEntity>
}
