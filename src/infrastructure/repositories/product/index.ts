import { type ProductDataSource } from '@/domain/datasources'
import { type CreateProductDto, type UpdateProductDto } from '@/domain/dto'
import { type ProductEntity } from '@/domain/entities'
import { type ProductRepository } from '@/domain/repositories'

export class ProductRepositoryImpl implements ProductRepository {
    constructor(private readonly datasource: ProductDataSource) {}

    async getAll(limit: number, offset: number): Promise<ProductEntity[]> {
        return await this.datasource.getAll(limit, offset)
    }

    async findById(id: string): Promise<ProductEntity> {
        return await this.datasource.findById(id)
    }

    async create(product: CreateProductDto): Promise<void> {
        await this.datasource.create(product)
    }

    async delete(id: string): Promise<void> {
        await this.datasource.delete(id)
    }

    async update(product: UpdateProductDto): Promise<void> {
        await this.datasource.update(product)
    }
}
