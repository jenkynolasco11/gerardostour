import Router from 'koa-router'
import passport from 'koa-passport'

import { User } from '../../models'

const auth = new Router({ prefix : 'auth' })

const isAuthenticated = (ctx, next) => {
  if(ctx.isAuthenticated()) return ctx.redirect('/admin/dashboard')
  return next()
}

auth.get('/', isAuthenticated, ctx => {
  const script = '/js/login.js'
  const params = { title : 'login', description : 'duh', script }

  // ..... Create more query errors depending the situation
  return ctx.render('login', params)
})

auth.post('/login', isAuthenticated, ctx => (
  passport.authenticate('local', {
    successRedirect : '/admin/dashboard',
    failureRedirect : '/admin/auth?valid=false',
  }, async (err, user, msg, done) => {
    if(user) {
      // TODO : Alter session last time connected in here
      if(user.position !== 'ADMIN') return ctx.body = { ok : false, msg : 'You are not authorized to log in. Contact an Admin.' }

      await ctx.login(user)

      return ctx.body = { ok : true }
    }

    return ctx.body = { ok : false, msg }
  })(ctx))
)

auth.get('/logout', ctx => {

  if(!ctx.state.user) return ctx.body = { data : { ok : true }, message : '' }

  console.log(`${ ctx.state.user.username } is logging out...`)
  ctx.logout()

  return ctx.body = { data : { ok : true }, message : '' }
})

export default auth