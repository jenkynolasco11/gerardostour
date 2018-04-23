import Router from 'koa-router'

const api = new Router({ prefix : '/api/v1.1' })

const apiRoutes = [
    // route,
    // ticket,
    // auth,
    // user,
    // ride,
    // bus,
]

// Combine all routes to api
apiRoutes.forEach(route => {
    api.use('/', route.routes(), route.allowedMethods())
})

export default api
