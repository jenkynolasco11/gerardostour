// Tempting to rename CRUD

import {
  Person,
  Address,
  Receipt,
  Meta,
  // Bus,
  // BusDetail,
  // Payment,
  // Ride,
  // RideDetail,
  // Ticket,
  // TicketDetail,
  // User
} from '../models'

export const createMeta = async () => {
  try {
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

    // console.log(meta)
  } catch (e) { }
}

 // TODO : Add how many times this person has bought tickets in the application for logging purposes
export const createPerson = async data => {
  const { firstname, lastname, email, phoneNumber } = data

  try {
    let person = await Person.findOne({ $or : [{ email }, { phoneNumber }] })

    if(!person) person = await new Person({ firstname, lastname, email, phoneNumber }).save()

    return person._id
  } catch (e) {
    console.log(e)
    console.log('src/utils/index.js (Tempted to rename "CRUD")')
  }

  return null
}

export const createReceipt = async data => {
  const {
    // id,
    paymentType = 'CASH',
    fee,
    extraFee,
    totalAmount,
    cardBrand = '',
    luggage = 0,
    ticketCant,
    cardLastDigits = '',
    howMany,
  } = data

  try {
    const receipt = await new Receipt({
      id : data.lastReceiptId,
      ticketCant : howMany,
      paymentType,
      fee,
      extraFee,
      totalAmount,
      cardBrand,
      luggage,
      ticketCant,
      cardLastDigits
    }).save()

    return receipt._id
  } catch (e) {
    console.log(e)
    console.log('... @ src/routes/api/ticket/ticket.controller.js')
  }

  return null
}

// TODO : Add how many times this address has been used in the application for logging purposes
export const createAddress = async data => {
  const { street, state, zipcode, city } = data

  try {
    let address = await Address.findOne({ street, state, zipcode, city })

    if(!address) address = await new Address({ street, state, zipcode, city }).save()

    return address._id
  } catch (e) {
    console.log(e)
    console.log('... @ src/utils/index.js')
  }

  return null
}

// Remove non wanted fields
export const filterDoc = doc => {
  if(doc === 'none') return doc

  const { _id, __v, modifiedAt, createdAt, ...rest }  = doc

  return rest
}

// TODO : Make sure willPick and willDrop are sent as booleans
export const createTicketSideData = async (data) => {
  try {
    const person = await createPerson(data)
    const pickUp = await (
      // data.willPick === 'true'
      data.willPick
      ? createAddress({ ...data.pickUpAddress })
      : null)

    const dropOff = await (
      // data.willDrop === 'true'
      data.willDrop
      ? createAddress({ ...data.dropOffAddress })
      : null)

    const receipt = await createReceipt(data)

    const retrnData = [ person, pickUp, dropOff, receipt ]

    return retrnData
  } catch (e) {
    console.log(e)
    console.log('... @ src/utils/index.js')
  }

  return null
  // throw new Error('Oh snap...')
}