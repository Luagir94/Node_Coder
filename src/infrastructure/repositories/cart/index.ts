import { type CartDataSource } from '@/domain/datasources'
import { type CreateCartDto, type UpdateCartDto } from '@/domain/dto'
import { type CartEntity } from '@/domain/entities'
import { type CartRepository } from '@/domain/repositories'

export class CartRepositoryImpl implements CartRepository {
    constructor(private readonly datasource: CartDataSource) {}

    async getAll(limit: number, offset: number): Promise<CartEntity[]> {
        return await this.datasource.getAll(limit, offset)
    }

    async findById(id: string): Promise<CartEntity> {
        return await this.datasource.findById(id)
    }

    async create(product: CreateCartDto): Promise<void> {
        await this.datasource.create(product)
    }

    async delete(id: string): Promise<void> {
        await this.datasource.delete(id)
    }

    async update(product: UpdateCartDto): Promise<void> {
        await this.datasource.update(product)
    }
}
