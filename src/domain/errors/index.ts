import { LoggerService } from '@/infrastructure/services/logger'

export class CustomError extends Error {
    constructor(
        public readonly statusCode: number,
        public readonly message: string
    ) {
        super(message)
    }

    static badRequest(message: string) {
        LoggerService.error(`${message}`)
        return new CustomError(400, message)
    }

    static unauthorized(message: string) {
        LoggerService.error(`${message}`)
        return new CustomError(401, message)
    }

    static forbidden(message: string) {
        LoggerService.error(`${message}`)
        return new CustomError(403, message)
    }

    static notFound(message: string) {
        LoggerService.error(`${message}`)
        return new CustomError(404, message)
    }

    static internalServer(message: string) {
        LoggerService.error(`${message}`)
        return new CustomError(500, message)
    }
}
