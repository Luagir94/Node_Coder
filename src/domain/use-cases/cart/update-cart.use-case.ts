import { type UpdateCartDto } from '@/domain/dto/cart/update-cart'
import { type CartRepository } from '@/domain/repositories'

export interface UpdateCartUseCaseInterface {
    execute: (product: UpdateCartDto) => Promise<void>
}

export class UpdateCartUseCase implements UpdateCartUseCaseInterface {
    constructor(private readonly repository: CartRepository) {}

    async execute(product: UpdateCartDto): Promise<void> {
        await this.repository.update(product)
    }
}
