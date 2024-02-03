import { type ProductCartInterface } from '@/domain/entities/cart'
import { errorMessages } from '@/utils/messages'
import { z } from 'zod'

export class CreateCartDto {
    private readonly products: ProductCartInterface[]

    private constructor(products: ProductCartInterface[]) {
        this.products = products
    }

    get getProducts(): ProductCartInterface[] {
        return this.products
    }

    static create(props: Record<string, any>): [string?, CreateCartDto?] {
        try {
            const productsPropsSchema = z.object({
                id: z.string({ required_error: errorMessages.requiredField('id') }),
                quantity: z
                    .number({
                        required_error: errorMessages.requiredField('quantity'),
                        invalid_type_error: errorMessages.invalidFormat('quantity', 'number'),
                    })
                    .positive({ message: errorMessages.minValue('quantity') }),
            })

            const schema = z
                .object({
                    products: productsPropsSchema
                        .array()
                        .nonempty({ message: errorMessages.requiredField('products') }),
                })

                .parse({ ...props })

            const products = schema.products.map((product: Record<string, any>) => {
                return {
                    id: product.id as string,
                    quantity: product.quantity as number,
                }
            })

            return [undefined, new CreateCartDto(products)]
        } catch (error) {
            if (error instanceof z.ZodError) {
                return [error.issues[0].message]
            }
            return [error.message]
        }
    }
}
