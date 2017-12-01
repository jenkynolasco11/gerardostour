import Router from 'koa-router'
import mongoose from 'mongoose'

import { Ticket, Payment, TicketDetail, Person, Ride, Address /*,Bus*/ } from '../../models'
import { createPerson, createAddress, filterDoc } from '../../utils'
import { isObject } from 'util';

const ticket = new Router({ prefix : 'ticket' })

const getTicketData = async tckt => {
  try {
    const ride = tckt.ride ? await Ride.findById(tckt.ride) : 'none'
    const person = await Person.findById(tckt.person)
    const details = await TicketDetail.findById(tckt.details)
    const pick = await (tckt.willPick ? Address.findById(details.pickUpAddress) : 'none')
    const drop = await (tckt.willDrop ? Address.findById(details.dropOffAddress) : 'none')

    const pickAdd = pick !== 'none' ? { ...pick.toObject() } : pick
    const dropAdd = drop !== 'none' ? { ...drop.toObject() } : drop

    const data = {
      willDrop : tckt.willDrop,
      willPick : tckt.willPick,
      luggage : tckt.luggageCount,
      status : tckt.status,
      from : tckt.from,
      to : tckt.to,
      pickUpAddress : filterDoc(pickAdd),
      dropOffAddress : filterDoc(dropAdd),
      time : details.time,
      date : details.date,
      person : {
        firstname : person.firstname,
        lastname : person.lastname,
        email : person.email,
        phoneNumber : person.phoneNumber
      }
    }

    return data
  } catch (e) {
    console.log(e)
  }

  return null
}

// Middleware for webhook data
const reformatTicket = (ctx, next) => {
  
  const { body } = ctx.request

  // If its local, return. No need to reformat data structure
  if(body.isLocal) return next()

  // console.log(body)

  const newBody = {
    frm : body.desde,
    to : body.hacia,
    departureDate : new Date(body.fecha_salida),
    departureTime : parseInt(body.hora_salida) - 1,
    howMany : body.numero_tickets,
    luggage : parseInt(body.extra_maletas),
    firstname : body.nombre.split(' ')[ 0 ],
    lastname : body.apellido.split(' ')[ 0 ],
    phoneNumber : body.telefono.replace(/\D/g, ''),
    email : body.email,
    willPick : body.recoger === 'checked',
    willDrop : body.dejar === 'checked',
    pickUpAddress : body.recoger === 'checked'
    ? {
      street : body.calle_origen,
      city : body.ciudad_origen,
      state : body.estado_origen,
      zipcode : body.zipcode_origen
    } 
    : null,
    dropOffAddress : body.dejar === 'checked'
    ? {
      street : body.calle_destino,
      city : body.ciudad_destino,
      state : body.estado_destino,
      zipcode : body.zipcode_destino
    }
    : null,
    totalAmount : parseFloat(body.total_final),
    cardBrand : body.card_brand.toUpperCase(),
    cardLastDigits : body.card_last_digits,
    paymentType : body.type ? body.type : 'CARD',
    status : 'NEW',
    fee : parseFloat(body.precio_primera_ruta),
    extraFee : parseFloat(body.precio_segunda_ruta),
  }

  ctx.request.body = newBody

  return next()
}

// Ticket details
const saveTicket = async ({ data, person, pickUp, dropOff }) => {
  // console.log(data)
  const {
    frm,
    to,
    luggage,
    willPick,
    willDrop,
    status = 'NEW',
    fee,
    extraFee,
    departureDate,
    departureTime,
    cardBrand,
    cardLastDigits,
    totalAmount,
    paymentType
  } = data

  try {
    const payment = await new Payment({
      cardBrand,
      cardLastDigits,
      totalAmount,
      type : paymentType
    }).save()

    const details = await new TicketDetail({ 
      pickUpAddress : pickUp,
      dropOffAddress : dropOff,
      redeemedCount : 0,
      fee,
      extraFee,
      date : departureDate,
      time : departureTime,
    }).save()

    // TODO: Make sure that the data inserted is sanitized, or it'll break!!!
    const tckt = await new Ticket({
      person,
      details : details._id,
      payment : payment._id,
      status,
      luggageCount : luggage,
      willPick,
      willDrop,
      from : frm,
      to
    }).save()

    return tckt._id
  } catch(e) {
    return null
  }
}

// Create Tickets
const saveTickets = async data => {
  const { howMany } = data

  const promises = []

  try {
    const person = await createPerson(data)

    const pickUp = await (
      data.willPick 
      ? createAddress({ ...data.pickUpAddress })
      : null
    )

    const dropOff = await (
      data.willDrop 
      ? createAddress({ ...data.dropOffAddress })
      : null
    )

    // If anything got bad on inserting, then erase all the shit back!
    if(!person || (!pickUp && data.willPick) || (!dropOff && data.willDrop)) {
      console.log('Erasing shit... Something happened...')

      [
        // { obj : details, col : TicketDetail },
        { obj : person, col : Person }, 
        // { obj : payment, col : Payment },
        { obj : pickUp, col : Address },
        { obj : dropOff, col : Address }
      ].forEach(async itm => {
        // Remove entries if any
        if(itm.obj) await itm.col.remove({ _id : itm.obj._id ? itm.obj._id : itm.obj })
      })

      return null
    }

    for(let i = 0; i < howMany; i++) 
      promises.push(saveTicket({ 
        data, 
        pickUp,
        person, 
        dropOff
      }))
    
    // const data = await Promise.all(promises)
    return Promise.all(promises)
  } catch (e) {
    console.log(e)
    return null
  }
}

