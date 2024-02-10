import { USER_ROLE } from '@/domain/types/enum'
import { randomUUID } from 'crypto'
import mongoose, { type Document, Schema } from 'mongoose'

export interface IAddress {
    street: string
    city: string
    state: string
    zip: string
    country: string
}

export interface IUser extends Document {
    email: string
    password: string
    firstName: string
    lastName: string
    role: USER_ROLE
    address: IAddress
}

const schema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    _id: { type: String, default: () => randomUUID() },
    lastName: { type: String, required: true },
    role: { type: String, required: true, enum: Object.values(USER_ROLE) },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
        country: { type: String, required: true },
    },
})

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id
        delete ret._id
    },
})

export const UserModel = mongoose.model<IUser>('User', schema)
