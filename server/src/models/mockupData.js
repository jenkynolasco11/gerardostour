import mongoose from 'mongoose'

import usr from './user'
import ride from './ride'
import tickt from './ticket'
import prsn from './person'

mongoose.Promise = global.Promise

export const Person = mongoose.model('person')
export const User = mongoose.model('user')
export const Ride = mongoose.model('ride')
export const Ticket = mongoose.model('ticket')

const genRand = (limit, x = 0) => Math.floor(Math.random() * limit) + x
const genRandDate = (start, end, startHour, endHour) => {
  const date = new Date(+start + Math.random() * (end - start))
  const hour = startHour + Math.random() * (endHour - startHour) | 0
  date.setHours(hour)
  return date
}

const limit = () => genRand(100, 1)
const ticketLimit = 100
const places = ['NY', 'PENN', 'BOSTON', 'NJ']
const firstNames = [ 'jenky', 'julian', 'richard', 'diane', 'masmfas', 'bastion', 'august', 'ceasar', 'carlos' ]
const lastNames = [ 'nolasco', 'matias', 'rodriguez', 'figueroa', 'masmfas', 'bastion', 'august', 'ceasar', 'carlos' ]
const ticktsStatus = [ 'USED', 'SOLD', 'NEW' ]
const positions = [ 'ADMIN', 'CHAUFFER', 'NONE']

const createPhoneNumber = () => {
  let num = ''
  for(let i = 0; i < 10; i++) num += genRand(10)

  return num
}

const createPerson = async (fn, ln ) => {
  // TODO : MOCK UP DATA IS NOT INSERTING MORE THAN 1 ENTRY!!!!!!

  try {
    const phone = createPhoneNumber()
    const person = await new Person({
      firstname : fn,
      lastname : ln,
      phoneNumber : phone,
    }).save()

    return person._id
  } catch (e) {
    console.log(e.toJSON().errmsg)
    return null
  }
}

const createUser = async (id, user, pass, pos) => {
  try {
    const usl = new User({
      personid : id,
      username : user,
      position : user === 'jenky' ? 'ADMIN' : pos,
    })

    usl.password = usl.generateHash(pass)

    await usl.save()
  } catch (e) {
    console.log('error while saving [User] mockup data...', e, ' (models/mockupData.js)')
  }
}

const createRide = async (frm, to, dept, tickts, assignd) => {
  try {
    const ride = await new Ride({
      from : frm,
      to,
      departing : dept,
      ticketCount : tickts,
      assignedTo : assignd,
    }).save()
  } catch (e) {
    // console.log('error while saving [Ride] mockup data...', e, ' (models/mockupData.js)')
  }
}

const createTicket = async (id, rid, lug, pick, leave, sts) => {
  try {
    const ticket = await new Ticket({
      user : id,
      ride : rid,
      status : sts,
      luggage : lug,
      pickAtDoor : pick,
      leaveAtDoor : leave,
    }).save()

  } catch (e) {
    console.log('error while saving [Ticket] mockup data...', e, ' (models/mockupData.js)')
  }
}

const createAdmins = async () => {
  const ext = limit()
  for(let i = 0; i < ext; i++) setTimeout(async () => {
    const rnd1 = genRand(firstNames.length)
    const rnd2 = genRand(lastNames.length)
    const rnd3 = genRand(positions.length)
    const user = firstNames[ rnd1 ]
    const last = lastNames[ rnd2 ]
    const pos = positions[ rnd3 ]

    const id = await createPerson( user, last)
    // console.log(id)
    if(id) createUser(id, user, 'lllll', pos )
  }, 100)

  // Forcing my user
  try {
    const id = await createPerson('jenky', 'nolasco')
    if(id) createUser(id, 'jenky', 'lllll', 'ADMIN')
  } catch(e) {
    //
  }
}

const createRides = () => {
  const ext = limit()
  for(let i = 0; i < ext; i++) setTimeout(() => {
    const frm = places[ genRand(places.length) ]
    const to = places[ genRand(places.length) ]
    const dept = genRandDate(new Date(2017,11,1),new Date(), 0, 23) 
    createRide( frm, to, dept, genRand(30), firstNames[ genRand(firstNames.length) ] )
  }, 100)
}

const createTickets = () => {
  for(let i = 0; i < ticketLimit; i++) setTimeout( async () => {
    const fn = firstNames[ genRand(firstNames.length) ]
    try {
      // console.log(fn)
      const pcont = await Person.count({ })
      const rcont = await Ride.count({})
      const skip1 = genRand(pcont)
      const skip2 = genRand(rcont)

      const ps = await Person.findOne({}).skip(skip1).exec()
      const rd = await Ride.findOne({}).skip(skip2).exec()

      const luggage = genRand(5)
      const pickAtDoor = !genRand(2)
      const leaveAtDoor = !genRand(2)
      const status = ticktsStatus[ genRand(ticktsStatus.length) ]

      createTicket(ps._id, rd._id, luggage, pickAtDoor, leaveAtDoor, status)
    } catch (e) {
      console.log('error while retrieving [Person] in [Ticket] for mockup data...', e, ' (models/mockupData.js)')
    }
  }, 100)
}

(async () => {
  try {
    const a = await Person.remove({})//, () => {})
    const b = await User.remove({})//, () => {})
    const c = await Ride.remove({})//, () => {})
    const d = await Ticket.remove({})//, () => {})

    await Person.collection.dropIndexes()
    await User.collection.dropIndexes()
    await Ride.collection.dropIndexes()
    await Ticket.collection.dropIndexes()

    // console.log(a,b,c,d)
    createAdmins()
    createRides()
    createTickets()
  } catch (e) {
    console.log(e, 'Something happened while erasing the data (models/mockupData.js)...') 
  }
})()