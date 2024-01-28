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
        private readonly _Id: number,
        private readonly _Code: string,
        private readonly _Title: string,
        private readonly _Price: number,
        private readonly _Description: string,
        private readonly _Thumbnail: string,
        private readonly _Stock: number
    ) {}

    public get getId(): number {
        return this._Id
    }

    public get fromClass(): ProductEntityData {
        return {
            id: this._Id,
            code: this._Code,
            title: this._Title,
            price: this._Price,
            description: this._Description,
            thumbnail: this._Thumbnail,
            stock: this._Stock,
        }
    }

    public static fromObject(object: Record<string, any>): ProductEntity {
        const { id, code, title, price, description, thumbnail, stock } = object

        return new ProductEntity(id, code, title, price, description, thumbnail, stock)
    }
}
