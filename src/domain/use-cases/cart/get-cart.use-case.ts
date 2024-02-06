import { type CartEntity } from '@/domain/entities'
import { type CartRepository } from '@/domain/repositories'

export interface GetCartUseCaseInterface {
    execute: (id: string) => Promise<CartEntity>
}

export class GetCartUseCase implements GetCartUseCaseInterface {
    constructor(private readonly repository: CartRepository) {}

    async execute(id: string): Promise<CartEntity> {
        return await this.repository.findById(id)
    }
}
