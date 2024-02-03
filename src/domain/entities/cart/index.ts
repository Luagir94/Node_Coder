export interface ProductCartInterface {
    id: string
    quantity: number
}

export interface CartEntityData {
    id: string
    products: ProductCartInterface[]
}

export class CartEntity {
    private readonly id: string
    private readonly products: ProductCartInterface[]

    constructor(id: string, products: ProductCartInterface[]) {
        this.id = id
        this.products = products
    }

    public get getId(): string {
        return this.id
    }

    public get getProducts(): ProductCartInterface[] {
        return this.products
    }

    public static fromObject(object: Record<string, any>): CartEntity {
        const { id, products } = object

        return new CartEntity(id, products)
    }
}
