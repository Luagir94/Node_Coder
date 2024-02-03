import { CartRoutes } from '@/presentation/routes/carts'
import { ProductRoutes } from '@/presentation/routes/products'
import { Router } from 'express'

export class AppRoutes {
    static get routes(): Router {
        const router = Router()

        router.use('/products', ProductRoutes.routes)

        router.use('/carts', CartRoutes.routes)

        return router
    }
}
