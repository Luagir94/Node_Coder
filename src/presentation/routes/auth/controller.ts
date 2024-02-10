import { LoginDto, RegisterDto } from '@/domain/dto'
import { CustomError } from '@/domain/errors'
import { type AuthRepository } from '@/domain/repositories'
import { LoginUseCase } from '@/domain/use-cases/auth/login-auth.use-case'
import { RegisterUseCase } from '@/domain/use-cases/auth/register-auth.use-case'
import { LoggerService } from '@/infrastructure/services/logger'
import type { Request, Response } from 'express'
import { MongoError } from 'mongodb'
import mongoose from 'mongoose'

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
            .catch((error) => this.handleError(error, res))
    }

    public register = (req: Request, res: Response) => {
        const [error, registerDto] = RegisterDto.create(req.body)

        if (error) return res.status(400).json({ error })

        new RegisterUseCase(this.authRepository)
            .execute(registerDto!)
            .then(() => {
                res.status(201).json({ message: 'Usuario creado' })
            })
            .catch((error) => this.handleError(error, res))
    }

    private readonly handleError = (error: unknown, res: Response) => {
        if (error instanceof mongoose.Error || error instanceof MongoError) {
            LoggerService.error(`DB Error: ${error.message}`)
            return res.status(500).json({ error: error.message })
        }

        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message })
        }
        console.error(error)
        return res.status(500).json({ error: 'Error desconocido' })
    }
}
