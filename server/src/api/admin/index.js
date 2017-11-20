import Router from 'koa-router'

import auth from './auth'
import dash from './dashboard'

const admin = new Router({ prefix : 'admin' })

admin.get('/', ctx => {
  console.log(ctx.session)
  ctx.redirect('/admin/auth')
})

// admin.get('/dashboard', ctx => {
//   if(ctx.isAuthenticated()) return console.log('it got here!!!!!!! (admin/auth.js)')
//   console.log(`Is authenticated: ${ ctx.isAuthenticated() }`)
//   console.log(`Session: ${ JSON.stringify(ctx.session) }`)
//   return ctx.redirect('/admin/auth')
// })

admin.use('/', auth.routes(), auth.allowedMethods())
admin.use('/', dash.routes(), dash.allowedMethods())
// admin.use(auth.routes())
// admin.use('/', auth.routes(), auth.allowedMethods())

// admin.get('/auth', ctx => {
//   ctx.render('login', { title : 'login', description : 'duh' })
// })
// pblc.get('/logout/:id', ctx => {
// })

// pblc.get('/:id', ctx => {
// })

// admin.use('/', pblc.routes(), pblc.allowedMethods())

export default admin