// import combine from 'koa-combine-routers'
import Router from 'koa-router'

import auth from './auth'
import user from './user'
import ride from './ride'
import pblc from './public'
import admin from './admin'

const api = new Router({ prefix : 'api' })
const rootRoute = new Router({ prefix : '' })

// const publicRoutes = [
//   pblc
// ]

const apiRoutes = [
  auth,
  user,
  ride,
]

// Combine all routes to api
apiRoutes.forEach(route => {
  api.use('/', route.routes(), route.allowedMethods())
})

rootRoute.use('/', api.routes())
// rootRoute.use('', pblc.routes(), pblc.allowedMethods())
rootRoute.use('/', admin.routes(), admin.allowedMethods())

rootRoute.get('/', ctx => {
  if(ctx.isAuthenticated()) return ctx.redirect('/admin/dashboard')
  return ctx.redirect('/admin/auth')
})

rootRoute.stack.forEach(p => console.log(p.path/*, p.methods*/))

export default rootRoute.routes()