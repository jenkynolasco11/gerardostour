import Router from 'koa-router'

// import auth from './auth'
// import user from './user'
// import route from './route'
import ride from './ride'
import ticket from './ticket'
import bus from './bus'

const api = new Router({ prefix : 'api/v1' })

const apiRoutes = [
  // route,
  // auth,
  // user,
  ticket,
  ride,
  bus,
]

// Combine all routes to api
apiRoutes.forEach(route => {
  api.use('/', route.routes(), route.allowedMethods())
})

export default api