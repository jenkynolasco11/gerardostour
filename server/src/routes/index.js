// import combine from 'koa-combine-routers'
import Router from 'koa-router'

import auth from './auth'
import user from './user'
import ride from './ride'

const api = new Router()

const routes = [
  auth,
  user,
  ride,
]

routes.forEach(route => {
  api.use('/api', route.routes(), route.allowedMethods())
})

// const routers = combine([
//     api
// ])

// api.stack.map(i => console.log(i.path))

export default api.routes()