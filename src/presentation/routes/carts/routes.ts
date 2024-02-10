import { CartDatasourceImpl } from '@/infrastructure/datasource'
import { CartRepositoryImpl } from '@/infrastructure/repositories'
import { AuthMiddleware } from '@/presentation/middlewares'
import { CartController } from '@/presentation/routes/carts/controller'

import { Router } from 'express'

export class CartRoutes {
    static get routes(): Router {
        const router = Router()
        const datasource = new CartDatasourceImpl()
        const cartRepository = new CartRepositoryImpl(datasource)
        const cartController = new CartController(cartRepository)

        router.get('/', [AuthMiddleware.validateJWT], cartController.getCarts)
        router.get('/:id', [AuthMiddleware.validateJWT], cartController.getCartById)
        router.post('/', [AuthMiddleware.validateJWT], cartController.createCart)
        router.put('/:id', [AuthMiddleware.validateJWT], cartController.updateCart)
        router.delete('/:id', [AuthMiddleware.validateJWT], cartController.deleteCart)

        return router
    }
}
