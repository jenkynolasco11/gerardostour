import Router from 'koa-router'

import { Ride } from '../../../models'
import { getRideData, createRide, updateRide } from './ride.controller'

const rideRouter = new Router({ prefix : 'ride' })

// Retrieve all rides
rideRouter.get('/all', async ctx => {
  const {
    nonstatus = 'FINISHED,ASSIGNED,CANCELLED',
    limit = 10,
    skip = 0,
    sort = 'date -1',
    future = 'true',
  } = ctx.query

  const list = [].concat(nonstatus.split(','))
  const conditions = { status : { $nin : list }}

  const [ srt, asc ] = sort.split(' ')
  const sortCondition = { [ srt ] : Number(asc) }

  if(srt === 'date') sortCondition.time = asc < 0 ? -1 : 1
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
    return ctx.body = { ok : false, data : null, message : 'Error saving ride in DB' }
  }
})

/** Not assigned **/
// Retrieve rides on date and hour.
// Note: If hour is -1, retrieve all rides on that date
rideRouter.get('/date/:date/hour/:hour', async ctx => {
  const { date, hour } = ctx.params

  const time = parseInt(hour)
  const dateX = parseInt(date)

  if(typeof dateX !== 'number') return ctx.body = { ok : false, data : null, message : 'Incorrect Date format' }

  const date1 = new Date(dateX)
  const date2 = new Date(dateX).setDate(date1.getDate() + 1)

  const conditions = { date : { $gte : date1, $lte : new Date(date2) }}

  if(time >= 0 && time < 24) conditions.time = time

  try {
    const rides = await Ride.find(conditions)
    
    if(rides.length) {
      const data = await Promise.all(rides.map(getRideData))

      return ctx.body = { ok : true, data : data.filter(Boolean), message : '' }
    }
  } catch (e) {
    console.log(e)

    return ctx.body = { ok : false, data : null, message : 'Error retrieving rides' }
  }

  return ctx.body = { ok : false, data : null, message : 'There are no rides for this date' }
})

/* not assigned */
// Assign bus to ride
rideRouter.put('/assign-bus', async ctx => {
  const { bus, ids = [] } = ctx.request.body

  try {
    const bs = await Bus.findById(bus)
    const promises = []

    if(bs) {
      for(let i = 0; i < ids.length; i++) promises.push(Ride.findOneAndUpdate({ id : ids[ i ] }, { bus, status : 'ASSIGNED' }))

      const rids = await Promise.all(promises)

      if(rids) return ctx.body = { ok : true, data : null, message : '' }
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
    // console.log(e)
    return ctx.body = { ok : false, data : null, message : 'Error retrieving ride' }
  }
})

// Retrieve Ride
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