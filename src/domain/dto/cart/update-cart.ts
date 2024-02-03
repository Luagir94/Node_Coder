import { type ProductCartInterface } from '@/domain/entities/cart'
import { errorMessages } from '@/utils/messages'
import { z } from 'zod'

export class UpdateCartDto {
    private readonly products: ProductCartInterface[]
    private readonly id: string

    private constructor(products: ProductCartInterface[], id: string) {
        this.products = products
        this.id = id
    }

    public get getValues() {
        return {
            products: this.products,
            id: this.id,
        }
    }

    static create(props: Record<string, any>, id: string): [string?, UpdateCartDto?] {
        try {
            const productsPropsSchema = z.object({
                id: z.string({ required_error: errorMessages.requiredField('id') }),
                quantity: z.number({
                    required_error: errorMessages.requiredField('quantity'),
                    invalid_type_error: errorMessages.invalidFormat('quantity', 'number'),
                }),
            })

            const schema = z
                .object({
                    products: productsPropsSchema
                        .array()
                        .nonempty({ message: errorMessages.requiredField('products') }),
                    id: z.string({ required_error: errorMessages.requiredField('id') }),
                })
                .parse({ ...props, id })

            const products = schema.products.map((product: Record<string, any>) => {
                return {
                    id: product.id as string,
                    quantity: product.quantity as number,
                }
            })

            return [undefined, new UpdateCartDto(products, schema.id)]
        } catch (error) {
            if (error instanceof z.ZodError) {
                return [error.issues[0].message]
            }
            return [error.message]
        }
    }
}