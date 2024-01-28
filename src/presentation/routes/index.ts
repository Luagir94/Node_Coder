import { ProductRoutes } from '@/presentation/routes/products'
import { Router } from 'express'

export class AppRoutes {
    static get routes(): Router {
        const router = Router()

        router.use('/api/products', ProductRoutes.routes)

        return router
    }
}
