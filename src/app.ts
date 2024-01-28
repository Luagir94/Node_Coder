require('tsconfig-paths').register()

import { AppRoutes } from '@/presentation/routes'
import { Server } from '@/presentation/server'

void (async () => {
    main()
})()

function main(): void {
    const server = new Server({
        port: 8080,
        routes: AppRoutes.routes,
    })

    void server.start()
}
