import Router from 'koa-router'

import { Ride, Bus } from '../../../models'
import { getRideData, createRide, updateRide } from './ride.controller'

const rideRouter = new Router({ prefix : 'ride' })

// Retrieve all rides
rideRouter.get('/all', async ctx => {
  const {
    status = 'PENDING',
    limit = 10,
    skip = 0,
    sort = 'date -1',
    future = 'true',
  } = ctx.query

  const list = [].concat(status.split(','))
  const conditions = { status : { $in : list }}

  const [ srt, asc ] = sort.split(' ')
  const sortCondition = { [ srt ] : Number(asc) }

  if(srt === 'date') sortCondition.time = 1// asc < 0 ? -1 : 1
  if(srt === 'time') sortCondition.date = asc < 0 ? -1 : 1

  if(future === 'true') {
    const tmpDate = new Date().setHours(0,0,0,0)

    conditions.date = { $gte : new Date(tmpDate - 86400000) }
  }

  try {
    const rides = await Ride
                        .find(conditions)
                        .skip(Number(skip))
                        .limit(Number(limit))
                        .sort(sortCondition)
                        .exec()

    if(rides.length) {
      const data = await Promise.all(rides.map(getRideData))

      const count = await Ride.count(conditions)

      if(data.length) return ctx.body = { ok : true, data : { rides : data, count }, message : '' }
    }

    return ctx.body = { ok : false, data : null, message : 'No rides available' }
  } catch (e) {
    console.log(e)
  }

  return ctx.body = { ok : false, data : null, message : 'Error retrieving rides' }
})

// Saves a ride
rideRouter.post('/save', async ctx => {
  const { body } = ctx.request

  try {
    const rid = await createRide(body)

    if(rid) return ctx.body = { ok : true, data : { ride : rid }, message : '' }

    return ctx.body = { ok : false, data : null, message : 'Couldn\'t save route in DB' }
  } catch (e) {
    console.log(e)
  }

  return ctx.body = { ok : false, data : null, message : 'Error saving ride in DB' }
})

// Retrieve rides on date and hour.
// Note: If hour is -1, retrieve all rides on that date
rideRouter.get('/date/:date/hour/:hour', async ctx => {
  const { date, hour } = ctx.params

  const dateX = parseInt(date)

  const date1 = new Date(dateX)
  const date2 = new Date(dateX).setDate(date1.getDate() + 1)

  const conditions = { date : { $gte : date1, $lt : new Date(date2) }}

  if(hour >= 0 && hour < 24) conditions.time = hour

  // This is debatable
  conditions.bus = { $ne : null }

  try {
    // console.log(conditions)
    const rides = await Ride.find(conditions)

    // console.log(await Ride.find({}))

    if(rides.length) {
      const data = await Promise.all(rides.map(getRideData))

      return ctx.body = { ok : true, data : { rides : data }, message : '' }
    }

    return ctx.body = { ok : false, data : null, message : 'There are no rides for this date' }
  } catch (e) {
    console.log(e)
  }

  return ctx.body = { ok : false, data : null, message : 'Error retrieving rides' }
})

// Assigns bus to ride
rideRouter.put('/assign-bus', async ctx => {
  const { bus, rides = [] } = ctx.request.body

  try {
    const bs = await Bus.findOne({ id : bus })
    const promises = []

    if(bs) {
      rides.forEach(id => {
        promises.push(Ride.findOneAndUpdate({ id }, { bus : bs._id, status : 'ASSIGNED' }))
      })

      const rids = await Promise.all(promises)

      if(rids) return ctx.body = { ok : true, data : null, message : `Ride${ rides.length > 1 ? 's' : '' } assigned!` }
    }
  } catch (e) {
    console.log(e)

    return ctx.body = { ok : false, data : null, message : 'Error retrieving rides' }
  }

  return ctx.body = { ok : false, data : null, message : 'There are no rides for this date' }
})

// Modifies the ride
rideRouter.put('/:id/modify', async ctx => {
  const { id } = ctx.params
  const { body } = ctx.request

  try {
    const rid = await Ride.findOne({ id })

    if(rid) {
      const data = await updateRide(rid, body)

      if(data) return ctx.body = { ok : true, data : { ride : data }, message : '' }
    }

    return ctx.body = { ok : false, data : null, message : 'There is no ride assigned to that id' }
  } catch(e) {
    console.log(e)
  }

  return ctx.body = { ok : false, data : null, message : 'Error retrieving ride' }
})

// Retrieves Ride
rideRouter.get('/:id', async ctx => {
  const { id } = ctx.params
  try {
    const rid = await Ride.findOne({ id })

    if(rid) {
      const data = await getRideData(rid)

      if(data) return ctx.body = { ok : true, data : { ride : data }, message : '' }
    }

    return ctx.body = { ok : false, data : null, message : 'There is no ride assigned to that id' }
  } catch(e) {
    console.log(e)
  }

  return ctx.body = { ok : false, data : null, message : 'Error retrieving ride' }
})

export default rideRouter