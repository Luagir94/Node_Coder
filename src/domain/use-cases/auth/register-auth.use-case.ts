import { type RegisterDto } from '@/domain/dto'
import { type AuthRepository } from '@/domain/repositories'

export interface RegisterUseCaseInterface {
    execute: (user: RegisterDto) => Promise<void>
}

export class RegisterUseCase implements RegisterUseCaseInterface {
    constructor(private readonly repository: AuthRepository) {}

    async execute(user: RegisterDto): Promise<void> {
        await this.repository.register(user)
    }
}
