import React from 'react'
// import { formatDate, formatHour } from '../../utils'

export const getExtraPrice = (obj, zip) => {
  if(!zip) return 0
  const len = obj.length

  for(let i = 0; i < len; i++) {
    // console.log(obj[ i ])
    if(obj[ i ].zipcodes.includes(zip)) {
      // console.log('Zip found: ' + zip)
      return obj[ i ].price
    }
  }

  // console.log('No zip found, zip: ' + zip)
  return 0
}

export const verifyCard = number => {
  
  // Visa => 16, starts with 4
  if(/^4/.test(number) && number.length === 16) return 'VISA'

  // American Express => 15, starts with 3, second either 4 or 7
  else if(/^3[47]/.test(number) && number.length >= 15) return 'AMERICAN EXPRESS'

  // MasterCard => 16, starts with 5, second from 1 to 5, ranges 510000 to 559999, starts with 2 and second is 2 to 7, ranges 222100 to 272099
  else if(/^(5[1-5]|2[2-7])/.test(number) && number.length >= 16 ){
    const card = Number(number.slice(0,6))
    if((card > 222099 && card < 272100) || (card > 509999 && card < 560000)) return 'MASTERCARD'
  }

  return ''
}

export const formatTicketData = ticket => {
  // console.log(ticket)

  const { person, pickUpAddress, dropOffAddress } = ticket

  const date = new Date(new Date(ticket.date).setHours(0,0,0,0))

  return {
    id : ticket.id,
    person : {
      firstname : person.firstname,
      lastname : person.lastname,
      email : person.email,
      phoneNumber : person.phoneNumber,
    },
    date,
    time : ticket.time,
    willPick : ticket.willPick,
    willDrop : ticket.willDrop,
    pickUpAddress : {
      street : pickUpAddress.street,
      city : pickUpAddress.city,
      state : pickUpAddress.state,
      zipcode : pickUpAddress.zipcode
    }, 
    dropOffAddress : {
      street : dropOffAddress.street,
      city : dropOffAddress.city,
      state : dropOffAddress.state,
      zipcode : dropOffAddress.zipcode
    },
    from : ticket.from,
    to : ticket.to,
    oldDate : date,
    oldTime : ticket.time
  }
}

export const reformatTicketData = tickt => {
  // console.log(tickt)
  return {
    id : tickt.id,
    isLocal : true,
    frm : tickt.from,
    to : tickt.to,
    departureDate : tickt.date,
    departureTime : tickt.time,
    howMany : tickt.ticketMany,
    luggage : tickt.luggage,
    firstname : tickt.person.firstname,
    lastname : tickt.person.lastname,
    phoneNumber : tickt.person.phoneNumber,
    email : tickt.person.email,
    willPick : tickt.willPick,
    willDrop : tickt.willDrop,
    pickUpAddress : tickt.willPick ? tickt.pickUpAddress : null,
    dropOffAddress : tickt.willDrop ? tickt.dropOffAddress : null,
    totalAmount : tickt.totalAmount,
    cardBrand : tickt.payment.isCard ? verifyCard(tickt.payment.cardNumber) : '',
    cardLastDigits : tickt.payment.isCard ? tickt.payment.cardNumber.slice(-4) : '',
    paymentType : tickt.payment.isCard ? 'CARD' : 'CASH', 
    status : tickt.status,
    fee : parseFloat(tickt.fee),
    extraFee : parseFloat(tickt.extraFee),
  }
}