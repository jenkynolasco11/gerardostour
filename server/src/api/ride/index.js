import Router from 'koa-router'

import { Ride, Ticket, Route, Bus, User, Person, BusDetail } from '../../models'

const ride = new Router({ prefix : 'ride' })

const getRideData = async rid => {
  try {
    // const routeFrom = await Route.findById(rid.routeFrom)
    // const routeTo = await Route.findById(rid.routeTo)
    const bus = await Bus.findById(rid.bus)
    const details = await BusDetail.findOne({ bus : rid.bus })
    // const user = await User.findById(bus.user)
    // const person = await Person.findById(user.person)

    const data = {
      bus : {
        alias : bus.alias,
        name : bus.name,
        status : bus.status,
        seats : bus.seats,
        seatsAvailable : (parseInt(bus.seats) - parseInt(details.seats)),
        luggage : bus.luggage,
        luggageAvailable : parseInt(bus.luggage) - parseInt(details.luggage)
      },
      routeTo : rid.routeTo,
      routeFrom : rid.routeFrom,
      time : rid.time,
      date : rid.date
    }

    return data
  } catch (e) {
    console.log(e)
  }

  return null
}

// Retrieve all rides
ride.get('/all', async ctx => {
  // const { limit = 10, skip = 0 } = ctx.query
  try {
    const rides = await Ride.find({})

    if(rides.length) {
      const data = await Promise.all(rides.map(getRideData))

      if(data.length) return ctx.body = { ok : true, data, message : '' }
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

    if(time < 0 || time > 23) return ctx.body = { ok : false, data : null, message : 'Time is incorrect' }
    if(date.getTime() < Date.now()) return ctx.body = { ok : false, data : null, message : 'Date can\'t be in the past' }

    const rid = await new Ride({ ...body }).save()

    return ctx.body = { ok : true, data : rid._id, message : '' }
  } catch (e) {
    return ctx.body = { ok : false, data : null, message : 'Error saving ride in DB' }
  }
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
    const rides = await Ride.find(conditions)

    if(rides.length) {
      const data = await Promise.all(rides.map(getRideData))

      return ctx.body = { ok : true, data, message : '' }
    }
  } catch (e) {
    return ctx.body = { ok : false, data : null, message : 'Error retrieving rides' }
  }

  return ctx.body = { ok : false, data : null, message : 'There are no rides for this date' }
})

// Retrieve Ride
ride.get('/:id', async ctx => {
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

export default ride