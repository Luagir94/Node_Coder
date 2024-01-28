import { type ProductRepository } from '@/domain/repositories'
import { type Request, type Response } from 'express'

export class ProductController {
    //* DI
    constructor(private readonly productRepository: ProductRepository) {}

    public gerProducts = async (req: Request, res: Response) => {
        const { limit, offset } = req.query

        const products = await this.productRepository.getAll(+limit, +offset)
        return res.json(products)
    }

    public getProductById = async (req: Request, res: Response) => {
        const id = +req.params.id

        try {
            const product = await this.productRepository.findById(id)
            res.json(product)
        } catch (error) {
            res.status(400).json({ error })
        }
    }
}
