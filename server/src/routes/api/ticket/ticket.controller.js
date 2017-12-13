import { Ticket, Receipt, TicketDetail, Person, Meta, Address /*,Bus*/ } from '../../../models'
import { filterDoc, createTicketSideData } from '../../../utils'

// ///////////////// Helper functions
const eraseData = async objects => {
  const { person, ticket, ticketDetail, receipt, pickUp, dropOff } = objects
  try {
    if(ticketDetail) await TicketDetail.findByIdAndRemove(ticketDetail._id)
    if(receipt) await Receipt.findByIdAndRemove(receipt._id)
    if(dropOff) await Address.findByIdAndRemove(dropOff._id)
    if(person) await Person.findByIdAndRemove(person._id)
    if(ticket) await Ticket.findByIdAndRemove(ticket._id)
    if(pickUp) await Address.findByIdAndRemove(pickUp._id)
  } catch (e) {
  }
}
// Middleware for webhook data
export const reformatTicket = (ctx, next) => {
  const { body } = ctx.request
  // console.log(body)

  // If its local, return. No need to reformat data structure
  if(body._isLocal) return next()

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

export const getTicketData = async tckt => {
  try {
    const person = await Person.findById(tckt.person)
    const details = await TicketDetail.findById(tckt.details)
    const pick = await (tckt.willPick ? Address.findById(details.pickUpAddress) : '')
    const drop = await (tckt.willDrop ? Address.findById(details.dropOffAddress) : '')

    const pickAdd = pick && pick ? { ...pick.toObject() } : 'none'
    const dropAdd = drop && drop ? { ...drop.toObject() } : 'none'

    const data = {
      id : tckt.id,
      _id : tckt._id,
      willDrop : tckt.willDrop,
      willPick : tckt.willPick,
      luggage : tckt.luggage,
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

    return data//.filter(Boolean)
  } catch (e) {
    console.log(e)
    console.log('... @ src/routes/api/ticket/ticket.controller.js')
  }

  return null
}

// Ticket details
export const saveTicket = async body => {
  const { id, data, person, pickUp, dropOff, receipt } = body
  const {
    frm,
    to,
    willPick,
    willDrop,
    status = 'NEW',
    departureDate,
    departureTime,
  } = data

  let details = null
  let tckt = null

  try {
    const date = new Date(new Date(departureDate).setHours(0,0,0,0))
    const time = Number(departureTime)

    details = await new TicketDetail({
      pickUpAddress : pickUp,
      dropOffAddress : dropOff,
      redeemedCount : 0,
    }).save()

    // TODO: Make sure that the data inserted is sanitized, or it'll break!!!
    tckt = await new Ticket({
      id,
      person,
      details : details._id,
      receipt,
      status,
      willPick,
      willDrop,
      from : frm,
      to,
      date,
      time,
    }).save()

    if(!details || !tckt) throw new Error('Error while inserting data on tickets!')

    return tckt.id
  } catch(e) {
    // Oh snap! Some shit happened... rolling back.... again...
    await eraseData({ ticketDetails : details, ticket : tckt })
    
    console.log(e)
    console.log('... @ src/routes/api/ticket/ticket.controller.js')
  }

  // Tempted to throw an error in here to roll back everything!
  return null
}

// Create Tickets
export const saveTickets = async data => {
  const { howMany } = data

  const promises = []
  let meta = null
  let person = null
  let pickUp = null
  let dropOff = null
  let receipt = null

  try {
    meta = await Meta.findOne({})

    const [ prsn, pckup, drpff, rcpt ] = await createTicketSideData({
      ...data,
      ...filterDoc(meta.toObject())
    })

    person = prsn
    pickUp = pckup
    dropOff = drpff
    receipt = rcpt

    const willDrop = data.willDrop === 'true'
    const willPick = data.willPick === 'true'

    if(!person || (willDrop && !dropOff) || (willPick && !pickUp) || !receipt)
      throw new Error('Shit happened... Rolling back everything!')

    const lastTicket = meta.lastTicketId

    for(let i = 0; i < howMany; i++)
      promises.push(saveTicket({
        id : lastTicket + i,
        data,
        receipt : receipt._id,
        person,
        pickUp,
        dropOff
      }))

    const tickets = await Promise.all(promises)

    // update meta
    meta.lastTicketId += Number(howMany)
    meta.lastReceiptId += 1
    await meta.save()

    // return either tickets or receipt number
    return tickets
  } catch (e) {
    // Some shit happened... Roll back everything!!!
    eraseData({ person, pickUp, dropOff, receipt })

    console.log(e)
    console.log('... @ src/routes/api/ticket/ticket.controller.js')
  }

  // This means that something happened
  return null
}

export const getTicketReceipt = async id => {
  try {
    const tckt = await Ticket.findOne({ id })

    const ticketsIssued = (await Ticket.find({ receipt : tckt.receipt }, { id : 1, _id : 0 }))
                                        .map(i => i.id)
                                        .sort((a,b) => a - b)

    if(tckt) {
      const receipt = await Receipt.findById(tckt.receipt)
      const { cardLastDigits, cardBrand, totalAmount, paymentType, fee, extraFee, luggage } = receipt

      const data = { fee, extraFee, totalAmount, paymentType, ticketsIssued, luggage }

      if(paymentType === 'CARD') {
        data.cardBrand = cardBrand
        data.cardLastDigits = cardLastDigits
      }

      return data
    }
  } catch (e) {
    console.log(e)
  }

  return null
}

// ////////////////////////////////////
