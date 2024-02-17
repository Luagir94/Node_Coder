import { CustomError } from '@/domain/errors'
import { errorMessages } from '@/utils/messages'
import { z } from 'zod'

export class UpdateProductDto {
    private readonly code: string
    private readonly name: string
    private readonly price: number
    private readonly description: string
    private readonly thumbnail: string[]
    private readonly stock: number
    private readonly id: string
    private readonly status: boolean
    private readonly category: string
    private readonly slug: string

    private constructor(
        code: string,
        title: string,
        price: number,
        description: string,
        thumbnail: string[],
        stock: number,
        id: string,
        status: boolean,
        category: string,
        slug: string
    ) {
        this.code = code
        this.name = title
        this.price = price
        this.description = description
        this.thumbnail = thumbnail
        this.stock = stock
        this.id = id
        this.status = status
        this.category = category
        this.slug = slug
    }

    public get getValues() {
        return {
            code: this.code,
            name: this.name,
            price: this.price,
            description: this.description,
            thumbnail: this.thumbnail,
            stock: this.stock,
            id: this.id,
            status: this.status,
            category: this.category,
            slug: this.slug,
        }
    }

    public get getId() {
        return this.id
    }

    static create(props: Record<string, any>, id: string): UpdateProductDto | undefined {
        props.price = +props.price
        props.stock = +props.stock
        props.quantity = +props.quantity

        const schema = z.object({
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
            status: z.boolean({ required_error: errorMessages.requiredField('status') }),
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
            id: z.string({ required_error: errorMessages.requiredField('id') }),
            slug: z.string({ required_error: errorMessages.requiredField('slug') }),
        })
        const schemaParsed = schema.safeParse({ ...props, id })

        if (schemaParsed.success === false) {
            CustomError.badRequest(schemaParsed.error.issues[0].message)
            return
        }

        return new UpdateProductDto(
            schemaParsed.data.code,
            schemaParsed.data.name,
            schemaParsed.data.price,
            schemaParsed.data.description,
            schemaParsed.data.thumbnail,
            schemaParsed.data.stock,
            schemaParsed.data.id,
            schemaParsed.data.status,
            schemaParsed.data.category,
            schemaParsed.data.slug
        )
    }
}
