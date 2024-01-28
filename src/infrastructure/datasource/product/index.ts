import { type ProductDataSource } from '@/domain/datasources/product'
import { ProductEntity } from '@/domain/entities/product'

export class ProductDatasourceImpl implements ProductDataSource {
    async getAll(): Promise<ProductEntity[]> {
        const products = []
        return products.map((todo) => ProductEntity.fromObject(todo))
    }

    async findById(id: number): Promise<ProductEntity> {
        const product: any = {}

        if (!product) throw `Product with id ${id} not found`
        return ProductEntity.fromObject(product)
    }
}
