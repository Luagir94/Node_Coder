import { type AuthDataSource } from '@/domain/datasources'
import { type LoginDto, type RegisterDto } from '@/domain/dto'
import type { UserEntityData } from '@/domain/entities/user'
import { type AuthRepository } from '@/domain/repositories'

export class AuthRepositoryImpl implements AuthRepository {
    constructor(private readonly datasource: AuthDataSource) {}

    async login(loginDto: LoginDto): Promise<{
        token: string
        user: UserEntityData
    }> {
        return await this.datasource.login(loginDto)
    }

    async recovery(email: string): Promise<void> {
        await this.datasource.recovery(email)
    }

    async register(registerDto: RegisterDto): Promise<void> {
        await this.datasource.register(registerDto)
    }
}
