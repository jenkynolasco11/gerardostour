import Router from 'koa-router'

import api from './api'
// import auth from './auth'

const rootRoute = new Router()

const routes = [
  api,
  // auth,
]

// Combine all routes to api
routes.forEach(route => {
  rootRoute.use('/', route.routes(), route.allowedMethods())
})

// rootRoute.stack.forEach(p => console.log(
//   p.path,
//   // p.methods
// ))

export default rootRoute.routes()