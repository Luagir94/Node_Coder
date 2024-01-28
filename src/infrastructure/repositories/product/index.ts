import { type ProductDataSource } from '@/domain/datasources/product'
import { type ProductEntity } from '@/domain/entities/product'
import { type ProductRepository } from '@/domain/repositories'

export class ProductRepositoryImpl implements ProductRepository {
    constructor(private readonly datasource: ProductDataSource) {}

    async getAll(limit: number, offset: number): Promise<ProductEntity[]> {
        return await this.datasource.getAll(limit, offset)
    }

    async findById(id: number): Promise<ProductEntity> {
        return await this.datasource.findById(id)
    }
}
