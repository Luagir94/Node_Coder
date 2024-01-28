import * as express from 'express'
import { type Router } from 'express'

interface ServerOptionsInterface {
    port: number
    routes: Router
    publicPath?: string
}

export class Server {
    private readonly app = express()
    private readonly port: number
    private readonly publicPath: string
    private readonly routes: Router

    constructor(options: ServerOptionsInterface) {
        const { port, routes, publicPath = 'public' } = options
        this.port = port
        this.publicPath = publicPath
        this.routes = routes
    }

    async start(): Promise<void> {
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))

        this.app.use(express.static(this.publicPath))

        this.app.use(this.routes)

        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`)
        })
    }
}
