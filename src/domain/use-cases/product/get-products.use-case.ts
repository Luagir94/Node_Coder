import { type ProductEntity } from '@/domain/entities'
import { type ProductRepository } from '@/domain/repositories'

export interface GetProductsUseCaseInterface {
    execute: (limit: number, offset: number) => Promise<ProductEntity[]>
}

export class GetProductsUseCase implements GetProductsUseCaseInterface {
    constructor(private readonly repository: ProductRepository) {}

    async execute(limit: number, offset: number): Promise<ProductEntity[]> {
        return await this.repository.getAll(limit, offset)
    }
}
