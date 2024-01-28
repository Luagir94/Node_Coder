export interface ProductEntityData {
    id: number
    code: string
    title: string
    price: number
    description: string
    thumbnail: string
    stock: number
}

export class ProductEntity {
    private static readonly lastId: number = 1

    constructor(
        private readonly id: number,
        private readonly code: string,
        private readonly title: string,
        private readonly price: number,
        private readonly description: string,
        private readonly thumbnail: string,
        private readonly stock: number
    ) {}

    public get getId(): number {
        return this.id
    }

    public get fromClass(): ProductEntityData {
        return {
            id: this.id,
            code: this.code,
            title: this.title,
            price: this.price,
            description: this.description,
            thumbnail: this.thumbnail,
            stock: this.stock,
        }
    }

    public static fromObject(object: Record<string, any>): ProductEntity {
        const { id, code, title, price, description, thumbnail, stock } = object

        return new ProductEntity(id, code, title, price, description, thumbnail, stock)
    }
}
