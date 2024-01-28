import { type ProductDataSource } from '@/domain/datasources/product'
import { ProductEntity, type ProductEntityData } from '@/domain/entities/product'
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

    async getAll(): Promise<ProductEntity[]> {
        const products = (await fs.promises.readFile(this._FilePath, 'utf-8')) as unknown as ProductEntityData[]
        return products.map((product) => ProductEntity.fromObject(product))
    }

    async findById(id: number): Promise<ProductEntity> {
        const data = await fs.promises.readFile(this._FilePath, 'utf-8')
        const products = JSON.parse(data).map((product: ProductEntityData) => ProductEntity.fromObject(product))
        const product = products.find((p: ProductEntity) => p.getId === id)
        if (product === undefined) throw new Error('Entry not found')
        if (!product) throw new Error(`Product with id ${id} not found`)
        return ProductEntity.fromObject(product)
    }
}
