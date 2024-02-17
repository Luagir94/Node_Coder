import { JwtAdapter } from '@/config/adapters'
import { UserModel } from '@/data/mongo/models/user'
import { UserEntity } from '@/domain/entities/user'
import { CustomError, HandlerError } from '@/domain/errors'
import { USER_ROLE } from '@/domain/types/enum'
import { type NextFunction, type Request, type Response } from 'express'

export class AuthMiddleware {
    static async validateJWT(req: Request, res: Response, next: NextFunction) {
        try {
            const authorization = req.header('Authorization')
            if (!authorization) {
                throw CustomError.forbidden('Sin token de autorización')
            }
            if (!authorization.startsWith('Bearer ')) CustomError.forbidden('Formato de token inválido')

            const token = authorization.split(' ').at(1) ?? ''
            const payload = await JwtAdapter.validateToken<{ id: string }>(token)
            if (!payload) {
                throw CustomError.forbidden('Token inválido')
            }

            const user = await UserModel.findById(payload.id)
            if (!user) {
                throw CustomError.forbidden('Usuario invalido')
            }

            req.body.userData = UserEntity.fromObject(user)

            next()
        } catch (error) {
            HandlerError.responseFormat(error, res)
        }
    }

    static async validateAdmin(req: Request, res: Response, next: NextFunction) {
        if (!req.body.userData) CustomError.forbidden('Unauthorized')

        const userData = req.body.userData

        try {
            if (userData.role !== USER_ROLE.ADMIN)
                throw CustomError.forbidden('No tienes permisos para realizar esta acción.')

            next()
        } catch (error) {
            HandlerError.responseFormat(error, res)
        }
    }
}
