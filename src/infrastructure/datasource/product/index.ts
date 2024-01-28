import { type ProductDataSource } from '@/domain/datasources/product'
import { ProductEntity, type ProductEntityData } from '@/domain/entities/product'
import { CustomError } from '@/domain/errors'
import * as fs from 'fs'

export class ProductDatasourceImpl implements ProductDataSource {
    private readonly _FilePath: string
    private readonly _DatabasePath: string = 'data'

    constructor(path: string) {
        this._FilePath = path
        this.databaseInstance(path)
    }

    databaseInstance(path: string): void {
        if (!fs.existsSync(this._DatabasePath)) {
            fs.mkdirSync(this._DatabasePath)
        }
        if (fs.existsSync(path)) return

        fs.writeFileSync(path, '[]')
    }

    async getAll(limit = 0, offset = 0): Promise<ProductEntity[]> {
        const products = JSON.parse(
            await fs.promises.readFile(this._FilePath, 'utf-8')
        ) as unknown as ProductEntityData[]

        if (limit > 0) return products.slice(offset, offset + limit).map((product) => ProductEntity.fromObject(product))

        return products.map((product) => ProductEntity.fromObject(product))
    }

    async findById(id: number): Promise<ProductEntity> {
        const data = await fs.promises.readFile(this._FilePath, 'utf-8')
        const products = JSON.parse(data).map((product: ProductEntityData) => ProductEntity.fromObject(product))

        const product = products.find((p: ProductEntity) => p.getId === id)
        console.log(product)
        if (!product) throw CustomError.notFound(`Product with id ${id} not found`)
        return product
    }
}
