import Router from 'koa-router'
import passport from 'koa-passport'

import { ALLOWED_USERS } from '../../../config'
import { User } from '../../../models'

const auth = new Router({ prefix : 'auth' })

// const isAuthenticated = (ctx, next) => {
//   if(ctx.isAuthenticated()) return next()

//   return ctx.redirect('/')
// }

auth.post('/login', ctx => {
  // console.log(ctx.headers)
  // console.log(ctx.request.body)
  if(ctx.isAuthenticated()) {
    const { user } = ctx.state

    const data = {
      username : user.username,
      lastSession : user.lastSession
    }

    return ctx.body = { ok : true, data : { userInfo : data }, message : '' }
  }

  return passport.authenticate('local', async (err, user, msg) => {
    if(user) {
      if(!ALLOWED_USERS.includes(user.position)) return ctx.body = { ok : false, data : null, message : 'You are not authorized to log in. Contact an Admin.' }

      // Alter last session connected here
      await User.findByIdAndUpdate(user, { lastSession : Date.now() })
      await ctx.login(user)

      const data = {
        username : user.username,
        lastSession : user.lastSession
      }
      // console.log(ctx.session)
      // console.log(`Is authenticated ? ${ ctx.isAuthenticated() }`)

      return ctx.body = { ok : true, data : { userInfo : data }, message : '' }
    }

    ctx.status = 401 // unauthorized

    return ctx.body = { ok : false, data : null, message : msg }
  })(ctx)
})

// TODO : give an use to the username
// (for logging or do something if :username wants to log off)
auth.get('/logout', /* isAuthenticated, */ ctx => {
// auth.get('/logout/:username', isAuthenticated, ctx => {
  // const { username } = ctx.params

  if(ctx.state.user) {
    console.log(`${ ctx.state.user.username } is logging out...`)
    ctx.logout()

    return ctx.body = { ok : true, data : null, message : 'User logged out' }
  }

  return ctx.body = { ok : false, data : null, message : '' }
})

auth.get('/check-auth', ctx => {
  // console.log(ctx.session)
  // console.log(`User is ${ ctx.isAuthenticated() ? '' : 'not' } authenticated`)

  if(ctx.isAuthenticated()) {
    const { username, lastSession } = ctx.state.user

    const data = {
      username,
      lastSession
    }

    return ctx.body = { ok : true, data : { userInfo : data }, message : '' }
  }

  return ctx.body = { ok : false, data : null, message : 'There is no saved session available' }
})

export default auth