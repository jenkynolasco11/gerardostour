import Router from 'koa-router'

import { Ticket, Ride, Person } from '../../../models'
import { getTicketData, reformatTicket, saveTickets, getTicketReceipt, updateTicket } from './ticket.controller'

const ticketRouter = new Router({ prefix : 'ticket' })

// //////////////////////// Routes
// Retrieve a ticket payment information
ticketRouter.get('/:id/receipt', async ctx => {
  const { id } = ctx.params

  try {
    const data = await getTicketReceipt(id)

    if(data) return ctx.body = { ok : true, data : { receipt : data }, message : '' }

    return ctx.body = { ok : false, data : null, message : 'Couldn\'t retrieve receipt details' }
  } catch (e) {
    console.log(e)
  }

  return ctx.body = { ok : false, data : null, message : 'Error retrieving receipt details' }
})

// TODO : Check this one when I create the form for ticket creation
// Saves a(s many) ticket(s)
ticketRouter.post('/save', reformatTicket, async ctx => {
  const { body } = ctx.request

  try {
    const data = await saveTickets(body)

    if(data) return ctx.body = { ok : true, data : { tickets : data }, message : '' }

    return ctx.body = { ok : false, data : null, message : 'Couldn\'t save the ticket. Contact your system administrator.' }
  } catch (e) {
    console.log(e)
  }

  return ctx.body = { ok : false, data : null, message : 'Error trying to save your ticket.' }
})

