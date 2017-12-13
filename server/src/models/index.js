import mongoose from 'mongoose'

import './user'
import './ride'
import './ticket'
import './person'
import './address'
import './bus'
import './receipt'
import './meta'

mongoose.Promise = global.Promise

export const Person = mongoose.model('person')
export const User = mongoose.model('user')
export const Ride = mongoose.model('ride')
export const RideDetail = mongoose.model('rideDetail')
export const Ticket = mongoose.model('ticket')
export const TicketDetail = mongoose.model('ticketDetail')
export const Address = mongoose.model('address')
export const Bus = mongoose.model('bus')
export const Receipt = mongoose.model('receipt')
export const BusDetail = mongoose.model('busDetail')
export const Meta = mongoose.model('meta')

export const deleteAllCollections = async () => {
  try {
    await Person.collection.remove({})
    await User.collection.remove({})
    await Ride.collection.remove({})
    await RideDetail.collection.remove({})
    await Ticket.collection.remove({})
    await TicketDetail.collection.remove({})
    await Address.collection.remove({})
    await Bus.collection.remove({})
    await Receipt.collection.remove({})
    await BusDetail.collection.remove({})
    await Meta.collection.remove({})

  } catch (e) {
    return false
  }

  return true
}

export default {
  deleteAllCollections,

  // 
  Person,
  Ride,
  Ticket,
  TicketDetail,
  Address,
  User,
  Bus,
  Receipt,
  BusDetail,
  RideDetail,
  Meta
}