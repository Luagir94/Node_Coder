import { LoginDto, RegisterDto } from '@/domain/dto'
import { HandlerError } from '@/domain/errors'
import { type AuthRepository } from '@/domain/repositories'
import { LoginUseCase } from '@/domain/use-cases/auth/login-auth.use-case'
import { RegisterUseCase } from '@/domain/use-cases/auth/register-auth.use-case'
import type { Request, Response } from 'express'

export class AuthController {
    constructor(private readonly authRepository: AuthRepository) {}

    public login = (req: Request, res: Response) => {
        try {
            const loginDto = LoginDto.create(req.body)
            new LoginUseCase(this.authRepository)
                .execute(loginDto!)
                .then((data) => {
                    res.cookie('Authorization', data.token, { httpOnly: true, signed: true, maxAge: 100000000 }).json(
                        data
                    )
                })
                .catch((error) => HandlerError.responseFormat(error, res))
        } catch (error) {
            HandlerError.responseFormat(error, res)
        }
    }

    public register = (req: Request, res: Response) => {
        try {
            const registerDto = RegisterDto.create(req.body)

            new RegisterUseCase(this.authRepository)
                .execute(registerDto!)
                .then(() => {
                    res.status(201).json({ message: 'Usuario creado' })
                })
                .catch((error) => HandlerError.responseFormat(error, res))
        } catch (error) {
            HandlerError.responseFormat(error, res)
        }
    }
}
