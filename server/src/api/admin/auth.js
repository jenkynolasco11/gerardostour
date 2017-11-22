import Router from 'koa-router'
import passport from 'koa-passport'
// import React from 'react'
// import { renderToString } from 'react-dom/server'

import { User } from '../../models'

// import Login from '../../components/Login'
// import { Template } from '../../components'

const auth = new Router({ prefix : 'auth' })

const isAuthenticated = (ctx, next) => {
  if(ctx.isAuthenticated()) return ctx.redirect('/admin/dashboard')
  return next()
}

auth.get('/', isAuthenticated, ctx => {
  const script = '/js/login.js'

  // ..... Create more query errors depending the situation
  return ctx.render('login', { title : 'login', description : 'duh', script })
})

auth.post('/login', isAuthenticated, ctx => (
  passport.authenticate('local', {
    successRedirect : '/admin/dashboard',
    failureRedirect : '/admin/auth?valid=false',
  }, async (err, user, msg, done) => {
    if(user) {
      // TODO : Alter session last time connected in here
      await ctx.login(user)

      return ctx.body = { ok : true }
    }

    return ctx.body = { ok : false, msg }
  })(ctx))
)

auth.get('/logout', ctx => {
  console.log('logging out...')
  ctx.logout()

  return ctx.redirect('/admin/auth')
})

export default auth