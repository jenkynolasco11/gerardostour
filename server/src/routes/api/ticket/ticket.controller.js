import { Ticket, Receipt, TicketDetail, Person, Meta, Address, Package } from '../../../models'
import { filterDoc, createTicketSideData } from '../../../utils'

// ///////////////// Helper functions
const eraseData = async objects => {
  const { person, ticket, ticketDetail, receipt, pickUp, dropOff, pack } = objects
  try {
    if(ticketDetail) await TicketDetail.findByIdAndRemove(ticketDetail._id)
    if(receipt) await Receipt.findByIdAndRemove(receipt._id)
    if(dropOff) await Address.findByIdAndRemove(dropOff._id)
    if(person) await Person.findByIdAndRemove(person._id)
    if(ticket) await Ticket.findByIdAndRemove(ticket._id)
    if(pickUp) await Address.findByIdAndRemove(pickUp._id)
    if(pack) await Package.findByIdAndRemove(pack._id)
  } catch (e) { }
}

// Middleware for webhook data
export const reformatTicket = (ctx, next) => {
  const { body } = ctx.request

  // If its local, return. No need to reformat data structure
  if(body.isLocal) return next()
  
  /*
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
    isLocal : false,
  }

  ctx.request.body = newBody
  */
  return next()
}

export const getTicketData = async tckt => {
  try {
    const person = await Person.findById(tckt.person)
    const pack = await Package.findById(tckt.package)
    const rcpt = await Receipt.findById(tckt.receipt)
    const details = await TicketDetail.findById(tckt.details)
    
    const pick = await (tckt.willPick ? Address.findById(details.pickUpAddress) : '')
    const drop = await (tckt.willDrop ? Address.findById(details.dropOffAddress) : '')

    const pickAdd = pick ? filterDoc(pick._doc) : 'none'
    const dropAdd = drop ? filterDoc(drop._doc) : 'none'
    const pkg = tckt.isPackage ? filterDoc(pack._doc) : null

    console.log('-------------------------------')
    console.log(pickAdd)
    console.log(dropAdd)
    // console.log(pkg)

    const data = {
      id : tckt.id,
      // _id : tckt._id,
      willDrop : tckt.willDrop,
      willPick : tckt.willPick,
      // luggageQty : rcpt.luggageQty,
      status : tckt.status,
      from : tckt.from,
      to : tckt.to,
      pickUpAddress : pickAdd,
      dropOffAddress : dropAdd,
      time : tckt.time,
      date : tckt.date,
      person : {
        firstname : person.firstname,
        lastname : person.lastname,
        email : person.email,
        phoneNumber : person.phoneNumber
      },
      isPackage : tckt.isPackage,
      package : pkg

    }

    // console.log(data)

    return data //.filter(Boolean)
  } catch (e) {
    console.log(e)
    console.log('... @ src/routes/api/ticket/ticket.controller.js')
  }

  return null
}

// Ticket details
export const saveTicket = async body => {
  const {
    id,
    data,
    person,
    pickUpAddress,
    dropOffAddress,
    receipt,
    packId,
  } = body

  const {
    frm,
    to,
    willPick,
    willDrop,
    status = 'NEW',
    date,
    time,
    isPackage = false,
    packageInfo = null
  } = data

  let details = null
  let tckt = null
  let pck = null

  try {
    const ddate = new Date(new Date(date).setHours(0,0,0,0))
    const ttime = Number(time)

    if(isPackage) pck = await new Package({ ...packageInfo }).save()

    details = await new TicketDetail({ 
      ...data,
      pickUpAddress,
      dropOffAddress,
      redeemedCount : 0
    }).save()

    // TODO: Make sure that the data inserted is sanitized, or it'll break!!!
    tckt = await new Ticket({
      id,
      person,
      details : details._id,
      receipt,
      package : isPackage ? pck._id : null,
      status,
      willPick,
      willDrop,
      frm,
      to,
      date : ddate,
      time : ttime,
      isPackage
    }).save()

    if(!details || !tckt) throw new Error('Error while inserting data on tickets!')

    return tckt.id
  } catch(e) {
    // Oh snap! Some shit happened... rolling back.... again...
    await eraseData({ ticketDetails : details, ticket : tckt, pack : pck })

    console.log(e)
    console.log('... @ src/routes/api/ticket/ticket.controller.js')
  }

  // Tempted to throw an error in here to roll back everything!
  return null
}

// Create Tickets
export const saveTickets = async data => {
  const promises = []
  let meta = null
  let person = null
  let pickUpAddress = null
  let dropOffAddress = null
  let receipt = null

  try {
    meta = await Meta.findOne({})

    const [ prsn, pckup, drpff, rcpt ] = await createTicketSideData({
      ...data,
      id : meta.lastReceiptId++
    })

    person = prsn
    pickUpAddress = pckup
    dropOffAddress = drpff
    receipt = rcpt

    const { willPick, willDrop, isPackage, ticketQty } = data

    if(!person
      || (willDrop && !dropOffAddress) 
      || (willPick && !pickUpAddress) 
      || !receipt)
      throw new Error('Shit happened... Rolling back everything!')

    for(let i = 0; i < ticketQty; i++) {
      promises.push(saveTicket({
        id : meta.lastTicketId++,
        // packId : isPackage ? meta.lastPackageId
        data,
        receipt,
        person,
        pickUpAddress,
        dropOffAddress,
      }))
    }

    const tickets = await Promise.all(promises)
    
    await meta.save()

    // return either tickets or receipt number
    return tickets
  } catch (e) {
    // Some shit happened... Roll back everything!!!
    eraseData({ person, pickUpAddress, dropOffAddress, receipt })

    console.log(e)
    console.log('... @ src/routes/api/ticket/ticket.controller.js')
  }

  // This means that something happened
  return null
}

export const updateTicket = async (id, data) => {
  try {
    const tckt = await Ticket.findOneAndUpdate({ id }, data, { new : true })

    if(tckt) {
      const details = await TicketDetail.findByIdAndUpdate(tckt.details, data, { new : true })

      if(details) return Number(id)
    }
  } catch (e) {
    console.log(e)
  }

  return null
}

export const getTicketReceipt = async id => {
  try {
    const tckt = await Ticket.findOne({ id })

    const tickets = (await Ticket.find({ receipt : tckt.receipt }, { id : 1, _id : 0 }))
                                        .map(i => i.id)
                                        .sort((a,b) => a - b)

    if(tckt) {
      const receipt = await Receipt.findById(tckt.receipt)
      const { cardLastDigits, cardBrand, totalAmount, paymentType, luggageQty, packageQty, ticketQty } = receipt

      const data = { totalAmount, paymentType, tickets, luggageQty, packageQty, ticketQty }

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
