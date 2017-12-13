import Router from 'koa-router'

import { Ticket, Receipt, TicketDetail, Ride } from '../../../models'
import { getTicketData, reformatTicket, saveTickets } from './ticket.controller'

const ticketRouter = new Router({ prefix : 'ticket' })

// //////////////////////// Routes
// Retrieve a ticket payment information
ticketRouter.get('/:id/receipt', async ctx => {
  const { id } = ctx.params

    try {
      const tckt = await Ticket.findOne({ id })
      const ticketsIssued = (await Ticket.find({ receipt : tckt.receipt }, { id : 1, _id : 0 }))
                                          .map(i => i.id)
                                          .sort((a,b) => a - b)

      if(tckt) {
        const receipt = await Receipt.findById(tckt.receipt)
        const { cardLastDigits, cardBrand, totalAmount, paymentType, fee, extraFee } = receipt

        const data = { fee, extraFee, totalAmount, paymentType, ticketsIssued }

        if(paymentType === 'CARD') {
          data.cardBrand = cardBrand
          data.cardLastDigits = cardLastDigits
        }

        return ctx.body = { ok : true, data : { receipt : data }, message : '' }
      }

      return ctx.body = { ok : false, data : null, message : 'Couldn\'t retrieve receipt details' }
    } catch (e) {
      console.log(e)
    }

    return ctx.body = { ok : false, data : null, message : 'Error retrieving receipt details' }
})

// TODO : Check this one when I create the form for ticket creation
// Saves a(s many) ticket
ticketRouter.post('/save', reformatTicket, async ctx => {
  const { body } = ctx.request

  try {
    const data = await saveTickets(body)

    // console.log(data)
    if(data) return ctx.body = { ok : true, data, message : '' }

    return ctx.body = { ok : false, data : null, message : 'Couldn\'t save the ticket. Contact your system administrator.' }
  } catch (e) {
    console.log(e)
  }

  return ctx.body = { ok : false, data : null, message : 'Error trying to save your ticket.' }
})

/*
// Get tickets by Date range (if d2 is not passed, all tickets by date d1)
ticketRouter.get('/date/:d1/:d2?', async ctx => {
  let { d1, d2 } = ctx.params
  const { limit = 20, skip = 0 } = ctx.query

  let tickets = []

  const dateX = parseInt(d1)
  const date1 = new Date(dateX)

  // Set hours to 0
  date1.setHours(0,0,0,0)

  d2 = d2 ? d2 : new Date(parseInt(d1)).setDate(new Date(date1).getDate() + 1)

  const dateX2 = parseInt(d2)
  const date2  = new Date(dateX2)
  date2.setHours(0,0,0,0)

  try {
    const details = await TicketDetail.aggregate([
      { $skip : skip },
      { $match : { date : { $gte : date1, $lte : date2 }}},
      { $limit : limit },
      { $sort : { date : -1, time : 1 }},
    ])

    // console.log(details.map( t => t._id))
    // // return ctx.body = "ñe"

    if(details.length)
      tickets = await Promise.all(
        details.map(det => Ticket.findOne({ details : det._id }))
      )

    if(tickets.length) {
      const data = await Promise.all(tickets.map(getTicketData))

      return ctx.body = { ok : true, data : data.filter(Boolean), message : '' }
    }

    return ctx.body = { ok : false, data : null, message : 'There are no ticket for this ride' }
  } catch (e) {
    console.log(e)
    return ctx.body = { ok : false, data : null, message : 'Error retrieving the tickets for this ride' }
  }
})
*/

// Assign ride to ticket
ticketRouter.put('/modify/ride', async ctx => {
  const { ticketIds, rideId } = ctx.request.body

  // const tickts = JSON.parse(ticketIds)

  try {
    const rid = await Ride.findById(rideId, { _id : 1 })

    if(!rid) return ctx.body = { ok : false, data : null, message : 'There is no ride assigned to this id.' }

    await Promise.all(
      tickts.map( tcktId => Ticket.findByIdAndUpdate(tcktId, { ride : rid }))
    )

    return ctx.body = { ok : true, data : null, message : '' }
  } catch (e) {
    console.log(e)
  }

  return ctx.body = { ok : false, data : null, message : 'Error retrieving assigning ride to ticket' }
})

