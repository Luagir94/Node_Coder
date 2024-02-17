require('tsconfig-paths').register()

import { envs } from '@/config'
import { MongoDatabase } from '@/data/mongo'
import { server } from '@/presentation/server'

void (async () => {
    await main()
})()

async function main(): Promise<void> {
    await MongoDatabase.connect({
        mongoUrl: envs.MONGO_URL,
        dbName: envs.MONGO_DB_NAME,
    })

    void server.start()
}
