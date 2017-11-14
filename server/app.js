import Koa from 'koa'
import logger from 'koa-logger'
// import bodyparser from 'koa-bodyparser'
import bodyparser from 'koa-body'

import config from './config'

import routes from './src/routes'

const app = new Koa()

app
  .use(bodyparser({ multipart : true }))
  .use(logger())
  .use(routes)
  // .use((ctx, next) => {
  //   console.log(ctx)
  //   next()
  // })

const port = (process.env.PORT || config.PORT)

app.listen(port, () => {
  console.log(`Started server at ${ port }`)
})