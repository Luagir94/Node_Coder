import { CreateCartDto } from '@/domain/dto/cart/create-cart'
import { UpdateCartDto } from '@/domain/dto/cart/update-cart'
import { CustomError } from '@/domain/errors'
import { type CartRepository } from '@/domain/repositories'
import type { Request, Response } from 'express'

export class CartController {
    constructor(private readonly cartRepository: CartRepository) {}

    public getCarts = async (req: Request, res: Response) => {
        let { limit, offset } = req.query

        if (!limit) limit = '0'
        if (!offset) offset = ' 0'

        this.cartRepository
            .getAll(+limit, +offset)
            .then((carts) => {
                res.json(carts)
            })
            .catch((error) => this.handleError(error, res))
    }

    public getCartById = async (req: Request, res: Response) => {
        const id = req.params.id

        this.cartRepository
            .findById(id)
            .then((cart) => {
                res.json(cart)
            })
            .catch((error) => this.handleError(error, res))
    }

    public createCart = async (req: Request, res: Response) => {
        const [error, createCartDto] = CreateCartDto.create(req.body)
        if (error) return res.status(400).json({ error })

        this.cartRepository
            .create(createCartDto!)
            .then(() => {
                res.status(201).json({ message: 'Carrito creado' })
            })
            .catch((error) => this.handleError(error, res))
    }

    public updateCart = async (req: Request, res: Response) => {
        const id = req.params.id
        const [error, updateCartDto] = UpdateCartDto.create(req.body, id)
        if (error) return res.status(400).json({ error })

        this.cartRepository
            .update(updateCartDto!)
            .then(() => {
                res.status(200).json({ message: 'Carrito actualizado' })
            })
            .catch((error) => this.handleError(error, res))
    }

    public deleteCart = async (req: Request, res: Response) => {
        const id = req.params.id

        this.cartRepository
            .delete(id)
            .then(() => {
                res.status(200).json({ message: 'Carrito eliminado' })
            })
            .catch((error) => this.handleError(error, res))
    }

    private readonly handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message })
        }

        return res.status(500).json({ error: 'Internal server error' })
    }
}
