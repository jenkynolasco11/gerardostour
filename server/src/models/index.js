import mongoose from 'mongoose'

import usr from './user'
import ride from './ride'
import tickt from './ticket'
import prsn from './person'

// Insert some mock data!!!!!
import './mockupData'

mongoose.Promise = global.Promise

export const Person = mongoose.model('person')
export const User = mongoose.model('user')
export const Ride = mongoose.model('ride')
export const Ticket = mongoose.model('ticket')

export default {
  Person,
  Ride,
  Ticket,
  User,
}