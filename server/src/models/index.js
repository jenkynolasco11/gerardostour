import mongoose from 'mongoose'

import './user'
import './ride'
import './ticket'
import './person'
import './address'
import './bus'
import './financial'

// // Insert some mock data!!!!!
// import './mockupData'

mongoose.Promise = global.Promise

export const Person = mongoose.model('person')
export const User = mongoose.model('user')
export const Ride = mongoose.model('ride')
export const RideDetail = mongoose.model('rideDetail')
export const Ticket = mongoose.model('ticket')
export const TicketDetail = mongoose.model('ticketDetail')
export const Address = mongoose.model('address')
export const Bus = mongoose.model('bus')
export const Payment = mongoose.model('payment')
export const BusDetail = mongoose.model('busDetail')

export default {
  Person,
  Ride,
  Ticket,
  TicketDetail,
  Address,
  User,
  Bus,
  Payment,
  BusDetail,
  RideDetail,
}