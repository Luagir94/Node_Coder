import { type CreateProductDto } from '@/domain/dto'
import { type UpdateProductDto } from '@/domain/dto/product/update-product'
import { type ProductEntity } from '@/domain/entities'

export abstract class ProductDataSource {
    abstract getAll(limit: number, offset: number): Promise<ProductEntity[]>

    abstract findById(id: string): Promise<ProductEntity>

    abstract create(product: CreateProductDto): Promise<void>

    abstract delete(id: string): Promise<void>

    abstract update(product: UpdateProductDto): Promise<void>
}
