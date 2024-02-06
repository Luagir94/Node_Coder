import { type ProductRepository } from '@/domain/repositories'

export interface DeleteProductUseCaseInterface {
    execute: (id: string) => Promise<void>
}

export class DeleteProductUseCase implements DeleteProductUseCaseInterface {
    constructor(private readonly repository: ProductRepository) {}

    async execute(id: string): Promise<void> {
        await this.repository.delete(id)
    }
}
