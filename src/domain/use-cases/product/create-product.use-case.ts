import { type CreateProductDto } from '@/domain/dto'
import { type ProductRepository } from '@/domain/repositories'

export interface CreateProductUseCaseInterface {
    execute: (product: CreateProductDto) => Promise<void>
}

export class CreateProductUseCase implements CreateProductUseCaseInterface {
    constructor(private readonly repository: ProductRepository) {}

    async execute(product: CreateProductDto): Promise<void> {
        await this.repository.create(product)
    }
}
