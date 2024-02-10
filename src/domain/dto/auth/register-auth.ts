import { type IAddress } from '@/data/mongo/models/user'
import { errorMessages } from '@/utils/messages'
import { z } from 'zod'

export class RegisterDto {
    private readonly password: string
    private readonly email: string
    private readonly firstName: string
    private readonly lastName: string
    private readonly address: IAddress

    private constructor(password: string, email: string, firstName: string, lastName: string, address: IAddress) {
        this.password = password
        this.email = email
        this.firstName = firstName
        this.lastName = lastName
        this.address = address
    }

    public get getPassword(): string {
        return this.password
    }

    public get getEmail(): string {
        return this.email
    }

    public get getData() {
        return {
            password: this.password,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            address: this.address,
        }
    }

    static create(props: Record<string, any>): [string?, RegisterDto?] {
        const schema = z.object({
            email: z.string({ required_error: errorMessages.requiredField('email') }),
            password: z.string({ required_error: errorMessages.requiredField('password') }),
            firstName: z.string({ required_error: errorMessages.requiredField('firstName') }),
            lastName: z.string({ required_error: errorMessages.requiredField('lastName') }),
            address: z.object(
                {
                    street: z.string({ required_error: errorMessages.requiredField('street') }),
                    city: z.string({ required_error: errorMessages.requiredField('city') }),
                    state: z.string({ required_error: errorMessages.requiredField('state') }),
                    zip: z.string({ required_error: errorMessages.requiredField('zip') }),
                    country: z.string({ required_error: errorMessages.requiredField('country') }),
                },
                {
                    required_error: errorMessages.requiredField('address'),
                    invalid_type_error: errorMessages.invalidFormat('address', 'object'),
                }
            ),
        })

        try {
            const schemaParsed = schema.safeParse({ ...props })

            if (schemaParsed.success === false) {
                return [schemaParsed.error.issues[0].message]
            }

            return [
                undefined,
                new RegisterDto(
                    schemaParsed.data.password,
                    schemaParsed.data.email,
                    schemaParsed.data.firstName,
                    schemaParsed.data.lastName,
                    schemaParsed.data.address
                ),
            ]
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
