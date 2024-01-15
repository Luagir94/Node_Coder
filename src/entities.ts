import { type Datasource } from './datasource'

export class Product {
    private static lastId: number = 1
    private readonly _Id: number
    private readonly _Code: string
    private readonly _Title: string
    private readonly _Price: number
    private readonly _Description: string
    private readonly _Thumbnail: string
    private readonly _Stock: number

    constructor(
        title: string,
        price: number,
        description: string,
        thumbnail: string,
        stock: number,
        code: string,
        id?: number
    ) {
        this._Id = id ?? Product.lastId++
        this._Code = code
        this._Title = title
        this._Price = price
        this._Description = description
        this._Thumbnail = thumbnail
        this._Stock = stock
    }

    getId(): number {
        return this._Id
    }

    static setLastId(id: number): void {
        Product.lastId = id
        console.log(Product.lastId)
    }

    public getData(): any {
        return {
            _Id: this._Id,
            _Code: this._Code,
            _Title: this._Title,
            _Price: this._Price,
            _Description: this._Description,
            _Thumbnail: this._Thumbnail,
            _Stock: this._Stock,
        }
    }
}

export class ProductManager {
    private readonly datasource: Datasource
    constructor(datasource: Datasource) {
        this.datasource = datasource
    }

    async addProduct(product: Product): Promise<void> {
        try {
            await this.datasource.createElement(product)
            console.log('Entry added')
        } catch (error: unknown) {
            if (error instanceof Error) console.error(error.message)
            console.log('Unexpected error')
        }
    }

    async getProducts(): Promise<Product[]> {
        try {
            const products = await this.datasource.getElements()
            return products.map(
                (p: any) =>
                    new Product(
                        p._Title,
                        p._Price,
                        p._Description,
                        p._Thumbnail,
                        p._Stock,
                        p._Code,
                        p._Id
                    )
            )
        } catch (error: unknown) {
            if (error instanceof Error) console.error(error.message)
            console.log('Unexpected error')
            return []
        }
    }

    async getProduct(id: number): Promise<Product | void> {
        try {
            const product = await this.datasource.getElement(id)
            return new Product(
                product._Title,
                product._Price,
                product._Description,
                product._Thumbnail,
                product._Stock,
                product._Code,
                product._Id
            )
        } catch (error: unknown) {
            if (error instanceof Error) console.error(error.message)
            console.log('Unexpected error')
        }
    }

    async deleteProduct(id: number): Promise<void> {
        try {
            const elements = await this.getProducts()
            const index = elements.findIndex((e) => e.getId() === id)
            if (index === -1) throw new Error('Entry not found')
            elements.splice(index, 1)
            await this.datasource.deleteElement(elements)
            console.log('Entry deleted')
        } catch (error: unknown) {
            if (error instanceof Error) console.error(error.message)
            console.log('Unexpected error')
        }
    }

    async updateProduct(product: any, id: number): Promise<void> {
        try {
            const elements = await this.getProducts()
            const index = elements.findIndex((e) => e.getId() === id)
            if (index === -1) throw new Error('Entry not found')
            const newProduct = new Product(
                product._Title,
                product._Price,
                product._Description,
                product._Thumbnail,
                product._Stock,
                product._Code,
                id
            )
            elements[index] = newProduct
            await this.datasource.updateElement(elements)
            console.log(`Entry with id:${id} updated`)
        } catch (error: unknown) {
            if (error instanceof Error) console.error(error.message)
            console.log('Unexpected error')
        }
    }
}
