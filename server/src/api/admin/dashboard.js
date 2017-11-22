import Router from 'koa-router'

const dash = new Router({ prefix : 'dashboard' })

const dashboard = { title : 'dashboard', description : 'well, duh!', type : ''}

dash.get('/', ctx => {
  console.log('here')
  if(ctx.isAuthenticated()) return ctx.render('dashboard', { msg : dashboard })
  console.log(`Is authenticated: ${ ctx.isAuthenticated() }`)
  console.log(`Session: ${ JSON.stringify(ctx.session) }`)
  return ctx.redirect('/admin/auth')
})

export default dash