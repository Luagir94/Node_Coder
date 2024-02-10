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
    name: String,
    price: Number,
    stock: Number,
    category: String,
    status: Boolean,
    description: String,
    thumbnail: [String],
    code: String,
    slug: { type: String, index: true, unique: true },
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
