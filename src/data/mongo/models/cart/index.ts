import { randomUUID } from 'crypto'
import mongoose, { type Document, Schema, type Types } from 'mongoose'

export interface IProductInCart {
    product_id: string
    quantity: number
}

export interface ICart extends Document {
    products: Types.DocumentArray<IProductInCart>
}

const schema = new Schema<ICart>({
    products: {
        type: [
            {
                product_id: { type: String, required: true },
                quantity: { type: Number, required: true },
            },
        ],
        required: true,
    },
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