// Retrieve a ticket information
ticket.get('/:id', async ctx => {
  const { id } = ctx.params

  try {
    const tckt = await Ticket.findById(id)

    if(tckt) {
      const ticketData = await getTicketData(tckt)

      if(ticketData) return ctx.body = { ok : true, data : ticketData, message : '' }
    }

    return ctx.body = { ok : false, data : null, message : 'Couldn\'t retrieve ticket. Either doesn\'t exist or we have a problem on the server' }
  } catch (e) {
    return ctx.body = { ok : false, data : null, message : 'Error retrieving ticket' }
  }
})

// Retrieve a ticket payment information
ticket.get('/:id/payment', async ctx => {
  const { id } = ctx.params

    try {
      const tckt = await Ticket.findById(id)

      if(tckt) {
        const payment = await Payment.findById(tckt.payment)
        const { cardLastDigits, cardBrand, totalAmount, type } = payment

        const data = {
          fee : tckt.fee,
          extraFee : tckt.fee,
          totalAmount, 
          type
        }

        if(type === 'CARD')

        data.cardBrand = cardBrand
        data.cardLastDigits = cardLastDigits

        return ctx.body = { ok : true, data, message : '' }
      }

      return ctx.body = { ok : false, data : null, message : 'Couldn\'t retrieve payment details' }
    } catch (e) {
      return ctx.body = { ok : false, data : null, message : 'Error retrieving payment details' }
    }
})

// Saves a(s many) ticket
ticket.post('/insert', reformatTicket, async ctx => {
  const { body } = ctx.request

  // TODO : Add this later. With this, I'll know if it's 
  const { isLocal } = body

  const promises = []

  try {
    const data = await saveTickets(body)

    // console.log(data)
    if(data) return ctx.body = { ok : true, data, message : '' }

    return ctx.body = { ok : false, data : null, message : 'Couldn\'t save the ticket. Contact your system administrator.' }
  } catch (e) {
    console.log(e)
    return ctx.body = { ok : false, data : null, message : 'Error trying to save your ticket.' }
  }
})

ticket.get('/all', async ctx => {
  try {
    return ctx.body = { ok : false, data : null, message : 'There are no ticket' }
  } catch (e) {
    return ctx.body = { ok : false, data : null, message : 'Error retrieving the tickets for this ride' }
  }
})

// Get tickets by Date range (if d2 is not passed, all tickets by date d1)
ticket.get('/date/:d1/:d2?', async ctx => {
  let { d1, d2 } = ctx.params

  // console.log('here')

  let tickets = []

  const date1 = parseInt(d1)

  d2 = d2 ? d2 : new Date(parseInt(d1)).setDate(new Date(date1).getDate() + 1)

  const date2 = parseInt(d2)
  
  // console.log(date1, date2)

  try {
    const details = await TicketDetail.aggregate([
      { $match : { date : { $gte : new Date(date1), $lte : new Date(date2) }}},
      { $sort : { time : 1, date : -1 }}
    ])

    // console.log(details.map( t => t._id))
    // // return ctx.body = "ñe"

    if(details.length)
      tickets = await Promise.all(
        details.map(det => Ticket.findOne({ details : det._id }))
      )

    if(tickets.length) {
      const data = await Promise.all(tickets.map(getTicketData))

      return ctx.body = { ok : true, data : data.filter(isObject), message : '' }
    }

    return ctx.body = { ok : false, data : null, message : 'There are no ticket for this ride' }
  } catch (e) {
    return ctx.body = { ok : false, data : null, message : 'Error retrieving the tickets for this ride' }
  }
})

// Retrieve all tickets from ride
ticket.get('/all/:ride', async ctx => {
  const { ride } = ctx.params

  // if(/\D/.test(time)) return ctx.body = { ok : false, data : null, message : 'Not a valid time parameter' }

  try {
    const tickets = await Ticket.find({ ride })

    if(tickets.length) {
      const data = await Promise.all(tickets.map(getTicketData))

      return ctx.body = { ok : true, data, message : '' }
    }

    return ctx.body = { ok : false, data : null, message : 'There are no ticket for this ride' }
  } catch (e) {
    return ctx.body = { ok : false, data : null, message : 'Error retrieving the tickets for this ride' }
  }
})

ticket.post('/assign-ride', async ctx => {
  const { ticketId, rideId } = ctx.request.body
  const tickts = JSON.parse(ticketId)

  try {
    const rid = await Ride.findById(rideId)

    if(!rid) return ctx.body = { ok : false, data : null, message : 'There is no ride assigned to this id.' }

    const data = await Promise.all(
      tickts.map( tcktId => (
        Ticket.findByIdAndUpdate(tcktId, { ride : rid._id })
      ))
    )

    if(data.length) return ctx.body = { ok : true, data : null, message : '' }

    return ctx.body = { ok : false, data : null, message : 'There is no ticket with that id.' }
  } catch (e) {
    return ctx.body = { ok : false, data : null, message : 'Error retrieving assigning ride to ticket' }
  }
})

export default ticket