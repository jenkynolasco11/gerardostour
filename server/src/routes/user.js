import Router from 'koa-router'

const user = new Router()
const routes = new Router()

routes.get('/available', ctx => {
  // console.log('check available')
  return ctx.body = { ok : true }
})

routes.get('/no-available', ctx => {
  // console.log('check non available')
  return ctx.body = { ok : true }
})

routes.get('/passenger/:id', ctx => {
  return ctx.body = {
    id : 'x0001',
    name : 'Fulanito de tal',
    address : 'XXXX Burge Ave, SomePlace, SI 10004',
    phone : '555-554-3425',
    notes : 'This guy is crazy nuts. Handle with care'
  }
})

user.use('/user', routes.routes(), routes.allowedMethods())

export default user