import { type ProductEntity } from '@/domain/entities/product'
import { type ProductRepository } from '@/domain/repositories'

export interface GetProductsUseCase {
    execute: (limit: number, offset: number) => Promise<ProductEntity[]>
}

export class GetProducts implements GetProductsUseCase {
    constructor(private readonly repository: ProductRepository) {}

    async execute(limit: number, offset: number): Promise<ProductEntity[]> {
        return await this.repository.getAll(limit, offset)
    }
}