ticketRouter.put('/:id/modify', async ctx => {
  const { id } = ctx.params
  const { body } = ctx.request

  try {
    // console.log(body)
    const data = await updateTicket(id, body)

    if(data) return ctx.body = { ok : true, data : { ticketId : data }, message : '' }

    return ctx.body = { ok : false, data : null, message : 'Couldn\'t update the ticket. Contact your system administrator.' }
  } catch (e) {
    console.log(e)
  }

  return ctx.body = { ok : false, data : null, message : 'Error trying to update ticket.' }
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
ticketRouter.put('/assign/ride', async ctx => {
  const { tickets, ride } = ctx.request.body

  try {
    const rid = await Ride.findOne({ id : ride }, { _id : 1 })

    if(!rid) return ctx.body = { ok : false, data : null, message : 'There is no ride assigned to this id.' }

    const objs = await Promise.all(
      tickets.map( tcktId => Ticket.findOneAndUpdate({ id : tcktId }, { ride : rid._id }, { new : true }))
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
  // [ 'USED', 'REDEEMED', 'NULL', 'NEW', 'DELETED' ]
  const {
    // status = 'NULL,USED,DELETED',
    search = '',
    searchCriteria = '',
    status = 'NEW,REDEEMED,CANCELLED,USED',
    sort = 'id -1',
    limit = 10,
    skip = 0,
    type = 'REGULAR,PACKAGE,VIP,SPECIAL,AIRPORT',
    // onlypackage = 'false',
    unassigned = 'true'
  } = ctx.query

  console.log(type, status)

  const statuss = [].concat(status.split(','))
  const types = [].concat(type.split(','))

  let conditions = { status : { $in : statuss }, type : { $in : types }}

  const [ srt, asc ] = sort.split(' ')
  const sortCondition = { [ srt ] : asc }

  if(srt === 'date') sortCondition.time = asc < 0 ? -1 : 1
  if(srt === 'time') sortCondition.date = asc < 0 ? -1 : 1

  if(unassigned === 'true') conditions.ride = null

  try {
    if(search) {
      delete conditions.status
      const regex = new RegExp(`^${ search }`, 'i')

      if(searchCriteria !== 'id') {
        const person = await Person.find({ [ searchCriteria ] : { $regex : regex }}, { _id : 1 })

        conditions.person = { $in : [].concat(person.map(({ _id }) => _id )) }
      // } else conditions.id = { $regex : regex }
      } else conditions = { $where : `/^${ search }.*/.test(this.id)` }
    }

    const tickets = await Ticket
                          .find(conditions)
                          .skip(Number(skip))
                          .limit(Number(limit))
                          .sort(sortCondition)
                          .exec()

    if(tickets.length) {
      const data = await Promise.all(tickets.map(getTicketData))
      // console.log(JSON.stringify(data, null, 2))
      const count = await Ticket.count(conditions)
      // console.log(JSON.stringify(data, null, 3))
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

  try {
    const rid = await Ride.findOne({ id : ride }, { _id : 1, id : 1 })
    // Ticket.find({}, console.log)

    const tickets = await Ticket.aggregate([
      { $match : { ride : rid._id, status : { $ne : 'DELETED' }}},
      {
        $lookup : {
          from: 'ticketDetails',
          localField: 'details',
          foreignField: '_id',
          as: 'details'
        }
      },
      { $unwind : '$details' },
      {
        $lookup : {
          from: 'address',
          localField: 'details.dropOffAddress',
          foreignField: '_id',
          as: 'dropOffAddress'
        }
      },
      {
        $unwind : {
          path : '$dropOffAddress',
          preserveNullAndEmptyArrays : true
        }
      },
      {
        $lookup : {
          from: 'address',
          localField: 'details.pickUpAddress',
          foreignField: '_id',
          as: 'pickUpAddress'
        }
      },
      {
        $unwind : {
          path : '$pickUpAddress',
          preserveNullAndEmptyArrays : true
        }
      },
      {
        $project : {
          id : 1,
          person : 1,
          date : 1,
          time : 1,
          // receipt : 1,
          status : 1,
          details : 1,
          frm : 1,
          to : 1,
          // confirmed : 1,
          reminded : 1,
          type : 1,
          willDrop : 1,
          willPick : 1,
          dropOffAddress : 1,
          pickUpAddress : 1,
          packages : { $cond: [ { $eq : [ 'type', 'PACKAGE' ] }, 1, 0 ] },
          confirmed : { $cond : [ '$confirmed', 1, 0 ] },
          package : { $cond : [ '$confirmed', 0, 1 ] }
        }
      },
      {
        $group : {
          _id : { person : '$person', dropOffAddress : '$dropOffAddress', pickUpAddress : '$pickUpAddress' },
          // tickets : { $push : '$$ROOT' },
          total : { $sum : 1 },
          confirmed : { $sum : '$confirmed' },
          notConfirmed : { $sum : '$notConfirmed' },
          packages : { $sum : '$package' }
        }
      },
      {
        $lookup : {
          from: 'person',
          localField: '_id.person',
          foreignField: '_id',
          as: 'person'
        }
      },
      { $unwind : '$person' },
    ])

    // console.log(JSON.stringify(tickets, null, 3))
    // const tickets = await Ticket
    //                       .find({ ride : rid._id, status : { $ne : 'DELETED' }})
    //                       .sort({ id : -1 })
    //                       .exec()

    if(tickets.length) {
      // console.log(tickets)
      const data = tickets// await Promise.all(tickets.map(getTicketData))
      // const data = await Promise.all(tickets.map(getTicketData))

      return ctx.body = { ok : true, data : { tickets : data }, message : '' }
    }

    return ctx.body = { ok : false, data : null, message : 'There are no ticket for this ride' }
  } catch (e) {
    console.log(e)
  }

  return ctx.body = { ok : false, data : null, message : 'Error retrieving the tickets for this ride' }
})

// ticketRouter.get('/all/by-address/:ride/', )
// //////////////////////////////////////

// Retrieve a ticket information
ticketRouter.get('/:id', async ctx => {
  const { id } = ctx.params

  try {
    const tckt = await Ticket.findOne({ id })

    if(tckt) {
      const ticketData = await getTicketData(tckt)

      if(ticketData) return ctx.body = { ok : true, data : { ticket : ticketData }, message : '' }
    }

    return ctx.body = { ok : false, data : null, message : 'Couldn\'t retrieve ticket. Either doesn\'t exist or we have a problem on the server' }
  } catch (e) {
    console.log(e)
  }

  return ctx.body = { ok : false, data : null, message : 'Error retrieving ticket' }
})

export default ticketRouter
