import Router from 'koa-router'

import { User, Person } from '../../models'

const user = new Router({ prefix : 'user' })

user.get('/all', async ctx => {
  const { limit = 10, skip = 0, type = 'NONE' } = ctx.query

  try {
    const query = await User.find({ position : type }).skip(+skip).limit(+limit).exec()
    const count = await User.count({ position : type })

    const users = await Promise.all(query.map( async usr => {
      const { _id, personid, username, lastSession } = usr

      const person = await Person.findById(personid)

      const { firstname, lastname, phoneNumber } = person

      return { _id, personid, username, lastSession, firstname, lastname, phoneNumber }
    }))

    return ctx.body = { data : { users, count }, message : null }
  } catch (e) {
    return ctx.body = { data : null, message : 'Error retrieving users' }
  }
})

user.get('/current', async ctx => {
  const { personid } = ctx.state.user
  try {
    const { firstname, lastname } = await Person.findById(personid)

    return ctx.body = { data : { firstname, lastname }, message : null }
  } catch (e) {
    return ctx.body = {}
  }
  // return ctx.body = ctx.state.user
})

user.get('/available', ctx => {
  // console.log('check available')
  return ctx.body = { ok : true }
})

user.get('/no-available', ctx => {
  // console.log('check non available')
  return ctx.body = { ok : true }
})

user.get('/passenger/:id', /*async*/ ctx => {
  // const { id } = ctx.query

  return ctx.body = {
    id : 'x0001',
    name : 'Fulanito de tal',
    address : 'XXXX Burge Ave, SomePlace, SI 10004',
    phone : '555-554-3425',
    notes : 'This guy is crazy nuts. Handle with care'
  }
})

export default user