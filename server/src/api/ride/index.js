import Router from 'koa-router'

import { Ride, Ticket } from '../../models'

const ride = new Router({ prefix : 'ride' })

ride.get('/all', async ctx => {
  const { limit = 10, skip = 0 } = ctx.query

  try {
    const rides = await Ride.find({}).skip(+skip).limit(+limit).exec()
    // const count = await Ride.count({})

    return ctx.body = { ok : true, data : rides, message : null }

    // Uncomment this later
    // return ctx.body = { ok : true, data : { rides, count }, message : null }
  } catch (e) {
    return ctx.body = { ok : false, data : null, message : 'Error retrieving rides' }
  }
})

const getRide = async id => {
  if(!id) return null
  try {
    const rid = await Ride.findById(id)

    if(rid) return await rid

    return null
  } catch (e) {
    return null
  }
}

ride.get('/:id', async ctx => {
  const { id } = ctx.params

  const rid = await getRide(id)

  if(rid) return ctx.body = { data : rid, message : null }

  return ctx.body = { data : null, message : 'Error retrieving ride' }
})

// ride.post('/add', async ctx => {

// })

ride.get('/:id/tickets', async ctx => {
  const { id } = ctx.params

  const rid = getRide(id)

  if(rid)
    try {
      const tickets = await Ticket.find({ ride : rid })

      if(tickets) return ctx.body = { data : tickets, message : null }

      return ctx.body = { data : null, message : '' }
    } catch (e) {
      return ctx.body = {
        data : null,
        message : `Error retrieving tickets for this ride`
      }
    }

  return ctx.body = {
    data : null,
    message : `Error retrieving data for ID: ${ id }`
  }
})

// ride.use('/rides', routes.routes(), routes.allowedMethods())

export default ride