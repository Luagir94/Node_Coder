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

    static create(props: Record<string, any>): [string?, LoginDto?] {
        const schema = z.object({
            email: z.string({ required_error: errorMessages.requiredField('email') }),
            password: z.string({ required_error: errorMessages.requiredField('password') }),
        })

        try {
            const schemaParsed = schema.safeParse({ ...props })

            if (schemaParsed.success === false) {
                return [schemaParsed.error.issues[0].message]
            }

            return [undefined, new LoginDto(schemaParsed.data.password, schemaParsed.data.email)]
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
