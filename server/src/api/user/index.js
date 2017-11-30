import Router from 'koa-router'

import { User, Person } from '../../models'

const user = new Router({ prefix : 'user' })

user.get('/all', async ctx => {
  const { limit = 10, skip = 0, type = 'NONE' } = ctx.query

  try {
    const query = await User.find({ position : type })
                            .skip(Number(skip))
                            .limit(Number(limit))
                            .exec()

    const count = await User.count({ position : type })

    const users = await Promise.all(query.map( async usr => {
      const { _id, personid, username, lastSession } = usr

      const person = await Person.findById(personid)

      const { firstname, lastname, phoneNumber } = person

      return {
        _id,
        personid,
        firstname,
        lastname,
        username,
        phoneNumber,
        type,
        lastSession,
      }
    }))

    return ctx.body = { data : { users, count }, message : null }
  } catch (e) {
    return ctx.body = { data : null, message : 'Error retrieving users' }
  }
})

user.get('/current', async ctx => {
  if(!ctx.state.user) return ctx.body = { 
    data : null,
    message : 'Error. There is no logged in user.'
  }

  const { personid = null } = ctx.state.user
  
  try {
    const { firstname, lastname } = await Person.findById(personid)

    return ctx.body = { data : { firstname, lastname }, message : null }
  } catch (e) {
    return ctx.body = {
      data : null,
      message : 'Error retrieving logged user. Are you logged in?'
    }
  }
})

user.post('/create-or-update', async ctx => {
  // IF PERSON EXISTS, UPDATE
  const {
    uid = '',
    pid = '',
    username,
    firstname,
    lastname,
    password,
    phoneNumber,
    position = 'NONE'
  } = ctx.request.body

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
    }
    // else {

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
    // }
  } catch (e) {
    return ctx.body = { 
      data : null, 
      message : 'Error while saving the user to the DB' 
    }
  }
})

export default user