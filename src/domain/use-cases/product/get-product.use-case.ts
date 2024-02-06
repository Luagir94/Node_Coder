import { type ProductEntity } from '@/domain/entities'
import { type ProductRepository } from '@/domain/repositories'

export interface GetProductUseCaseInterface {
    execute: (id: string) => Promise<ProductEntity>
}

export class GetProductUseCase implements GetProductUseCaseInterface {
    constructor(private readonly repository: ProductRepository) {}

    async execute(id: string): Promise<ProductEntity> {
        return await this.repository.findById(id)
    }
}
