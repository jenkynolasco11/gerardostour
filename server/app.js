import Koa from 'koa'
import logger from 'koa-logger'
import bodyparser from 'koa-body'
// import bodyparser from 'koa-better-body'
import Pug from 'koa-pug'
import mongoose from 'mongoose'
import serve from 'koa-static'
import session from 'koa-session'
import SessionStore from 'koa-session-mongoose'
// import mongoSession from 'koa-session-mongo'
import bluebird from 'bluebird'
import passport from 'koa-passport'

/* Dev configuration */
// import webpackDM from 'koa-webpack-dev-middleware'
// import webpackHM from 'koa-webpack-hot-middleware'
// import webpack from 'webpack'
// import { bundleConfig } from './webpack.config.babel'
// const compiler = webpack(bundleConfig)
// /////////

import config from './config'
import routes from './src/api'

import './passport'

// Assign better Promise to global/mongoose
global.Promise = bluebird.Promise
// mongoose.Promise = bluebird.Promise

const server = async () => {
  try {
    await mongoose.connect(config.DBURI, { useMongoClient : true })

    const app = new Koa()

    // Views Config
    const pug = new Pug({
      debug : false,
      pretty : false,
      compileDebug : false,
      noCache : false, // TODO : Remove this in production
      viewPath : './src/public/views',
      app,
    })

    // Sessions Config
    const store = new SessionStore()
    // const store = mongoSession.create({ url : config.DBURI })
    const sessionParams = {
      // store
      key : config.KEY,
      // keys : config.SESSIONID,
      // store
    }

    app.keys = config.KEYS

    app
    /* Dev purposes */
      // .use(webpackDM(compiler, { noInfo : true, stats : { colors : true }, publicPath : bundleConfig.output.publicPath }))
      // .use(webpackHM(compiler))
    //////////////////
      .use(bodyparser({ multipart : true }))
      .use(serve('./src/public/assets'))
      .use(session(sessionParams, app))
      .use(passport.initialize())
      .use(passport.session())
      .use(logger())
      .use(routes)
      .use((ctx, next) => {
        // Safeguard!!!
        console.log('Where you going, duffo? (app.js)')
        // Everything needs authentication!!!!
        return ctx.redirect('/admin/auth')
      })

    const PORT = (process.env.PORT || config.PORT)

    await app.listen(PORT)
    console.log(`Started server at ${ PORT }`)
  } catch (e) {
    console.log(e)
    process.exit()
  }
}
server()