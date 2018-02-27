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
export const RideDetail = mongoose.model('rideDetails')
export const Ticket = mongoose.model('ticket')
export const TicketDetail = mongoose.model('ticketDetails')
export const Address = mongoose.model('address')
export const Bus = mongoose.model('bus')
export const Receipt = mongoose.model('receipt')
export const BusDetail = mongoose.model('busDetails')
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
    let u = await User.findOne({ username : userDefault })

    if(!u) {
      let p = await Person.findOne({
        $or : [
          { email : 'jenky_nolasco@hotmail.com' },
          { phoneNumber : '3479742990' }
        ]
      })

      if(!p) p = await new Person({
        firstname : 'Jenky',
        lastname : 'Nolasco',
        email : 'jenky_nolasco@hotmail.com',
        phoneNumber : '3479742990'
      }).save()

      u = new User({
        username : userDefault,
        person : p._id,
        position : 'SUPERUSER',
        status : 'ACTIVE',
      })

      u.password = u.generateHash(passDefault)

      await u.save()
    }
  } catch (e) {
    console.log(e)
  }
}

export const createMeta = async (clear) => {
  try {
    if(clear) await deleteAllCollections()

    const meta = await Meta.findOne({})

    if(!meta) {
      console.log('creating new meta...')
      const defaultMeta = {
        lastBusId : 1,
        lastRideId : 1,
        lastTicketId : 1,
        lastReceiptId : 1,
      }

      await new Meta(defaultMeta).save()
    }

    await createDefaultUser()
    // console.log(meta)
  } catch (e) { }
}

// (async () => {
//   // const STATUS_TYPES = [ 'USED', 'REDEEMED', 'NULL', 'NEW', 'DELETED' ]
//   // const TICKET_TYPES = [ 'REGULAR', 'PACKAGE', 'VIP', 'SPECIAL', 'AIRPORT' ]

//   try {
//     const user = await User.findOne({ username : 'Dylan' })
//     const bus = await Bus.find({ user : user._id })
//     const rides = await Ride.find({ bus : { $in : bus.map(b => b._id) }})
//     const report = await Ticket.aggregate([
//       {
//         $match : {
//           ride : { $in : rides.map(r => r._id) },
//         }
//       },
//       {
//         $lookup : {
//           from : 'ride',
//           localField : 'ride',
//           foreignField : '_id',
//           as : 'ride'
//         }
//       },
//       {
//         $lookup : {
//           from : 'ticketDetails',
//           localField : 'details',
//           foreignField : '_id',
//           as : 'details'
//         }
//       },
//       {
//         $lookup : {
//           from : 'receipt',
//           localField : 'receipt',
//           foreignField : '_id',
//           as : 'receipt'
//         }
//       },
//       { $unwind : '$receipt' },
//       { $unwind : '$details' },
//       { $unwind : '$ride' },
//       {
//         $lookup : {
//           from : 'bus',
//           localField : 'ride.bus',
//           foreignField : '_id',
//           as : 'ride.bus'
//         }
//       },
//       { $unwind : '$ride.bus' },
//       {
//         $group : {
//           _id : {
//             time : '$time',
//             date : '$date',
//             receipt : '$receipt._id',
//             luggage : '$receipt.luggageQty',
//             bus : '$ride.bus.name'
//           },
//           tickets : { $push : '$$ROOT' }
//         }
//       },
//     ])

//     const report1 = report.map(obj => {
//       const { date, time, luggage, bus : bs } = obj._id

//       const data = {
//         date,
//         time,
//         driver : 'Dylan',
//         bus : bs,
//         // npp : 0,
//         npn : 0,
//         luggages : { qty : luggage, total : luggage * 10 },
//         packages : { qty : 0, total : 0 },
//         airport : { qty : 0, total : 0 },
//         used : { qty : 0, total : 0 },
//         deleted : { qty : 0, total : 0 },
//         null : { qty : 0, total : 0 },
//         vip : { qty : 0, total : 0 },
//         total : 0,
//         ticketQty : 0
//       }

//       obj.tickets.forEach(ticket => {
//         data.ticketQty += 1
//         data.total += ticket.details.fee
//         data.total += ticket.details.extraFee
//         // data.npp += +ticket.confirmed
//         data.npn += +ticket.confirmed

//         switch(ticket.type) {
//           case 'AIRPORT':
//             data.airport = {...{
//               qty : data.airport.qty + 1,
//               total : data.airport.total + ticket.details.fee
//             }}

//             break
//           case 'PACKAGE':
//             data.airport = {...{
//               qty : data.airport.qty + 1,
//               total : data.airport.total + ticket.details.fee
//             }}
//             break
//           case 'VIP':
//             data.airport = {...{
//               qty : data.vip.qty + 1,
//               total : data.vip.total + ticket.details.fee
//             }}
//             break
//           default:
//             break
//         }

//         switch(ticket.status) {
//           case 'DELETED':
//             data.deleted = { ...{
//               qty : data.deleted.qty + 1,
//               total : data.deleted.total + ticket.details.fee
//             }}
//             break
//           case 'NULL':
//             data[ 'null' ] = { ...{
//               qty : data[ 'null' ].qty + 1,
//               total : data[ 'null' ].total + ticket.details.fee
//             }}
//             break
//           case 'USED':
//             data.used = { ...{
//               qty : data.used.qty + 1,
//               total : data.used.total + ticket.details.fee
//             }}
//             break
//           default:
//             break
//         }
//       })

//       return data
//     })

//     // console.log(JSON.stringify(report1, null, 2))
//     console.log(report1)
//     // console.log(JSON.stringify(report, null, 2))
//     // console.log(report)


//   } catch (e) {
//     console.log(e)
//   }
// })()

export default {
  deleteAllCollections,
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
