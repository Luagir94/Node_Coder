import { type UpdateProductDto } from '@/domain/dto'
import { type ProductRepository } from '@/domain/repositories'

export interface UpdateProductUseCaseInterface {
    execute: (product: UpdateProductDto) => Promise<void>
}

export class UpdateProductUseCase implements UpdateProductUseCaseInterface {
    constructor(private readonly repository: ProductRepository) {}

    async execute(product: UpdateProductDto): Promise<void> {
        await this.repository.update(product)
    }
}
