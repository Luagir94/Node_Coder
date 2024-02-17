import { type ProductCartInterface } from '@/domain/entities'
import { CustomError } from '@/domain/errors'
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

    static create(props: Record<string, any>): CreateCartDto {
        const productsPropsSchema = z.object({
            product_id: z.string({ required_error: errorMessages.requiredField('id') }),
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

        const schemaParsed = schema.safeParse({ ...props })

        if (schemaParsed.success === false) {
            throw CustomError.badRequest(schemaParsed.error.issues[0].message)
        }

        return new CreateCartDto(schemaParsed.data.products)
    }
}
