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

    static create(props: Record<string, any>, id: string): [string?, UpdateCartDto?] {
        try {
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
                return [schemaParsed.error.issues[0].message]
            }

            const { productId, quantity, action } = schemaParsed.data

            return [undefined, new UpdateCartDto(productId, quantity, id, action)]
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
