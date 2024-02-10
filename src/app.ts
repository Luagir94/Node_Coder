require('tsconfig-paths').register()

import { envs } from '@/config'
import { MongoDatabase } from '@/data/mongo'
import { AppRoutes } from '@/presentation/routes'
import { Server } from '@/presentation/server'

void (async () => {
    await main()
})()

async function main(): Promise<void> {
    await MongoDatabase.connect({
        mongoUrl: envs.MONGO_URL,
        dbName: envs.MONGO_DB_NAME,
    })

    const server = new Server({
        port: envs.PORT,
        routes: AppRoutes.routes,
    })

    void server.start()
}
