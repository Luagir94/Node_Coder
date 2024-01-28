import { CustomError } from '@/domain/errors'
import { type ProductRepository } from '@/domain/repositories'
import { LoggerService } from '@/domain/services/logger'
import { type Request, type Response } from 'express'

export class ProductController {
    //* DI
    constructor(private readonly productRepository: ProductRepository) {}

    public gerProducts = async (req: Request, res: Response) => {
        let { limit, offset } = req.query

        if (!limit) limit = '0'
        if (!offset) offset = ' 0'

        this.productRepository
            .getAll(+limit, +offset)
            .then((products) => {
                res.json(products)
            })
            .catch((error) => this.handleError(error, res))
    }

    getProductById = async (req: Request, res: Response) => {
        const id = +req.params.id

        await this.productRepository
            .findById(id)
            .then((product) => {
                res.json(product)
            })
            .catch((error) => this.handleError(error, res))
    }

    private readonly handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            LoggerService.error(`${error.message}`)
            return res.status(error.statusCode).json({ error: error.message })
        }

        return res.status(500).json({ error: 'Internal server error' })
    }
}
