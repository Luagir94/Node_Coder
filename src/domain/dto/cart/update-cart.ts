import { CustomError } from '@/domain/errors'
import { CART_ACTION } from '@/domain/types/enum'
import { errorMessages } from '@/utils/messages'
import { z } from 'zod'

export class UpdateCartDto {
    private readonly productId: string
    private readonly quantity: number
    private readonly id: string
    private readonly action: CART_ACTION

    private constructor(productId: string, quantity: number, id: string, action: CART_ACTION) {
        this.productId = productId
        this.quantity = quantity
        this.id = id
        this.action = action
    }

    public get getValues() {
        return {
            productId: this.productId,
            quantity: this.quantity,
            id: this.id,
            action: this.action,
        }
    }

    get getId(): string {
        return this.id
    }

    get getAction(): CART_ACTION {
        return this.action
    }

    get getQuantity(): number {
        return this.quantity
    }

    get getProductId(): string {
        return this.productId
    }

    static create(props: Record<string, any>, id: string): UpdateCartDto | undefined {
        const schema = z.object({
            productId: z.string({ required_error: errorMessages.requiredField('productId') }),
            quantity: z.number({ required_error: errorMessages.requiredField('quantity') }),
            id: z.string({ required_error: errorMessages.requiredField('id') }),
            action: z.nativeEnum(CART_ACTION, {
                required_error: errorMessages.requiredField('action'),
                invalid_type_error: errorMessages.invalidFormat('action', 'enum'),
            }),
        })

        const schemaParsed = schema.safeParse({ ...props, id })

        if (schemaParsed.success === false) {
            CustomError.badRequest(schemaParsed.error.issues[0].message)
            return
        }

        const { productId, quantity, action } = schemaParsed.data

        return new UpdateCartDto(productId, quantity, id, action)
    }
}
