import Router from 'koa-router'

const auth = new Router({ prefix : 'auth' })
// const routes = new Router()

auth.post('/login', ctx => {
  const { user, pass } = ctx.request.body.fields

  // console.log(ctx.request.body)

  const canAuth = (user === 'jenky' && pass === 'lllll')
  // console.log(`YOU SHALL ${ canAuth ? '' : 'NOT ' }PASS!`)

  // Work this out later
  if(user === 'jenky' && pass === 'lllll') return ctx.body = { user, id : 1, isAuth : true }

  return ctx.body = { auth : false }
})

auth.get('/logout/:id', ctx => {
  console.log(`Check logout for user ${ ctx.params.id }...`)
  return ctx.body = { ok : true }
})

auth.get('/:id', ctx => {
  // console.log(ctx.params)
  if(ctx.params.id === '1') return ctx.body = { ok : true }
  return ctx.body = { ok : false }
})

// auth.use('/auth', routes.routes(), routes.allowedMethods())

export default auth