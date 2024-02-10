import { randomUUID } from 'crypto'
import mongoose, { type Document, Schema } from 'mongoose'

export interface IProductInCart extends Document {
    product_id: string
    quantity: number
}

export interface ICart extends Document {
    products: IProductInCart[]
}

const productInCartSchema = new Schema<IProductInCart>({
    product_id: { type: String, ref: 'Product' },
    quantity: Number,
    _id: { type: String, default: () => randomUUID() },
})

const schema = new Schema<ICart>({
    products: [productInCartSchema],
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

export const CartModel = mongoose.model<ICart>('Cart', schema)
