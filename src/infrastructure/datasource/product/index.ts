import { ProductModel } from '@/data/mongo/models/product'
import { type ProductDataSource } from '@/domain/datasources'
import { type CreateProductDto } from '@/domain/dto'
import { type UpdateProductDto } from '@/domain/dto/product/update-product'
import { ProductEntity } from '@/domain/entities'
import { CustomError } from '@/domain/errors'

export class ProductDatasourceImpl implements ProductDataSource {
    async create(product: CreateProductDto): Promise<void> {
        await ProductModel.create(product)
    }

    async getAll(limit = 0, offset = 0): Promise<ProductEntity[]> {
        const products = await ProductModel.find().limit(limit).skip(offset)

        return products.map((product) => ProductEntity.fromObject(product))
    }

    async findById(id: string): Promise<ProductEntity> {
        const product = await ProductModel.findById({ _id: id })
        if (!product) {
            throw CustomError.notFound('Producto no encontrado')
        }

        return ProductEntity.fromObject(product)
    }

    async update(product: UpdateProductDto): Promise<void> {
        const productExist = ProductModel.updateOne({ _id: product.getId }, product.getValues)
        if (!productExist) {
            throw CustomError.notFound('Producto no encontrado')
        }
    }

    async delete(id: string): Promise<void> {
        const productExist = await ProductModel.deleteOne({ _id: id })

        if (!productExist) {
            throw CustomError.notFound('Producto no encontrado')
        }
    }
}
