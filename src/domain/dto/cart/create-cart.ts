import { type ProductCartInterface } from '@/domain/entities'
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
        const productsPropsSchema = z.object({
            id: z.string({ required_error: errorMessages.requiredField('id') }),
            quantity: z
                .number({
                    required_error: errorMessages.requiredField('quantity'),
                    invalid_type_error: errorMessages.invalidFormat('quantity', 'number'),
                })
                .positive({ message: errorMessages.minValue('quantity') }),
        })
        const schema = z.object({
            products: z.array(productsPropsSchema).nonempty({ message: errorMessages.requiredField('products') }),
        })

        try {
            const schemaParsed = schema.safeParse({ ...props })

            if (schemaParsed.success === false) {
                return [schemaParsed.error.issues[0].message]
            }

            return [undefined, new CreateCartDto(schemaParsed.data.products)]
        } catch (error) {
            if (error instanceof z.ZodError) {
                return [error.issues[0].message]
            } else if (error instanceof Error) {
                return [error.message]
            }
            return ['An error occurred']
        }
    }
}
