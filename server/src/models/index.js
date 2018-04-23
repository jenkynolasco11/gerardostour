import mongoose from 'mongoose'

import './meta'
import './person'
import './user'
// import './ride'
// import './ticket'
// import './address'
// import './bus'
// import './receipt'

// import { userDefault, passDefault } from '../config'
import { defaultMeta, defaultUsers } from './defaults'

export const Meta = mongoose.model('meta')
export const Person = mongoose.model('person')
export const User = mongoose.model('user')
// export const Ride = mongoose.model('ride')
// export const RideDetail = mongoose.model('rideDetails')
// export const Ticket = mongoose.model('ticket')
// export const TicketDetail = mongoose.model('ticketDetails')
// export const Address = mongoose.model('address')
// export const Bus = mongoose.model('bus')
// export const Receipt = mongoose.model('receipt')
// export const BusDetail = mongoose.model('busDetails')

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

export const createDefaultUsers = async () => {
  try {
    const promises = defaultUsers.map(async user => {
      let u = await User.findOne({ username : user.username })

      if(!u) {
        let p = await Person.findOne({
          $or : [
            { email : user.person.email },
            { phoneNumber : user.person.phoneNumber }
          ]
        })

        if(!p) p = await new Person(user.person).save()

        u = new User({ ...user, person : p._id })

        u.password = u.generateHash(user.password)

        await u.save()
      }
    })

    await Promise.all(promises)
  } catch (e) {
    console.log(e)
  }
}

export const createMeta = async (clear) => {
  try {
    if(clear) await deleteAllCollections()

    const meta = await Meta.findOne({})

    if(!meta) await new Meta(defaultMeta).save()

    await createDefaultUsers()
  } catch (e) {
    console.log(e)
  }
}

export default {
  deleteAllCollections,
  Person,
  // Ride,
  // Ticket,
  // TicketDetail,
  // Address,
  User,
  // Bus,
  // Receipt,
  // BusDetail,
  // RideDetail,
  Meta
}
