import { type RegisterDto } from '@/domain/dto'
import { type LoginDto } from '@/domain/dto/auth/login-auth'
import type { UserEntityData } from '@/domain/entities/user'

export abstract class AuthDataSource {
    abstract login(loginDto: LoginDto): Promise<{
        token: string
        user: UserEntityData
    }>

    abstract register(registerDto: RegisterDto): Promise<void>

    abstract recovery(email: string): Promise<void>
}
