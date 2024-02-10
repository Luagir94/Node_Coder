import { type IAddress } from '@/data/mongo/models/user'
import { type USER_ROLE } from '@/domain/types/enum'

export interface UserEntityData {
    id: string
    name: string
    email: string
    role: USER_ROLE
    address: IAddress
}

export class UserEntity {
    private readonly id: string
    private readonly name: string
    private readonly email: string
    private readonly password: string
    private readonly role: USER_ROLE
    private readonly address: IAddress

    constructor(id: string, name: string, email: string, password: string, role: USER_ROLE, address: IAddress) {
        this.id = id
        this.name = name
        this.email = email
        this.password = password
        this.role = role
        this.address = address
    }

    public get getData(): UserEntityData {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            role: this.role,
            address: this.address,
        }
    }

    public get getPassword(): string {
        return this.password
    }

    public static fromObject(object: Record<string, any>): UserEntity {
        const { id, name, email, password, role, address } = object

        return new UserEntity(id, name, email, password, role, address)
    }
}
