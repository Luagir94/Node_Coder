import { CreateProductDto } from '@/domain/dto'
import { UpdateProductDto } from '@/domain/dto/product/update-product'
import { CustomError } from '@/domain/errors'
import { type ProductRepository } from '@/domain/repositories'
import {
    CreateProductUseCase,
    DeleteProductUseCase,
    GetProductsUseCase,
    GetProductUseCase,
    UpdateProductUseCase,
} from '@/domain/use-cases'
import { type Request, type Response } from 'express'

export class ProductController {
    constructor(private readonly productRepository: ProductRepository) {}

    public getProducts = async (req: Request, res: Response) => {
        let { limit, offset } = req.query

        if (!limit) limit = '0'
        if (!offset) offset = ' 0'

        new GetProductsUseCase(this.productRepository)
            .execute(+limit, +offset)
            .then((products) => {
                res.json(products)
            })
            .catch((error) => this.handleError(error, res))
    }

    public getProductById = async (req: Request, res: Response) => {
        const id = req.params.id

        new GetProductUseCase(this.productRepository)
            .execute(id)
            .then((product) => {
                res.json(product)
            })
            .catch((error) => this.handleError(error, res))
    }

    public createProduct = async (req: Request, res: Response) => {
        const [error, createProductDto] = CreateProductDto.create(req.body)
        if (error) return res.status(400).json({ error })

        new CreateProductUseCase(this.productRepository)
            .execute(createProductDto!)
            .then(() => {
                res.status(201).json({ message: 'Producto creado' })
            })
            .catch((error) => this.handleError(error, res))
    }

    public updateProduct = async (req: Request, res: Response) => {
        const id = req.params.id
        const [error, updateProductDto] = UpdateProductDto.create(req.body, id)
        if (error) return res.status(400).json({ error })

        new UpdateProductUseCase(this.productRepository)
            .execute(updateProductDto!)
            .then(() => {
                res.status(200).json({ message: 'Producto actualizado' })
            })
            .catch((error) => this.handleError(error, res))
    }

    public deleteProduct = async (req: Request, res: Response) => {
        const id = req.params.id

        new DeleteProductUseCase(this.productRepository)
            .execute(id)
            .then(() => {
                res.status(200).json({ message: 'Producto eliminado' })
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
