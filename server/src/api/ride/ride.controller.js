// import {  } from 'mongoose'
import { Ride, RideDetail, Bus, BusDetail } from '../../models'
// import { formatDate, formatHour } from '../../utils'

export const getRideData = async ride => {
  try {
    const { routeTo, routeFrom, bus, status, time, date } = ride

    let buss = null
    let busDetails = null
    let seatsAvailable = 0
    let luggageAvailable = 0

    const { seatsOccupied, luggage } = await RideDetail.findOne({ ride : ride._id })

    if(bus) {
      buss = await Bus.findById(bus)

      busDetails = await BusDetail.findOne({ bus })

      const seat = parseInt(busDetails.seats) - parseInt(seatsOccupied)
      const lug = parseInt(busDetails.luggage) - parseInt(luggage)
      seatsAvailable = seat < 0 ? 0 : seat
      luggageAvailable = lug < 0 ? 0 : lug
    }

    // console.log(date)
    // const nDate = formatDate(date)
    // const nTime = formatHour(time)

    // console.log(nDate)
    // console.log(nTime)

    const data = {
      id : ride._id,
      bus : bus ? {
        id : buss._id,
        alias : buss.alias,
        name : buss.name,
        status : buss.status,
        seats : busDetails.seats,
        luggage : busDetails.luggage,
      } : null,
      status,
      routeTo,
      routeFrom,
      time, // : nTime,
      date, // : nDate,
      seatsAvailable,
      luggageAvailable,
    }
    
    // TODO : CHECK THIS OUT LATER
    return data//.filter(Boolean)
  } catch (e) {
    console.log(e)
    process.exit()
  }

  return null
}

export const saveRide = async data => {
  try {
    const {
      bus = null,
      routeTo,
      routeFrom,
      status,
      time,
      date,
    } = data

    console.log(typeof date)

    const rid = await new Ride({
      bus : bus ? bus : null,
      routeTo,
      routeFrom,
      time,
      // date : new Date(date).setHours(0,0,0,0).toISOString(),
      date,
      status : status ? status.toUpperCase() : 'PENDING'
    }).save()

    const details = await new RideDetail({ ride : rid._id }).save()

    return rid._id
  } catch (e) {
    console.log(e)
  }

  return null
}

export const updateRide = async (id, body) => {
  try {
    // console.log(body)
    const {
      routeTo,
      routeFrom,
      status,
      time,
      date
    } = body

    // console.log(body.bus)

    const bus = body.bus ? body.bus : null

    const data = {
      bus,
      routeTo,
      routeFrom,
      status,
      // date : (new Date(date)).setHours(0,0,0,0).toISOString(), 
      date,
      time,
    }

    const rid = await Ride.findByIdAndUpdate(id, data /*, { new : true }*/)

    return rid._id
  } catch (e) {
    console.log(e)
  }
  return null
}
