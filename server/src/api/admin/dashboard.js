import Router from 'koa-router'

const dash = new Router({ prefix : 'dashboard' })

dash.get('/', ctx => {  
  console.log('dashboard')
  // console.log(ctx.state.user)

  if(ctx.isAuthenticated()) {
    const script = '/js/dashboard.js'
    const params = { title : 'dashboard', description : 'well, duh!', type : '', script }  

    return ctx.render('dashboard', params )
  }

  console.log(`Is authenticated: ${ ctx.isAuthenticated() }`)
  console.log(`Session: ${ JSON.stringify(ctx.session) }`)
  return ctx.redirect('/admin/auth')
})

export default dash