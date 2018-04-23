import Koa from 'koa'
import http from 'http'
import body from 'koa-body'
import logger from 'koa-logger'
import serve from 'koa-static'
import session from 'koa-generic-session'
import cors from 'koa2-cors'
import mongoose from 'mongoose'
import bluebird from 'bluebird'
import path from 'path'

import error404 from './routes/404'
import config from './config'

global.Promise = bluebird.Promise
mongoose.Promise = bluebird.Promise

const dbFunctions = db => {
    db.on('disconnected', () => {
        console.log('MongoDB connection failed... Reconnecting...')
        mongoose.connect(config.DBURI, { autoReconnect : true })
    })
}

const server = async function(port, done) {
    try {
        await mongoose.connect(config.DBURI, { autoReconnect : true })

        dbFunctions(mongoose.connection)

        const app = new Koa()

        const sessionParams = {
            key : config.KEY,
            signed : true
        }

        app.keys = config.KEYS

        app
            .use(body({ multipart : true }))
            .use(logger())
            .use(session(sessionParams, app))
            .use(cors({
                origin : 'http://localhost:3000',
                credentials : true,
                exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
                allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cache-Control']
            }))
            .use(serve(path.resolve(__dirname, 'public')))
            .use(error404)

        const PORT = port || process.env.PORT || config.PORT || 8000

        const application = http.createServer(app.callback())
        const srvr = await application.listen(PORT)

        console.log(`Started server at port ${ PORT }...`)

        if(done) done()

        return srvr
    } catch (e) {
        console.log(e)
        process.exit()
    }

    return null
}

export default server
