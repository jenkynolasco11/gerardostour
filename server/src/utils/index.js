// Tempting to rename CRUD

import {
  Person,
  Address,
  // Bus,
  // BusDetail,
  // Payment,
  // Ride,
  // RideDetail,
  // Ticket,
  // TicketDetail,
  // User
 } from '../models'

export const createPerson = async ({ firstname, lastname, email, phoneNumber }) => {
  try {
    let person = await Person.findOne({ phoneNumber })
    if(!person) person = await new Person({ firstname, lastname, email, phoneNumber }).save()

    return person._id
  } catch (e) {
    return null
  }
}

export const createAddress = async ({ street, state, zipcode, city }) => {
  try {
    let address = await Address.findOne({ street, state, zipcode, city })
    if(!address) address = await new Address({ street, state, zipcode, city }).save()

    return address._id
  } catch (e) {
    return null
  }
}

// Remove non wanted fields
export const filterDoc = doc => {
  if(doc === 'none') return doc
  const { _id, __v, modifiedAt, createdAt, ...rest }  = doc

  return rest
}

export const formatHour = t => `${ ('00' + (t % 12 ? (t % 12) + 1 : 1)).slice(-2) }:00 ${ t > 10 && t !== 23 ? 'PM' : 'AM' }`

export const formatDate = date => {
  const day = `00${ date.getDay() + 1 }`.slice(-2)
  const month = `00${ date.getMonth() + 1 }`.slice(-2)
  const year = date.getFullYear()

  return `${ day }-${ month }-${ year }`
}    

export const formatPhone = phone => {
  const phoneRegx = /(\d{3})(\d{3})(\d{4})/g.exec(phone)
  return `(${ phoneRegx[ 1 ] }) ${ phoneRegx[ 2 ] }-${ phoneRegx[ 3 ] }`
}