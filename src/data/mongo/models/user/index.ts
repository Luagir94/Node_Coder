import { type UserRole } from '@/domain/types/enum'
import mongoose, { type Document, Schema } from 'mongoose'

export interface IAddress extends Document {
    street: string
    city: string
    state: string
    zip: string
    country: string
    id: mongoose.Types.UUID
}

export interface IUser extends Document {
    email: string
    password: string
    id: mongoose.Types.UUID
    firstName: string
    lastName: string
    role: UserRole
    address: IAddress
}

const schema = new Schema<IUser>({
    email: String,
    password: String,
    firstName: String,
    id: mongoose.Types.UUID,
    lastName: String,
    role: String,
    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
    },
})

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id
    },
})

export const UserModel = mongoose.model<IUser>('User', schema)
