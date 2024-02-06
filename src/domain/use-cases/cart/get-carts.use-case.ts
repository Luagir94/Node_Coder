import { type CartEntity } from '@/domain/entities'
import { type CartRepository } from '@/domain/repositories'

export interface GetCartsUseCaseInterface {
    execute: (limit: number, offset: number) => Promise<CartEntity[]>
}

export class GetCarstUseCase implements GetCartsUseCaseInterface {
    constructor(private readonly repository: CartRepository) {}

    async execute(limit: number, offset: number): Promise<CartEntity[]> {
        return await this.repository.getAll(limit, offset)
    }
}
