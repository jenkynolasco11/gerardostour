import Router from 'koa-router'

import api from './api'

const rootRoute = new Router()

const routes = [
  api,
]

// Combine all routes to api
routes.forEach(route => {
  rootRoute.use('/', route.routes(), route.allowedMethods())
})

rootRoute.stack.forEach(p => console.log(p.path /* , p.methods*/ ))

export default rootRoute.routes()