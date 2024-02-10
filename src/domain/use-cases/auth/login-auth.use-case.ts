import { type LoginDto } from '@/domain/dto'
import type { UserEntityData } from '@/domain/entities/user'
import { type AuthRepository } from '@/domain/repositories'

export interface LoginUseCaseInterface {
    execute: (user: LoginDto) => Promise<{
        token: string
        user: UserEntityData
    }>
}

export class LoginUseCase implements LoginUseCaseInterface {
    constructor(private readonly repository: AuthRepository) {}

    async execute(user: LoginDto): Promise<{
        token: string
        user: UserEntityData
    }> {
        return await this.repository.login(user)
    }
}
