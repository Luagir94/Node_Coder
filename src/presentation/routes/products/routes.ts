import { ProductDatasourceImpl } from '@/infrastructure/datasource'
import { ProductRepositoryImpl } from '@/infrastructure/repositories'
import { ProductController } from '@/presentation/routes/products/controller'

import { Router } from 'express'

export class ProductRoutes {
    static get routes(): Router {
        const router = Router()
        const datasource = new ProductDatasourceImpl('data/products.json')
        const productRepository = new ProductRepositoryImpl(datasource)
        const productController = new ProductController(productRepository)

        router.get('/', productController.getProducts)
        router.get('/:id', productController.getProductById)
        router.post('/', productController.createProduct)
        router.put('/:id', productController.updateProduct)
        router.delete('/:id', productController.deleteProduct)

        return router
    }
}
