import { errorMessages } from '@/utils/messages'
import { z } from 'zod'

export class CreateProductDto {
    private readonly code: string
    private readonly name: string
    private readonly price: number
    private readonly description: string
    private readonly thumbnail: string[]
    private readonly stock: number
    private readonly status: boolean
    private readonly category: string

    private constructor(
        code: string,
        name: string,
        price: number,
        description: string,
        thumbnail: string[],
        stock: number,
        status: boolean,
        category: string
    ) {
        this.code = code
        this.name = name
        this.price = price
        this.description = description
        this.thumbnail = thumbnail
        this.stock = stock
        this.status = status
        this.category = category
    }

    static create(props: Record<string, any>): [string?, CreateProductDto?] {
        try {
            props.price = +props.price
            props.stock = +props.stock
            props.quantity = +props.quantity

            const schema = z
                .object({
                    name: z
                        .string({ required_error: errorMessages.requiredField('name') })
                        .min(3, { message: errorMessages.minLength('name', 3) })
                        .max(255, { message: errorMessages.maxLength('name', 255) }),
                    code: z.string({ required_error: errorMessages.requiredField('code') }),
                    price: z
                        .number({
                            required_error: errorMessages.requiredField('price'),
                            invalid_type_error: errorMessages.invalidFormat('price', 'number'),
                        })
                        .positive({ message: errorMessages.minValue('quantity') }),
                    status: z.boolean().optional().default(true),
                    category: z.string({ required_error: errorMessages.requiredField('category') }),
                    description: z
                        .string({ required_error: errorMessages.requiredField('description') })
                        .min(3, { message: errorMessages.minLength('description', 3) })
                        .max(255, { message: errorMessages.maxLength('description', 255) }),
                    thumbnail: z
                        .array(z.string({ invalid_type_error: errorMessages.invalidFormat('thumbnail', 'string[]') }), {
                            invalid_type_error: errorMessages.invalidFormat('thumbnail', 'string[]'),
                        })
                        .optional()
                        .default([]),
                    stock: z
                        .number({
                            required_error: errorMessages.requiredField('stock'),
                            invalid_type_error: errorMessages.invalidFormat('stock', 'number'),
                        })
                        .nonnegative({ message: errorMessages.minValue('stock') }),
                })
                .parse({ ...props })
            console.log(schema)
            return [
                undefined,
                new CreateProductDto(
                    schema.code,
                    schema.name,
                    schema.price,
                    schema.description,
                    schema.thumbnail,
                    schema.stock,
                    schema.status,
                    schema.category
                ),
            ]
        } catch (error) {
            if (error instanceof z.ZodError) {
                return [error.issues[0].message]
            }
            return [error.message]
        }
    }
}
