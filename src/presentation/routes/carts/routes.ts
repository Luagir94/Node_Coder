import { CartDatasourceImpl, ProductDatasourceImpl } from '@/infrastructure/datasource'
import { CartRepositoryImpl } from '@/infrastructure/repositories'
import { CartController } from '@/presentation/routes/carts/controller'

import { Router } from 'express'

export class CartRoutes {
    static get routes(): Router {
        const router = Router()
        const datasource = new CartDatasourceImpl('data/carts.json', new ProductDatasourceImpl('data/products.json'))
        const cartRepository = new CartRepositoryImpl(datasource)
        const cartController = new CartController(cartRepository)

        router.get('/', cartController.getCarts)
        router.get('/:id', cartController.getCartById)
        router.post('/', cartController.createCart)
        router.put('/:id', cartController.updateCart)
        router.delete('/:id', cartController.deleteCart)

        return router
    }
}
