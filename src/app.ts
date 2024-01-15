import { DatasourceImpl } from './datasource'
import { Product, ProductManager } from './entities'

const datasource = new DatasourceImpl('data/products.json')
const productManager = new ProductManager(datasource)

const getLastId = async (): Promise<number> => {
    const data = await datasource.getElements()
    const lastId = data[data.length - 1]?._Id + 1

    return isNaN(lastId) ? 1 : lastId
}

void (async () => {
    Product.setLastId(await getLastId())
    const product = new Product(
        'Product 1',
        100,
        'Description',
        'thumbnail',
        10,
        'code'
    )
    await productManager.addProduct(product)
    const product2 = new Product(
        'Product 2',
        100,
        'Description',
        'thumbnail',
        10,
        'code'
    )
    await productManager.addProduct(product2)
    const products = await productManager.getProducts()
    console.log(products)
    await productManager.deleteProduct(1)
    await productManager.updateProduct(
        {
            _Title: 'Product 2 Updated',
            _Price: 200,
            _Description: 'Description Updated',
            _Thumbnail: 'thumbnail Updated',
            _Stock: 20,
            _Code: 'code Updated',
        },
        2
    )
    console.log(products)
    console.log(await productManager.getProduct(2))
})()
