import { type ProductEntity } from '@/domain/entities/product'
import { type ProductRepository } from '@/domain/repositories'

export interface GetProductUseCase {
    execute: (id: number) => Promise<ProductEntity>
}

export class GetProduct implements GetProductUseCase {
    constructor(private readonly repository: ProductRepository) {}

    async execute(id: number): Promise<ProductEntity> {
        return await this.repository.findById(id)
    }
}
