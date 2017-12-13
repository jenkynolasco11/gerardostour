import { Meta, Ride, RideDetail, Bus, BusDetail } from '../../../models'

export const getRideData = async ride => {
  try {
    const { id, bus, routeTo, routeFrom, status, time, date } = ride

    let buss = null
    let busDetails = null
    let seatsUsed = null
    let luggageUsed = null

    const { seatsOccupied, luggage } = await RideDetail.findOne({ ride : ride._id })

    if(bus) {
      buss = await Bus.findById(bus)
      busDetails = await BusDetail.findOne({ bus })

      luggageUsed = parseInt(busDetails.luggage) - parseInt(luggage)
      seatsUsed = parseInt(busDetails.seats) - parseInt(seatsOccupied)

      // const seat = parseInt(busDetails.seats) - parseInt(seatsOccupied)
      // const lug = parseInt(busDetails.luggage) - parseInt(luggage)
      // seatsUsed = seat < 0 ? 0 : seat
      // luggageUsed = lug < 0 ? 0 : lug
    } else {
      luggageUsed = luggage
      seatsUsed = seatsOccupied
    }

    const data = {
      id,
      bus : bus ? {
        id : buss.id,
        // alias : buss.alias,
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
      seatsUsed,
      luggageUsed,
    }

    // TODO : CHECK THIS OUT LATER
    return data
  } catch (e) {
    console.log(e)
    // process.exit()
  }

  return null
}

export const createRide = async data => {
  const {
    bus = null,
    routeTo,
    routeFrom,
    status = 'PENDING',
    time,
    date,
    luggage = 0,
    seatsOccupied = 0
  } = data

  try {
    const meta = await Meta.findOne({})

    const rid = await new Ride({
      id : meta.lastRideId,
      bus : bus ? bus : null,
      routeTo,
      routeFrom,
      status,
      time : parseInt(time),
      date : new Date(new Date(date).setHours(0,0,0,0)),
    }).save()

    const details = await new RideDetail({
      ride : rid._id,
      seatsOccupied,
      luggage,
    }).save()

    meta.lastRideId += 1
    await meta.save()

    return rid.id
  } catch (e) {
    console.log(e)
  }

  return null
}

export const updateRide = async (rid, body) => {
  try {
    const { _id, __v, createdAt, modifiedAt, id, bus, ...ride } = rid.toObject()

    const data = { ...ride, ...body } 

    const rde = await Ride.findOneAndUpdate({ id }, data)
    const details = await RideDetail.findOneAndUpdate({ ride : _id }, data)

    return id
  } catch (e) {
    console.log(e)
  }

  return null
}
