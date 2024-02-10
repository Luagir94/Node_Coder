import { ProductDatasourceImpl } from '@/infrastructure/datasource'
import { ProductRepositoryImpl } from '@/infrastructure/repositories'
import { AuthMiddleware } from '@/presentation/middlewares'
import { ProductController } from '@/presentation/routes/products/controller'

import { Router } from 'express'

export class ProductRoutes {
    static get routes(): Router {
        const router = Router()
        const datasource = new ProductDatasourceImpl()
        const productRepository = new ProductRepositoryImpl(datasource)
        const productController = new ProductController(productRepository)

        router.get('/', productController.getProducts)
        router.get('/:id', productController.getProductById)
        router.post('/', [AuthMiddleware.validateJWT, AuthMiddleware.validateAdmin], productController.createProduct)
        router.put('/:id', [AuthMiddleware.validateJWT, AuthMiddleware.validateAdmin], productController.updateProduct)
        router.delete(
            '/:id',
            [AuthMiddleware.validateJWT, AuthMiddleware.validateAdmin],
            productController.deleteProduct
        )

        return router
    }
}
