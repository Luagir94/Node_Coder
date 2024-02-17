import { CreateCartDto, UpdateCartDto } from '@/domain/dto'
import { HandlerError } from '@/domain/errors'
import { type CartRepository } from '@/domain/repositories'
import {
    CreateCartUseCase,
    DeleteCartUseCase,
    GetCarstUseCase,
    GetCartUseCase,
    UpdateCartUseCase,
} from '@/domain/use-cases'
import type { Request, Response } from 'express'

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
            .catch((error) => HandlerError.responseFormat(error, res))
    }

    public getCartById = (req: Request, res: Response) => {
        const id = req.params.id

        new GetCartUseCase(this.cartRepository)
            .execute(id)
            .then((cart) => {
                res.json(cart)
            })
            .catch((error) => HandlerError.responseFormat(error, res))
    }

    public createCart = (req: Request, res: Response) => {
        try {
            const createCartDto = CreateCartDto.create(req.body)

            new CreateCartUseCase(this.cartRepository)
                .execute(createCartDto!)
                .then(() => {
                    res.status(201).json({ message: 'Carrito creado' })
                })
                .catch((error) => HandlerError.responseFormat(error, res))
        } catch (error) {
            HandlerError.responseFormat(error, res)
        }
    }

    public updateCart = (req: Request, res: Response) => {
        const id = req.params.id
        try {
            const updateCartDto = UpdateCartDto.create(req.body, id)
            new UpdateCartUseCase(this.cartRepository)
                .execute(updateCartDto!)
                .then(() => {
                    res.status(200).json({ message: 'Carrito actualizado' })
                })
                .catch((error) => HandlerError.responseFormat(error, res))
        } catch (error) {
            HandlerError.responseFormat(error, res)
        }
    }

    public deleteCart = (req: Request, res: Response) => {
        const id = req.params.id

        new DeleteCartUseCase(this.cartRepository)
            .execute(id)
            .then(() => {
                res.status(200).json({ message: 'Carrito eliminado' })
            })
            .catch((error) => HandlerError.responseFormat(error, res))
    }
}
