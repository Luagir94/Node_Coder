import { CreateProductDto, UpdateProductDto } from '@/domain/dto'
import { HandlerError } from '@/domain/errors'
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
            .catch((error) => HandlerError.responseFormat(error, res))
    }

    public getProductById = async (req: Request, res: Response) => {
        const id = req.params.id

        new GetProductUseCase(this.productRepository)
            .execute(id)
            .then((product) => {
                res.json(product)
            })
            .catch((error) => HandlerError.responseFormat(error, res))
    }

    public createProduct = async (req: Request, res: Response) => {
        try {
            const createProductDto = CreateProductDto.create(req.body)
            new CreateProductUseCase(this.productRepository)
                .execute(createProductDto!)
                .then(() => {
                    res.status(201).json({ message: 'Producto creado' })
                })
                .catch((error) => HandlerError.responseFormat(error, res))
        } catch (error) {
            HandlerError.responseFormat(error, res)
        }
    }

    public updateProduct = async (req: Request, res: Response) => {
        const id = req.params.id
        try {
            const updateProductDto = UpdateProductDto.create(req.body, id)
            new UpdateProductUseCase(this.productRepository)
                .execute(updateProductDto!)
                .then(() => {
                    res.status(200).json({ message: 'Producto actualizado' })
                })
                .catch((error) => HandlerError.responseFormat(error, res))
        } catch (error) {
            HandlerError.responseFormat(error, res)
        }
    }

    public deleteProduct = async (req: Request, res: Response) => {
        const id = req.params.id

        new DeleteProductUseCase(this.productRepository)
            .execute(id)
            .then(() => {
                res.status(200).json({ message: 'Producto eliminado' })
            })
            .catch((error) => HandlerError.responseFormat(error, res))
    }

    public getProductsView = async (req: Request, res: Response) => {
        let { limit, offset } = req.query

        if (!limit) limit = '0'
        if (!offset) offset = ' 0'

        new GetProductsUseCase(this.productRepository)
            .execute(+limit, +offset)
            .then((products) => {
                res.render('templates/allProducts', { products, mostrarProductos: true })
            })
            .catch((error) => {
                HandlerError.responseFormat(error, res)
            })
    }
}
