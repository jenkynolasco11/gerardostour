import Router from 'koa-router'

const dash = new Router({ prefix : 'dashboard' })
// const route = new Router()

const dashboard = { title : 'dashboard', description : 'well, duh!', type : ''}

dash.get('/', ctx => {
  console.log('here')
  if(ctx.isAuthenticated()) return ctx.render('dashboard', { msg : dashboard })
  console.log(`Is authenticated: ${ ctx.isAuthenticated() }`)
  console.log(`Session: ${ JSON.stringify(ctx.session) }`)
  return ctx.redirect('/admin/auth')
})

// dash.get('/dashboard', ctx => {
  
// })

// dash.use('/', auth.routes(), auth.allowedMethods())

// admin.use(auth.routes())
// admin.use('/', auth.routes(), auth.allowedMethods())

// admin.get('/auth', ctx => {
//   ctx.render('login', { title : 'login', description : 'duh' })
// })
// pblc.get('/logout/:id', ctx => {
// })

// pblc.get('/:id', ctx => {
// })

// route.use('/', pblc.routes(), pblc.allowedMethods())

export default dash