import { LoggerService } from '@/infrastructure/services/logger'
import { type Response } from 'express'
import { MongoError } from 'mongodb'
import mongoose from 'mongoose'

export class CustomError extends Error {
    constructor(
        public readonly statusCode: number,
        public readonly message: string
    ) {
        super(message)
    }

    static badRequest(message: string) {
        LoggerService.error(`${message}`)
        throw new CustomError(400, message)
    }

    static unauthorized(message: string) {
        LoggerService.error(`${message}`)
        throw new CustomError(401, message)
    }

    static forbidden(message: string) {
        LoggerService.error(`${message}`)
        throw new CustomError(403, message)
    }

    static notFound(message: string) {
        LoggerService.error(`${message}`)
        throw new CustomError(404, message)
    }

    static internalServer(message: string) {
        LoggerService.error(`${message}`)
        throw new CustomError(500, message)
    }
}

export class HandlerError {
    public static readonly responseFormat = (error: unknown, res: Response) => {
        if (error instanceof mongoose.Error || error instanceof MongoError) {
            LoggerService.error(`DB Error: ${error.message}`)
            if (error instanceof MongoError && error.code === 11000) {
                return res.status(400).json({
                    error: `El valor '${error.errmsg.split('index:')[1].split('dup key')[0].split('_')[0].trim()}' ya existe`,
                })
            }
            return res.status(500).json({ error: error.message })
        }

        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message })
        }

        if (error instanceof Error) {
            return res.status(500).json({ error: error.message })
        }

        return res.status(500).json({ error: 'Error desconocido' })
    }
}
