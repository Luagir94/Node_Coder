import { envs } from '@/config'
import { LoggerService } from '@/infrastructure/services/logger'
import { AppRoutes } from '@/presentation/routes'
import * as cookieParser from 'cookie-parser'
import * as express from 'express'
import { type Router } from 'express'
import { engine } from 'express-handlebars'
import { Server as HttpServer } from 'http'
import * as socketIo from 'socket.io'

interface ServerOptionsInterface {
    port: number
    routes: Router
    dirName: string
    publicPath?: string
}

export class Server {
    private readonly app = express()
    private readonly port: number
    private readonly publicPath: string
    private readonly routes: Router

    private httpServer: HttpServer
    private io: socketIo.Server

    constructor(options: ServerOptionsInterface) {
        const { port, routes, dirName, publicPath = 'public' } = options
        this.port = port
        this.publicPath = publicPath
        this.routes = routes
        this.httpServer = new HttpServer(this.app)
        this.io = new socketIo.Server(this.httpServer)
        this.app.engine(
            'hbs',
            engine({
                extname: 'hbs',
            })
        )
        this.app.set('view engine', 'hbs')
        this.app.set('views', dirName)
        this.app.use(cookieParser(envs.JWT_SECRET))
        this.io.on('connection', (socket: socketIo.Socket) => {
            LoggerService.info('a user connected')

            socket.on('disconnect', () => {
                LoggerService.info('user disconnected')
            })
        })
    }

    public get getIo() {
        return this.io
    }

    async start(): Promise<void> {
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use('/api', this.routes)
        this.app.use(express.static(this.publicPath))

        this.httpServer = new HttpServer(this.app)
        this.io = new socketIo.Server(this.httpServer)

        this.httpServer.listen(this.port, () => {
            LoggerService.info(`Server running on port ${this.port}`)
        })

        this.io.on('connection', (socket: socketIo.Socket) => {
            LoggerService.info('a user connected')

            socket.on('disconnect', () => {
                LoggerService.info('user disconnected')
            })
        })

        this.app.get('/', (req, res) => {
            res.send('Hello World')
        })
    }
}

export const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
    dirName: __dirname + '/views',
})

const socketService = server.getIo
