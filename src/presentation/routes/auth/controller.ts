import { LoginDto, RegisterDto } from '@/domain/dto'
import { HandlerError } from '@/domain/errors'
import { type AuthRepository } from '@/domain/repositories'
import { LoginUseCase } from '@/domain/use-cases/auth/login-auth.use-case'
import { RegisterUseCase } from '@/domain/use-cases/auth/register-auth.use-case'
import type { Request, Response } from 'express'

export class AuthController {
    constructor(private readonly authRepository: AuthRepository) {}

    public login = (req: Request, res: Response) => {
        const [error, loginDto] = LoginDto.create(req.body)

        if (error) return res.status(400).json({ error })

        new LoginUseCase(this.authRepository)
            .execute(loginDto!)
            .then((token) => {
                res.json({ token })
            })
            .catch((error) => HandlerError.responseFormat(error, res))
    }

    public register = (req: Request, res: Response) => {
        const [error, registerDto] = RegisterDto.create(req.body)

        if (error) return res.status(400).json({ error })

        new RegisterUseCase(this.authRepository)
            .execute(registerDto!)
            .then(() => {
                res.status(201).json({ message: 'Usuario creado' })
            })
            .catch((error) => HandlerError.responseFormat(error, res))
    }
}
