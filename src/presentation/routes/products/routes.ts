import { ProductDatasourceImpl } from '@/infrastructure/datasource/product'
import { ProductRepositoryImpl } from '@/infrastructure/repositories'
import { ProductController } from '@/presentation/routes/products/controller'
import { Router } from 'express'

export class ProductRoutes {
    static get routes(): Router {
        const router = Router()

        const datasource = new ProductDatasourceImpl()
        const productRepository = new ProductRepositoryImpl(datasource)
        const productController = new ProductController(productRepository)

        router.get('/', productController.gerProducts)
        router.get('/:id', productController.getProductById)

        return router
    }
}
