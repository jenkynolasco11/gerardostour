import Router from 'koa-router'
import passport from 'koa-passport'

import { User } from '../../models'

const auth = new Router({ prefix : 'auth' })

auth.get('/', ctx => {
  // If user is authenticated
  if(ctx.isAuthenticated()) return ctx.redirect('/admin/dashboard')

  const { query } = ctx
  const msg = { type : 'none', message : '' }
  // console.log(`Query: ${ JSON.stringify( query ) }`)

  if(query.error) {
    msg.type = 'error'
    msg.message = 'Please, try again'
  }

  // ..... Create more query errors depending the situation

  return ctx.render('login', { title : 'login', description : 'duh', msg })
})

auth.post('/login', ctx => {
  return passport.authenticate('local', {
    successRedirect : '/admin/dashboard',
    failureRedirect : '/admin/auth?valid=false',
  }, async (err, user, info, done) => {
    if(user) {
      // TODO : Alter session last time connected in here
      // ctx.body = { success : true }
      await ctx.login(user)

      //  console.log(`Session: ${ JSON.stringify(ctx.session) }`)
      return ctx.redirect('/admin/dashboard')
      // console.log(info)
      // return done(null, true)
    }

    // return done(null, false)
    // ctx.body = { success : false }
    return ctx.redirect('/admin/auth?valid=false')
    // setTimeout(() => ctx.redirect('/admin/auth?valid=false'), 4000)
  })(ctx)
})

// auth.get('/login', ctx => {
//   console.log(`Session: ${ JSON.stringify(ctx.session) } (/admin/auth/login)`)
// })

auth.get('/logout', ctx => {
  console.log('logging out...')
  ctx.logout()
  return ctx.redirect('/admin/auth')
})

export default auth