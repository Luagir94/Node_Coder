export interface ProductEntityData {
    code: string
    name: string
    price: number
    description: string
    thumbnail: string[]
    stock: number
    status: boolean
    category: string
    slug: string
}

export class ProductEntity {
    private readonly code: string
    private readonly name: string
    private readonly price: number
    private readonly description: string
    private readonly thumbnail: string[]
    private stock: number
    private readonly id: string
    private readonly status: boolean
    private readonly category: string
    private readonly slug: string

    constructor(
        id: string,
        code: string,
        name: string,
        price: number,
        description: string,
        thumbnail: string[],
        stock: number,
        status: boolean,
        category: string,
        slug: string
    ) {
        this.id = id
        this.code = code
        this.name = name
        this.price = price
        this.description = description
        this.thumbnail = thumbnail
        this.stock = stock
        this.status = status
        this.category = category
        this.slug = slug
    }

    public get getId(): string {
        return this.id
    }

    public get getStock(): number {
        return this.stock
    }

    public get getValues(): ProductEntityData {
        return {
            code: this.code,
            name: this.name,
            price: this.price,
            description: this.description,
            thumbnail: this.thumbnail,
            stock: this.stock,
            category: this.category,
            status: this.status,
            slug: this.slug,
        }
    }

    public static fromObject(object: Record<string, any>): ProductEntity {
        const { id, code, name, price, description, thumbnail, stock, status, category, slug } = object

        return new ProductEntity(id, code, name, price, description, thumbnail, stock, status, category, slug)
    }

    public setStock(stock: number) {
        this.stock = stock
    }
}
