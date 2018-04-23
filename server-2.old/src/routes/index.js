import Router from 'koa-router'

import api from './api'

const rootRoute = new Router()

const routes = [
    api,
]

// Combine all routes to api
routes.forEach(route => {
    rootRoute.use('/', route.routes(), route.allowedMethods())
})

/* ***********************/
/** FOR TESTING PURPOSES */
/* ***********************/
rootRoute.get('/*', ctx => {
  // TODO : Reconsider this redirect in here
    return ctx.render('index', { appurl : process.env.PORT })
})
/* ***********************/

// /* For testing the routes being added to the stack */
// rootRoute.stack.forEach(p => console.log(
//   p.path,
//   p.methods
// ))

export default rootRoute.routes()
