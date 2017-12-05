import Router from 'koa-router'

import { Ride, RideDetail, Bus, } from '../../models'
import { getRideData, saveRide, updateRide } from './ride.controller'

const rideRouter = new Router({ prefix : 'ride' })

// Retrieve all rides
rideRouter.get('/all', async ctx => {
  const {
    status = 'FINISHED,ASSIGNED',
    limit = 10,
    skip = 0,
    // unassigned = 'true',
    sort = 'date -1'
  } = ctx.query

  const list = [].concat(status ? status.split(',') : '')
  const conditions = { status : { $in : list }}

  const [ srt, asc ] = sort.split(' ')
  const sortCondition = { [ srt ] : Number(asc) }

  if(srt === 'date') sortCondition.time = 1

  try {
    const rides = await Ride
                          .find(conditions)
                          .skip(Number(skip))
                          .limit(Number(limit))
                          .sort(sortCondition)
                          .exec()

    if(rides.length) {
      const data = await Promise.all(rides.map(getRideData))

      data.map(e => console.log(e.date))

      const count = await Ride.count(conditions)
      console.log(count)

      if(data.length) return ctx.body = { ok : true, data : { rides : data, count }, message : '' }
    }

    return ctx.body = { ok : false, data : null, message : 'No rides available' }
  } catch (e) {
    console.log(e)
    return ctx.body = { ok : false, data : null, message : 'Error retrieving rides' }
  }
})

// Saves a ride
rideRouter.post('/insert', async ctx => {
  const { body } = ctx.request

  try {
    let { time, date } = body

    time = parseInt(time)
    date = new Date(date)

/*** this part might be unnecessary */
    // if(Object.prototype.toString.call(date) && isNaN(date.getTime())) 
    //     return ctx.body = { ok : false, data : null, message : 'Date format is wrong' }

    // if(time < 0 || time > 23) return ctx.body = { ok : false, data : null, message : 'Time is incorrect' }
    // if(date.getTime() < Date.now()) return ctx.body = { ok : false, data : null, message : 'Date can\'t be in the past' }
/**** up to this part might be unnecessary */

    const rid = await saveRide(body)

    if(rid) return ctx.body = { ok : true, data : { routeId : rid }, message : '' }

    return ctx.body = { ok : false, data : null, message : 'Couldn\'t save route in DB' }
  } catch (e) {
    return ctx.body = { ok : false, data : null, message : 'Error saving ride in DB' }
  }
})

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

// Assign bus to ride
rideRouter.put('/assign-bus', async ctx => {
  const { bus, ids = [] } = ctx.request.body

  try {
    const bs = await Bus.findById(bus)
    const promises = []

    if(bs) {
      for(let i = 0; i < ids.length; i++) promises.push(Ride.findOneAndUpdate({ _id : ids[ i ] }, { bus, status : 'ASSIGNED' }))

      const rids = await Promise.all(promises)

      if(rids) return ctx.body = { ok : true, data : null, message : '' }
    }
  } catch (e) {
    // console.log(e)

    return ctx.body = { ok : false, data : null, message : 'Error retrieving rides' }
  }

  return ctx.body = { ok : false, data : null, message : 'There are no rides for this date' }
})

rideRouter.put('/:id/modify', async ctx => {
  const { id } = ctx.params
  const { body } = ctx.request
  // console.log(body)
  // console.log(id)

  try {
    // console.log(body)
    const data = await updateRide(id, body)
    // console.log(data)
    if(data) return ctx.body = { ok : true, data, message : '' }

    return ctx.body = { ok : false, data : null, message : 'There is no ride assigned to that id' }
  } catch(e) {
    // console.log(e)
    return ctx.body = { ok : false, data : null, message : 'Error retrieving ride' }
  }
})

// Update ride details
rideRouter.put('/:id/update-details', async ctx => {
  const { id } = ctx.params
  const { seatsOccupied, luggage, time, date } = ctx.request

  const dateX = new Date(date)
  const timeX = parseInt(time)

  try {
    const details = await RideDetail.findOneAndUpdate({ ride : id }, { seatsOccupied, luggage, date : dateX, time : timeX })

    if(details) return ctx.body = { ok : true, data : null, message : '' }
  } catch(e) {
    return ctx.body = { ok : false, data : null, message : 'Error updating ride' }
  }

  return ctx.body = { ok : false, data : null, message : 'There is no ride assigned to that id' }
})

// Retrieve Ride
rideRouter.get('/:id', async ctx => {
  const { id } = ctx.params
  try {
    const rid = await Ride.findById(id)

    if(rid) {
      const data = await getRideData(rid)

      if(data) return ctx.body = { ok : true, data, message : '' }
    }

    return ctx.body = { ok : false, data : null, message : 'There is no ride assigned to that id' }
  } catch(e) {
    return ctx.body = { ok : false, data : null, message : 'Error retrieving ride' }
  }
})

export default rideRouter