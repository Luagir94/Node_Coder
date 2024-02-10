import { type CreateCartDto } from '@/domain/dto'
import { type CartRepository } from '@/domain/repositories'

export interface CreateCartUseCaseInterface {
    execute: (cart: CreateCartDto) => Promise<void>
}

export class CreateCartUseCase implements CreateCartUseCaseInterface {
    constructor(private readonly repository: CartRepository) {}

    async execute(cart: CreateCartDto): Promise<void> {
        await this.repository.create(cart)
    }
}
