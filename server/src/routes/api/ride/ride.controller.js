import { Ride, RideDetail, Bus, BusDetail } from '../../../models'

export const getRideData = async (ride, i) => {
  try {
    const { routeTo, routeFrom, bus, status } = ride

    let buss = null
    let busDetails = null
    let seatsAvailable = 0
    let luggageAvailable = 0

    const { time, date, seatsOccupied, luggage } = await RideDetail.findOne({ ride : ride._id })

    if(bus) {
      buss = await Bus.findById(bus)

      busDetails = await BusDetail.findOne({ bus })

      const seat = parseInt(busDetails.seats) - parseInt(seatsOccupied)
      const lug = parseInt(busDetails.luggage) - parseInt(luggage)
      seatsAvailable = seat < 0 ? 0 : seat
      luggageAvailable = lug < 0 ? 0 : lug
    }

    const data = {
      id : ride._id,
      bus : bus ? {
        alias : buss.alias,
        name : buss.name,
        status : buss.status,
        seats : busDetails.seats,
        luggage : busDetails.luggage,
      } : null,
      status,
      routeTo,
      routeFrom,
      time,
      date,
      seatsAvailable,
      luggageAvailable,
    }
    
    // TODO : CHECK THIS OUT LATER
    return data//.filter(Boolean)
  } catch (e) {
    // console.log(e)
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

      // RIDE DETAILS
      time,
      date,
    } = data

    const rid = await new Ride({
      bus : bus ? bus : null,
      routeTo,
      routeFrom,
      status : status ? status.toUpperCase() : 'PENDING'
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

export const updateRide = async (id, body) => {
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
