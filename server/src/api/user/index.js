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

      return { _id, personid, username, firstname, lastname, type, phoneNumber, lastSession }
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

user.post('/insert', async ctx => {
  const { uid = '', pid = '', username, firstname, lastname, password, phoneNumber, position = 'NONE' } = ctx.request.body

  try {
    const p = await Person.findById(pid)
    const u = await User.findById(uid)

    if(p) {
      await Person.update({ _id : pid }, {
        firstname, 
        lastname, 
        phoneNumber
      })

      const pass = u.generateHash(password)

      await User.update({ _id : uid }, {
        username,
        password : pass,
        position
      })

      return ctx.body = { data : true, message : 'User saved satisfactorily!' }
    } else {
      const person = await new Person({
        firstname,
        lastname, 
        phoneNumber
      }).save()

      const usr = new User({
        username,
        position,
        personid : person._id,
      })

      usr.password = usr.generateHash(password)

      await usr.save()

      return ctx.body = { data : true, message : '' }
    }

  } catch (e) {
    return ctx.body = { data : null, message : 'Error while saving the user to the DB' }
  }
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