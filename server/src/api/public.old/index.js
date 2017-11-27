import Router from 'koa-router'

const pblc = new Router({ prefix : '' })
// const route = new Router()

pblc.get('/', ctx => {
  ctx.redirect('/auth')
})

pblc.get('/auth', ctx => {
  
  ctx.render('login', { title : 'login', description : 'duh' })
})
// pblc.get('/logout/:id', ctx => {
// })

// pblc.get('/:id', ctx => {
// })

// route.use('/', pblc.routes(), pblc.allowedMethods())

export default pblc