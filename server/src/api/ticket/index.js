import Router from 'koa-router'

import { Ticket, Payment, TicketDetail, Person, Ride, Route, Bus } from '../../models'

const ticket = new Router({ prefix : 'ticket' })

const getTicketData = async tckt => {
  try {
    const ride = await Ride.findById(tckt.ride)
    const person = await Person.findById(tckt.person)
    const details = await TicketDetail.findById(tckt.details)
    const frm = await Route.findById(ride.routeFrom)
    const to = await Route.findById(ride.routeTo)

    const data = {
      willDrop : tckt.willDrop,
      willPick : tckt.willPick,
      pickUpAddress : details.pickUpPlace ? details.pickUpPlace : '',
      dropOffAddress : details.dropOffPlace ? details.dropOffPlace : '',
      luggage : tckt.luggageCount,
      status : tckt.status,
      routeFrom : {
        state : frm.state,
        city : frm.city,
        street : frm.street,
        zip : frm.zipcode,
      },
      routeTo : {
        state : to.state,
        city : to.city,
        street : to.street,
        zip : to.zipcode,
      },
      time : ride.time,
      date : ride.date,
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
        const data = { cardLastDigits, cardBrand, totalAmount, type }

        return ctx.body = { ok : true, data, message : '' }
      }

      return ctx.body = { ok : false, data : null, message : 'Couldn\'t retrieve payment details' }
    } catch (e) {
      return ctx.body = { ok : false, data : null, message : 'Error retrieving payment details' }
    }
})

const saveTicket = async data => {
  // console.log(data)
  const {
    type,
    totalAmount,
    pickUpPlace,
    dropOffPlace,
    ride,
    email,
    firstname,
    lastname,
    phoneNumber,
    luggage,
    status = 'NEW'
  } = data

  const isCard = type === 'CARD'
  const cardBrand 
    = isCard
    ? data.cardBrand
    : ''
  const cardLastDigits
    = isCard 
    ? data.cardLastDigits
    : ''

    try {
      // TODO : SEE HOW TO SOLVE THIS SHIT!!! CANT ENTER A NEW PERSON ON EVERY BOUGHT TICKET
      let person = await Person.findOne({ phoneNumber })
      if(!person) person = await new Person({ firstname, lastname, phoneNumber, email }).save()

      const payment = await new Payment({ type, totalAmount, cardBrand, cardLastDigits }).save()

      const details = await new TicketDetail({ pickUpPlace, dropOffPlace }).save()

      // If anything got bad on inserting, then erase all the shit back!
      if(!details || !person || !payment) {
        console.log('Erasing shit... Something happened...')

        [
          { obj : details, col : TicketDetail },
          { obj : person, col : Person }, 
          { obj : payment, col : Payment }
        ].forEach(async itm => {
          // Remove entries if any
          if(itm.obj) await itm.col.remove({ _id : itm.obj._id })
        })

        return null
      }

      // TODO: Make sure that the data inserted is sanitized, or it'll break!!!
      const tckt = await new Ticket({
        person : person._id,
        details : details._id,
        payment : payment._id,
        ride,
        status,
        willDrop : dropOffPlace !== '',
        willPick : pickUpPlace !== '',
        luggageCount : luggage,
      }).save()

      return tckt._id
    } catch(e) {
      return null
    }
}

// Saves a(s many) ticket
ticket.post('/insert/:many', async ctx => {
  const { body } = ctx.request
  const { many } = ctx.params

  const promises = []

  try {
    for(let i = 0; i < many; i++) promises.push(saveTicket( body ))
    
    const data = await Promise.all(promises)

    if(data) return ctx.body = { ok : true, data, message : '' }

    return ctx.body = { ok : false, data : null, message : 'Couldn\'t save the ticket. Contact your system administrator.' }
  } catch (e) {
    return ctx.body = { ok : false, data : null, message : 'Error trying to save your ticket.' }
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

export default ticket