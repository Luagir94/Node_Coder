import { AuthDataSourceImpl } from '@/infrastructure/datasource/auth'
import { AuthRepositoryImpl } from '@/infrastructure/repositories/auth'
import { AuthController } from '@/presentation/routes/auth/controller'
import { Router } from 'express'

export class AuthRoutes {
    static get routes(): Router {
        const router = Router()
        const datasource = new AuthDataSourceImpl()
        const authRepository = new AuthRepositoryImpl(datasource)
        const authController = new AuthController(authRepository)

        router.post('/login', authController.login)
        router.post('/register', authController.register)

        return router
    }
}
