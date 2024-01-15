class Product {
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
        code: string
    ) {
        this._Id = Product.lastId++
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
}

class ProductManager {
    private readonly products: Product[]
    constructor() {
        this.products = []
    }

    addProduct(product: Product): void {
        this.products.push(product)
    }

    getProducts(): Product[] {
        return this.products
    }

    getProduct(id: number): Product | string {
        try {
            const product = this.products.find(
                (product) => product.getId() === id
            )
            if (product == null) throw new Error('Product not found')
            return product
        } catch (error: unknown) {
            if (error instanceof Error) return error.message
            return 'Unexpected error'
        }
    }
}

const productManager = new ProductManager()

const product1 = new Product(
    'Producto Prueba',
    200,
    'Este es un producto prueba',
    'Sin imagen',
    123,
    'abc123'
)

console.log(productManager.getProducts())

productManager.addProduct(product1)

console.log(productManager.getProducts())

console.log(productManager.getProduct(1))

console.log(productManager.getProduct(22))
