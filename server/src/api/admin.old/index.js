import Router from 'koa-router'

import auth from './auth'
import dash from './dashboard'

const admin = new Router({ prefix : 'admin' })

admin.get('/', ctx => {
  // console.log(ctx.session)
  ctx.redirect('/admin/auth')
})

admin.use('/', auth.routes(), auth.allowedMethods())
admin.use('/', dash.routes(), dash.allowedMethods())

export default admin