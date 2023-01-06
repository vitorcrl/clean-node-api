import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import env from './config/env'

MongoHelper.connect(env.mongoUrl)
    .then(async () => {
        const app = (await import('./config/app')).default
        app.listen(env.port, () =>
            console.log(`Server is running at http://localhost:${env.mongoUrl}
            http://localhost:5050/api/signup`)
        )
    })
    .catch(console.error)
