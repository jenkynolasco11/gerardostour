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
    const meta = await Meta.findOne({})

    if(!meta) {
      const defaultMeta = {
        lastTicketId : 1,
        lastReceiptId : 1,
        lastRideId : 1,
        lastBusId : 1,
      }

      await new Meta(defaultMeta).save()
    }
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
    paymentType = 'CASH',
    fee,
    extraFee,
    totalAmount,
    cardBrand = '',
    luggage = 0,
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
      cardLastDigits
    }).save()

    return receipt
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

export const createTicketSideData = async data => {
  try {
    const person = await createPerson(data)
    const pickUp = await (
      data.willPick === 'true'
      ? createAddress({ ...data.pickUpAddress })
      : null)

    const dropOff = await (
      data.willDrop === 'true'
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