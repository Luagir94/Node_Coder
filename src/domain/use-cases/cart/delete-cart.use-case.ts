import { type CartRepository } from '@/domain/repositories'

export interface DeleteCartUseCaseInterface {
    execute: (id: string) => Promise<void>
}

export class DeleteCartUseCase implements DeleteCartUseCaseInterface {
    constructor(private readonly repository: CartRepository) {}

    async execute(id: string): Promise<void> {
        await this.repository.delete(id)
    }
}
