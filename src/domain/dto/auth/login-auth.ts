import { CustomError } from '@/domain/errors'
import { errorMessages } from '@/utils/messages'
import { z } from 'zod'

export class LoginDto {
    private readonly password: string
    private readonly email: string

    private constructor(password: string, email: string) {
        this.password = password
        this.email = email
    }

    public get getPassword(): string {
        return this.password
    }

    public get getEmail(): string {
        return this.email
    }

    static create(props: Record<string, any>): LoginDto {
        const schema = z.object({
            email: z.string({ required_error: errorMessages.requiredField('email') }),
            password: z.string({ required_error: errorMessages.requiredField('password') }),
        })

        const schemaParsed = schema.safeParse({ ...props })

        if (schemaParsed.success === false) {
            throw CustomError.badRequest(schemaParsed.error.issues[0].message)
        }

        return new LoginDto(schemaParsed.data.password, schemaParsed.data.email)
    }
}
