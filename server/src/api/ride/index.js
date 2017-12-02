import Router from 'koa-router'

import { Ride, RideDetail, Ticket, Route, Bus, User, Person, BusDetail } from '../../models'

const ride = new Router({ prefix : 'ride' })

const getRideData = async id => {
  try {
    const rid = await Ride.findById(id)

    let bus = null
    let busDetails = null
    let seatsAvailable = 0
    let luggageAvailable = 0

    const rideDetails = await RideDetail.findOne({ ride : rid._id })
    
    if(rid.bus) {
      bus = await Bus.findById(rid.bus)
      busDetails = await BusDetail.findOne({ bus : rid.bus })
      
      const seats = parseInt(busDetails.seats) - parseInt(rideDetails.seatsOccupied)
      const luggage = parseInt(busDetails.luggage) - parseInt(rideDetails.luggage)
      seatsAvailable =  seats < 0 ? 0 : seats
      luggageAvailable = luggage < 0 ? 0 : luggage
    }

    // console.log(bus)

    const data = {
      bus : rid.bus ? {
        alias : bus.alias,
        name : bus.name,
        status : bus.status,
        seats : busDetails.seats,
        luggage : busDetails.luggage,
      } : null,
      routeTo : rid.routeTo,
      routeFrom : rid.routeFrom,
      time : rideDetails.time,
      date : rideDetails.date,
      seatsAvailable,
      luggageAvailable,
    }

    return data
  } catch (e) {
    console.log(e)
  }

  return null
}

const saveRide = async data => {
  try {
    const {
      bus = null,
      routeTo,
      routeFrom,
      status = 'PENDING',

      // RIDE DETAILS
      time,
      date,
    } = data

    const rid = await new Ride({
      bus : bus ? bus : null,
      routeTo,
      routeFrom,
      status : status.toUpperCase()
    }).save()

    const details = await new RideDetail({
      time,
      date,
      ride : rid._id
    }).save()

    return rid._id
  } catch (e) {
    console.log(e)
  }

  return null
}

const updateRide = async (id, body) => {
  try {
    console.log(body)
    const {
      routeTo,
      routeFrom,
      status,
      time,
      date
    } = body

    const bus = body.bus ? body.bus : null

    // console.log(bus)

    const rid = await Ride.findOneAndUpdate({ _id : id }, { bus, routeTo, routeFrom, status })

    const details = await RideDetail.findOneAndUpdate({ ride : id }, { time, date })

    return rid._id

  } catch (e) {
    console.log(e)
  }
  return null
}

// Retrieve all rides
ride.get('/all', async ctx => {
  const {
    status = [ 'FINISHED', 'ASSIGNED' ],
    limit = 10,
    skip = 170
  } = ctx.query

  const list = [].concat(status)

  try {
    const rides = await Ride
                          .find({ status : { $nin : list }}, { id : 1 })
                          .skip(skip)
                          .limit(limit)
                          .exec()

    // console.log(rides)

    if(rides.length) {
      const data = await Promise.all(rides.map(getRideData))

      if(data.length) return ctx.body = { ok : true, data : data.filter(Boolean), message : '' }
    }

    return ctx.body = { ok : false, data : null, message : 'No rides available' }
  } catch (e) {
    return ctx.body = { ok : false, data : null, message : 'Error retrieving rides' }
  }
})

// Saves a ride
ride.post('/insert', async ctx => {
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

ride.put('/:id/modify', async ctx => {
  const { id } = ctx.params
  const { body } = ctx.request

  try {
    const data = await updateRide(id, body)

    if(data) return ctx.body = { ok : true, data, message : '' }

    return ctx.body = { ok : false, data : null, message : 'There is no ride assigned to that id' }
  } catch(e) {
    return ctx.body = { ok : false, data : null, message : 'Error retrieving ride' }
  }
})

// Update ride details 
ride.put('/:id/update-details', async ctx => {
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

// Retrieve rides on date and hour.
// Note: If hour is -1, retrieve all rides on that date
ride.get('/date/:date/hour/:hour', async ctx => {
  const { date, hour } = ctx.params

  const time = parseInt(hour)
  const dateX = parseInt(date)

  if(typeof dateX !== 'number') return ctx.body = { ok : false, data : null, message : 'Incorrect Date format' }

  const date1 = new Date(dateX)
  const date2 = new Date(dateX).setDate(date1.getDate() + 1)

  const conditions = { date : { $gte : date1, $lte : new Date(date2) }}

  if(time >= 0 && time < 24) conditions.time = time

  try {
    const details = await RideDetail.find(conditions)
    
    if(details.length) {
      const data = await Promise.all(details.map(detail => getRideData(detail.ride)))

      return ctx.body = { ok : true, data : data.filter(Boolean), message : '' }
    }
  } catch (e) {
    console.log(e)

    return ctx.body = { ok : false, data : null, message : 'Error retrieving rides' }
  }

  return ctx.body = { ok : false, data : null, message : 'There are no rides for this date' }
})

// Assign bus to ride
ride.put('/assign-bus', async ctx => {
  const { bus, id } = ctx.request.body

  try {
    const bs = await Bus.findById(bus)

    if(bs) {
      const rid = await Ride.findOneAndUpdate({ _id : id }, { bus })

      if(rid) return ctx.body = { ok : true, data : null, message : '' }
    }
  } catch (e) {
    console.log(e)

    return ctx.body = { ok : false, data : null, message : 'Error retrieving rides' }
  }

  return ctx.body = { ok : false, data : null, message : 'There are no rides for this date' }
})

// Retrieve Ride
ride.get('/:id', async ctx => {
  const { id } = ctx.params
  try {
    // const rid = await Ride.findById(id)

    // if(rid) {
    const data = await getRideData(id)

    if(data) return ctx.body = { ok : true, data, message : '' }
    // }

    return ctx.body = { ok : false, data : null, message : 'There is no ride assigned to that id' }
  } catch(e) {
    return ctx.body = { ok : false, data : null, message : 'Error retrieving ride' }
  }
})

export default ride