// Modify ticket status => [ 'USED', 'REDEEMED', 'NULL', 'NEW' ]
ticketRouter.put('/modify/status', async ctx => {
  const { ticketIds, status } = ctx.request.body

  // console.log(ticketIds)
  // const tckts = JSON.parse(ticketIds)

  try {
    const data = await Promise.all(
      ticketIds.map( id => Ticket.findOneAndUpdate({ id }, { status }))
    )

    return ctx.body = { ok : true, data : null, message : '' }
  } catch (e) {
    console.log(e)
  }

  return ctx.body = { ok : false, data : null, message : 'Error on changing tickets status' }
})

// Deletes tickets
ticketRouter.put('/delete', async ctx => {
  const { tickets } = ctx.request.body

  try {
    await Promise.all(
      tickets.map( id => Ticket.findOneAndUpdate({ id }, { status : 'DELETED' }))
    )

    return ctx.body = { ok : true, data : null, message : 'Tickets deleted!' }
  } catch (e) {
    console.log(e)
  }

  return ctx.body = { ok : false, data : null, message : 'Error on deleting tickets' }
})

// Return all tickets that are not USED nor NULL
ticketRouter.get('/all', async ctx => {
  const {
    nonstatus = 'NULL,USED,DELETED',
    status = 'NEW',
    limit = 10,
    skip = 0,
    unassigned = true
  } = ctx.query

  const nonlist = [].concat(nonstatus.split(','))
  const list = [].concat(status.split(','))
  const conditions = { $and : [{ status : { $in : list }}, { status : { $nin : nonlist }}] }

  if(unassigned) conditions.ride = null

  try {
    const tickets = await Ticket
                          .find(conditions)
                          .sort({ id : -1 })
                          .skip(skip)
                          .limit(limit)
                          .exec()

    if(tickets.length) {
      const data = await Promise.all(tickets.map(getTicketData))

      const count = await Ticket.count({ status : { $nin : list }})

      return ctx.body = { ok : true, data : { tickets : data, count }, message : '' }
    }

    return ctx.body = { ok : false, data : null, message : 'There are no tickets.' }
  } catch (e) {
    console.log(e)
  }

  return ctx.body = { ok : false, data : null, message : 'Eor retrieving the tickets for this ride' }
})

// Retrieve all tickets from ride
ticketRouter.get('/all/:ride', async ctx => {
  const { ride } = ctx.params

  // if(/\D/.test(time)) return ctx.body = { ok : false, data : null, message : 'Not a valid time parameter' }

  try {
    const tickets = await Ticket
                          .find({ ride })
                          .sort({ id : -1 })
                          .exec()

    if(tickets.length) {
      const data = await Promise.all(tickets.map(getTicketData))

      return ctx.body = { ok : true, data, message : '' }
    }

    return ctx.body = { ok : false, data : null, message : 'There are no ticket for this ride' }
  } catch (e) {
    console.log(e)
  }

  return ctx.body = { ok : false, data : null, message : 'Error retrieving the tickets for this ride' }
})

// Retrieve a ticket information
ticketRouter.get('/:id', async ctx => {
  const { id } = ctx.params

  try {
    const tckt = await Ticket.findOne({ id })

    if(tckt) {
      const ticketData = await getTicketData(tckt)

      if(ticketData) return ctx.body = { ok : true, data : ticketData, message : '' }
    }

    return ctx.body = { ok : false, data : null, message : 'Couldn\'t retrieve ticket. Either doesn\'t exist or we have a problem on the server' }
  } catch (e) {
    console.log(e)
  }

  return ctx.body = { ok : false, data : null, message : 'Error retrieving ticket' }
})

export default ticketRouter