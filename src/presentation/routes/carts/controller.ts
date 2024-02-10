import { CreateCartDto, UpdateCartDto } from '@/domain/dto'
import { CustomError } from '@/domain/errors'
import { type CartRepository } from '@/domain/repositories'
import {
    CreateCartUseCase,
    DeleteCartUseCase,
    GetCarstUseCase,
    GetCartUseCase,
    UpdateCartUseCase,
} from '@/domain/use-cases'
import { LoggerService } from '@/infrastructure/services/logger'
import type { Request, Response } from 'express'
import { MongoError } from 'mongodb'
import mongoose from 'mongoose'

export class CartController {
    constructor(private readonly cartRepository: CartRepository) {}

    public getCarts = (req: Request, res: Response) => {
        let { limit, offset } = req.query

        if (!limit) limit = '0'
        if (!offset) offset = ' 0'

        new GetCarstUseCase(this.cartRepository)
            .execute(+limit, +offset)
            .then((carts) => {
                res.json(carts)
            })
            .catch((error) => this.handleError(error, res))
    }

    public getCartById = (req: Request, res: Response) => {
        const id = req.params.id

        new GetCartUseCase(this.cartRepository)
            .execute(id)
            .then((cart) => {
                res.json(cart)
            })
            .catch((error) => this.handleError(error, res))
    }

    public createCart = (req: Request, res: Response) => {
        const [error, createCartDto] = CreateCartDto.create(req.body)
        if (error) return res.status(400).json({ error })

        new CreateCartUseCase(this.cartRepository)
            .execute(createCartDto!)
            .then(() => {
                res.status(201).json({ message: 'Carrito creado' })
            })
            .catch((error) => this.handleError(error, res))
    }

    public updateCart = (req: Request, res: Response) => {
        const id = req.params.id
        const [error, updateCartDto] = UpdateCartDto.create(req.body, id)
        if (error) return res.status(400).json({ error })
        new UpdateCartUseCase(this.cartRepository)
            .execute(updateCartDto!)
            .then(() => {
                res.status(200).json({ message: 'Carrito actualizado' })
            })
            .catch((error) => this.handleError(error, res))
    }

    public deleteCart = (req: Request, res: Response) => {
        const id = req.params.id

        new DeleteCartUseCase(this.cartRepository)
            .execute(id)
            .then(() => {
                res.status(200).json({ message: 'Carrito eliminado' })
            })
            .catch((error) => this.handleError(error, res))
    }

    private readonly handleError = (error: unknown, res: Response) => {
        if (error instanceof mongoose.Error || error instanceof MongoError) {
            LoggerService.error(`DB Error: ${error.message}`)
            return res.status(500).json({ error: error.message })
        }

        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message })
        }

        return res.status(500).json({ error: 'Error desconocido' })
    }
}
