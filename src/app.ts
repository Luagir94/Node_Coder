// eslint-disable-next-line @typescript-eslint/no-var-requires
require('tsconfig-paths').register()

// eslint-disable-next-line import/first
import { AppRoutes } from '@/presentation/routes'
// eslint-disable-next-line import/first
import { Server } from '@/presentation/server'

void (async () => {
    main()
})()

function main(): void {
    const server = new Server({
        port: 3000,
        routes: AppRoutes.routes,
    })

    void server.start()
}
