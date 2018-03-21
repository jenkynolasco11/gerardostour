import { Meta, Ride, RideDetail, Bus, BusDetail, Ticket } from '../../../models'

import { filterDoc } from '../../../utils'

export const createRide = async data => {
  const {
    bus = null,
    frm,
    to,
    status = 'PENDING',
    time,
    date,
    luggage = 0,
    seatsOccupied = 0,
  } = data

  let tempBus = null

  try {
    const meta = await Meta.findOne({})

    if(bus) tempBus = await Bus.findOne({ id : bus })

    const rid = await new Ride({
      id : meta.lastRideId,
      bus : bus ? tempBus._id : null,
      to,
      frm,
      status : tempBus ? 'ASSIGNED' : 'PENDING',
      time : parseInt(time),
      date : new Date(new Date(date).setHours(0,0,0,0)),
    }).save()

    // Not sure if I should leave this with await
    const details = await new RideDetail({
      ride : rid._id,
      seatsOccupied,
      luggage,
    }).save()

    meta.lastRideId += 1
    meta.save()

    return rid.id
  } catch (e) {
    console.log(e)
  }

  return null
}

export const updateRide = async (rid, body) => {
  try {
    const { _id, status, id, bus, ...ride } = filterDoc(rid._doc)

    const stts = bus
                  ? status === 'PENDING'
                  ? 'ASSIGNED'
                  : status
                  : 'PENDING'

    const data = { ...ride, status : stts, ...body, bus }

    const rde = await Ride.findOneAndUpdate({ id }, data, { new : true })
    const details = await RideDetail.findOneAndUpdate({ ride : _id }, data)

    return id
  } catch (e) {
    console.log(e)
  }

  return null
}

export const getRideData = async ride => {
  try {
    const { _id, id, bus, to, frm, status, time, date } = ride

    let buss = null
    let busDetails = null

    const { seatsOccupied, luggage } = await RideDetail.findOne({ ride : _id })

    const tickets = await Ticket.aggregate([
      { $match : { ride : _id }},
      {
        $lookup : {
          from : 'person',
          localField : 'person',
          foreignField : '_id',
          as : 'person'
        }
      },
      { $unwind : '$person' },
      {
        $lookup : {
          from : 'ticketDetails',
          localField : 'details',
          foreignField : '_id',
          as : 'details'
        }
      },
      { $unwind : '$details' },
    ])

    const ticketsCount = tickets.length

    if(bus) {
      buss = await Bus.findById(bus)
      busDetails = await BusDetail.findOne({ bus })

      // luggageUsed { = parseInt(busDetails.luggage) - parseInt(luggage)
      // seatsUsed = parseInt(busDetails.seats) - parseInt(seatsOccupied)
    // } else {
    //   luggageUsed = luggage
    //   seatsUsed = seatsOccupied
    }

    const busData = bus
                    ?
                    {
                      busId : buss.id,
                      busName : buss.name,
                      busStatus : buss.status,
                      busSeats : busDetails.seatQty,
                      busLuggage : busDetails.luggageQty,
                    }
                    : {}

    const data = {
      id,
      // bus : busData,
      ticketsCount,
      tickets,
      status, // : status === 'ON-THE-WAY' ? status.split('-').join(' ') : status,
      to,
      frm,
      time,
      date,
      seatsOccupied,
      luggage,
      ...busData
    }

    // TODO : CHECK THIS OUT LATER
    return data
  } catch (e) {
    console.log(e)
    // process.exit()
  }

  return null
}
