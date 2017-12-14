import mongoose from 'mongoose'

import './user'
import './ride'
import './ticket'
import './person'
import './address'
import './bus'
import './receipt'
import './meta'

import { userDefault, passDefault } from '../config'

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
    await Meta.collection.remove({})
    await Person.collection.remove({})
    await Address.collection.remove({})
    await Ticket.collection.remove({})
    await TicketDetail.collection.remove({})
    await Receipt.collection.remove({})
    await Ride.collection.remove({})
    await RideDetail.collection.remove({})
    await User.collection.remove({})
    await Bus.collection.remove({})
    await BusDetail.collection.remove({})
  } catch (e) {
    return false
  }

  return true
}

export const createDefaultUser = async () => {
  try {
    const p = await new Person({
      firstname : 'jenky',
      lastname : 'nolasco',
      email : 'jenky_nolasco@hotmail.com',
      phoneNumber : '3479742990'
    }).save()

    const u = new User({
      username : userDefault,
      person : p._id,
      position : 'SUPERUSER',
      status : 'ACTIVE',
    })

    u.password = u.generateHash(passDefault)

    await u.save()
  } catch (e) {
    // console.log(e)
  }
}

export const createMeta = async (clear) => {
  try {
    if(clear) await deleteAllCollections()

    const meta = await Promise.resolve(Meta.findOne({}))

    if(!meta) {
      const defaultMeta = {
        lastTicketId : 1,
        lastReceiptId : 1,
        lastRideId : 1,
        lastBusId : 1,
      }

      await Promise.resolve(new Meta(defaultMeta).save())
    }

    await createDefaultUser()
    // console.log(meta)
  } catch (e) { }
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