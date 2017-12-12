import { Ticket, Payment, TicketDetail, Person, Meta, Address /*,Bus*/ } from '../../../models'
import { createPerson, createAddress, filterDoc } from '../../../utils'

// ///////////////// Helper functions
export const getTicketData = async tckt => {
  try {
    // const ride = await (tckt.ride ? Ride.findById(tckt.ride) : 'none')
    const person = await Person.findById(tckt.person)
    const details = await TicketDetail.findById(tckt.details)
    const pick = await (tckt.willPick ? Address.findById(details.pickUpAddress) : 'none')
    const drop = await (tckt.willDrop ? Address.findById(details.dropOffAddress) : 'none')

    // console.log(pick)
    // console.log(drop)

    const pickAdd = pick !== 'none' && pick ? { ...pick.toObject() } : pick
    const dropAdd = drop !== 'none' && drop ? { ...drop.toObject() } : drop

    // console.log(pickAdd)
    // console.log(dropAdd)
    // console.log('----------------------------')

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
    // console.log(e)
  }

  return null
}

// Middleware for webhook data
export const reformatTicket = (ctx, next) => {
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
export const saveTicket = async ({ id, data, person, pickUp, dropOff }) => {
  // console.log(data)
  const {
    frm,
    to,
    luggage,
    willPick,
    willDrop,
    status = 'NEW',

    // TICKET DETAILS
    fee,
    extraFee,
    departureDate,
    departureTime,

    // PAYMENT DETAILS
    cardBrand,
    cardLastDigits,
    totalAmount,
    paymentType
  } = data

  let payment = null
  let details = null
  let tckt = null
// console.log(data)

  try {
    payment = await new Payment({
      cardBrand,
      cardLastDigits,
      totalAmount,
      type : paymentType
    }).save()

    details = await new TicketDetail({ 
      pickUpAddress : pickUp,
      dropOffAddress : dropOff,
      redeemedCount : 0,
      fee,
      extraFee,
      date : departureDate,
      time : departureTime,
    }).save()

    // TODO: Make sure that the data inserted is sanitized, or it'll break!!!
    tckt = await new Ticket({
      id,
      person,
      details : details._id,
      payment : payment._id,
      status,
      luggage,
      willPick,
      willDrop,
      from : frm,
      to
    }).save()

    return tckt._id
  } catch(e) {
    [ 
      { obj : tckt, coll : Ticket },
      { obj : payment, coll : Payment },
      { obj : details, coll : TicketDetail },
    ].forEach( item => {
      if(item.obj) item.coll.remove({ _id : item.obj._id })
    })
    console.log(e)
    return null
  }
}

// Create Tickets
export const saveTickets = async data => {
  const { howMany } = data

  const promises = []

  try {
    const meta = await Meta.findOne({})

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
        id : meta.lastTicketId + i + 1,
        data,
        pickUp,
        person,
        dropOff
      }))
    
    // const data = await Promise.all(promises)
    const tickets = await Promise.all(promises)

    meta.lastTicketId += tickets.length
    await meta.save()

    return tickets
  } catch (e) {
    console.log(e)
    return null
  }
}
//////////////////////////////////////