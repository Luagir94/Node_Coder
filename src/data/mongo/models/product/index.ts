import { randomUUID } from 'crypto'
import mongoose, { type Document, Schema } from 'mongoose'

interface IProduct extends Document {
    name: string
    price: number
    stock: number
    category: string
    status: boolean
    description: string
    thumbnail: string[]
    code: string
    slug: { type: string; unique: true }
    id: string
}

const schema = new Schema<IProduct>({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    status: { type: Boolean, required: true },
    description: { type: String, required: true },
    thumbnail: [{ type: String, required: true }],
    code: { type: String, required: true, unique: true, index: true },
    slug: { type: String, index: true, unique: true, required: true },
    _id: { type: String, default: () => randomUUID() },
})

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id
        delete ret._id
    },
})

export const ProductModel = mongoose.model<IProduct>('Product', schema)
