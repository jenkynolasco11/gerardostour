import mongoose from 'mongoose'
import config from '../config'

mongoose.connect(config.DBURI, { useMongoClient : true }, async () => {
  console.log('Connected to the DB')
/*
  // mongoose.set('debug', true)

  // ///////////////////////////////////////////////////////
  // WARNING!!! THIS DELETES ALL COLLECTIONS!!!!
  // ///////////////////////////////////////////////////////
  // Object.keys(mongoose.connection.collections).forEach(async coll => {
  //   const collection = mongoose.connection.collection[ coll ]

  //   await collection.dropIndexes()
  //   await collection.remove({})
  //   await collection.drop()
  // })
  // console.log('\n\n')
  // console.log('All collections deleted!~')
  // console.log('\n\n')

  // console.log(Object.keys(mongoose.connection.collections))
  ///////////////////////////////////////////////////////////
*/
  require('./user')
  require('./ride')
  require('./ticket')
  require('./person')
  require('./address')
  require('./bus')
  require('./receipt')
  require('./meta')

  const addresses = require('./mockupData-streets').default
  const users = require('./mockupData-users').default

  mongoose.Promise = global.Promise

  const Person = mongoose.model('person')
  const User = mongoose.model('user')
  const Ride = mongoose.model('ride')
  const Ticket = mongoose.model('ticket')
  const TicketDetail = mongoose.model('ticketDetail')
  const Address = mongoose.model('address')
  const Bus = mongoose.model('bus')
  const BusDetail = mongoose.model('busDetail')
  const Payment = mongoose.model('receipt')
  const RideDetail = mongoose.model('rideDetail')
  const Meta = mongoose.model('meta')

  const genRand = (limit, x = 0) => Math.floor(Math.random() * limit) + x
  const genRandDate = (start, end) => {
    const date = new Date(+start + Math.random() * (end - start))
    // const hour = startHour + Math.random() * (endHour - startHour) | 0
    // date.setHours(hour)
    date.setHours(0,0,0,0)
    // console.log(date)
    return date.toISOString()
  }

  const limit = (lim = 100) => genRand(lim, 1)
  const getAnyDate = () => {
    const a = genRandDate(new Date(), new Date('2020-10-10'))
    // console.log(a.toDateString())
    return new Date(a)
  }

  const ticketLimit = genRand(1000, 600)
  const peopleLimit = genRand(500, 300)
  const addressLimit = genRand(40,30)
  const rideLimit = genRand(200, 150)
  let driversLimit = 4

  const ticktsStatus = [ 'USED', 'REDEEMED', 'NULL', 'NEW', 'DELETED' ]
  const positions = [ 'DRIVER', 'MANAGER', 'DISPATCHER' ]
  const busStatus = [ 'STANDBY', 'OK', 'DAMAGED', 'RETIRED' ]
  const busNames = [ 'Blanquita', 'Rocio', 'Maria la del Barrio', 'Calle 14', 'Vasito Verde', 'La Negra' ]
  const cardAffiliates = [ 'VISA', 'MASTERCARD', 'AMERICAN EXPRESS', 'DISCOVERY' ]
  const payType = [ 'CASH', 'CARD' ]
  const routes = [ 'NY', 'PA' ]
  const rideStatus = [ 'FINISHED', 'PENDING', 'ASSIGNED', 'ON-THE-WAY', 'CANCELLED' ]

  const usersLimit = 50
  const addLen = addresses.length

  // const createPhoneNumber = () => {
  //   let num = ''
  //   for(let i = 0; i < 10; i++) num += genRand(10)

  //   return num
  // }
  // let meta = await Meta.findOne({ })

  // if(!meta) meta = await new Meta({}).save()

  const getRandCard = () => cardAffiliates[ genRand(cardAffiliates.length) ]
  // const getRandAddress = () => addresses[ genRand(addresses.length) ]

// ///////////////////////////////////////

  const createPerson = async (fn, ln, email, num ) => {
    try {
      const phone = num.replace(/\D/g, '')
      
      const person = await new Person({
        firstname : fn,
        lastname : ln,
        phoneNumber : phone,
        email,
      }).save()
  
      return person._id
    } catch (e) {
      // console.log('shit happened at Person')
      // console.log(e)
      // throw new Error(`Person =====> ${ JSON.stringify(e) }`)
    }
    return null
  }

  const createUser = async (id, user, pass, pos) => {
    try {
      const usl = new User({
        person : id,
        username : user,
        position : pos
      })
  
      usl.password = usl.generateHash(pass)
  
      return await usl.save()
    } catch (e) {
      // console.log('\n')
      // console.log(e)
      // console.log(id, user, pass, pos)
      // console.log('\n')
      // console.log('shit happened at User')
      // console.log(e)
      // process.exit()
      // return new Error(`User =====> ${ JSON.stringify(e) }`)
    }

    return null
  }

  const createBus = async data => {
    const { id, user, name, status, seats, luggage } = data

    try {
      const bus = await new Bus({
        id,
        user,
        name,
        status,
        alias : name
      }).save()

      const busDetail = await new BusDetail({
        bus : bus._id,
        seats,
        luggage,
      }).save()

      // meta.lastBusId += 1
      // console.log(bus._id)
      return bus._id
    } catch (e) {
      console.log('shit happened at Bus')
      // throw new Error(`Bus =====> ${ JSON.stringify(e) }`)
    }

    return null
  }

  const createAddress = async (state, city, street, zipcode) => {
    try {
      const address = await new Address({
        state,
        city,
        street,
        zipcode,
      }).save()
  
      return address._id
    } catch (e) {
      console.log('shit happened at Route')
      // throw new Error(`Route =====> ${ JSON.stringify(e) }`)
    }

    return null
  }

  const createRide = async data => {
    const { id, bus, to, frm, status, time, date, seatsOccupied, luggage } = data
    try {
      const willBus = genRand(2)
      const ride = await new Ride({
        id,
        bus : willBus ? bus : null,
        routeTo : to,
        routeFrom : frm,
        time,
        date,
        status : willBus ? status ? status : 'PENDING' : 'PENDING'
      }).save()

      const details = await new RideDetail({
        ride : ride._id,
        seatsOccupied,
        luggage
      }).save()

      // console.log(ride.time)
      // meta.lastRideId += 1

      return ride._id
    } catch (e) {
      console.log('shit happened at Ride')
      throw new Error(`Ride =====> ${ JSON.stringify(e) }`)
    }
  }

  const createReceipt = async data => {
    const { id, type, amnt, fee, extraFee, cardBrand, cardLastDigits, luggage, ticketCount } = data
    try {
      const receipt = await new Payment({
        id,
        fee,
        extraFee,
        paymentType : type,
        totalAmount : amnt,
        cardBrand,
        cardLastDigits,
        luggage,
        ticketCount,
      }).save()

      // meta.lastReceiptId += 1

      return receipt._id
    } catch (e) {
      console.log(e)
      process.exit()
    }

    return null
  }

  const createTicket = async ticketData => {
    const {
      id,
      to,
      frm,
      person,
      ride,
      receipt,
      // details,
      status,
      // luggage,
      // leave /**/,
      pick,
      drop,
      date,
      time,
      // fee,
      // extraFee
    } = ticketData

    // console.log(ride)

    try {
      const details = await new TicketDetail({
        pickUpAddress : pick,
        dropOffAddress : drop,
        redeemedCount : 0,
        // fee,
        // extraFee
      }).save()

      const ticket = await new Ticket({
        id,
        person,
        date,
        time,
        ride : ride ? ride : null,
        receipt,
        details : details._id,
        status,
        // luggage,
        willPick : Boolean(pick),
        willDrop : Boolean(drop),
        from : frm,
        to,
      }).save()

      // meta.lastTicketId += 1

      return ticket._id
    } catch (e) {
      console.log(e)
      // process.exit()
      throw new Error(`Ticket =====> ${ JSON.stringify(e) }`)
    }
  }

  // //////////////////////////

  const createSuperUser = async () => {
    try {
      const id = await createPerson('jenky', 'nolasco', 'j.nolasco@email.io', '1234567890')
  
      return await createUser(id, 'jenky', 'lllll', 'SUPERUSER')
    } catch (e) {
      throw new Error(`SuperUser =====> ${ JSON.stringify(e) }`)
    }
  }

  const createPeople = async () => {
    console.log(`There are going to be ${ peopleLimit } people!`)

    const promises = []
    try {
      for(let i = 0; i < peopleLimit; i++) {
        // const rnd1 = genRand(firstNames.length)
        // const rnd2 = genRand(lastNames.length)
        const user = users[ genRand(users.length) ]

        const {
          firstname,
          lastname,
          email,
          phoneNumber
        } = user


        promises.push(createPerson(firstname, lastname, email, phoneNumber))
      }

      await Promise.all(promises)

      console.log('People created!!')
    } catch(e) {
      throw new Error(`Create People =====> ${ JSON.stringify(e) }`)
    }
  }

  const createUsers = async () => {
    const promises = []

    try {
      for(let i = 0; i < usersLimit; i++) {
        const rnd = genRand(positions.length)

        promises.push(Person
          .aggregate([{ $sample : { size : 1 }} /*, projection*/ ])
          .then(([ person ]) => {
            driversLimit -= 1

            const pos = positions[ rnd ]
            const isDriver = driversLimit > 0

            // console.log(`${ person.firstname } is ${ isDriver ? '' : 'not' } driver`)
            // console.log(driversLimit)

            return createUser(
                person._id,
                person.firstname,
                'lllll',
                isDriver ? 'DRIVER' : pos
              )
            }
          )
        )
      }

      const aggregate = await Promise.all(promises)

      await Promise.all(aggregate)

      console.log('Users created!!')

    } catch (e) {
      throw new Error(`Create User =====> ${ JSON.stringify(e) }`)
    }
  }

  const createAddresses = async () => {
    console.log(`There are going to be ${ addressLimit } addresses!`)
    const promises = []

    try {
      for(let i = 0; i < addressLimit; i++) {
        const { street, city, state, zipcode } = addresses[ genRand(addLen) ]

        promises.push(createAddress(state, city, street, zipcode))
      }

      await Promise.all(promises)

      console.log('Routes created!!')
    } catch (e) {
      throw new Error(`Create Routes =====> ${ JSON.stringify(e) }`)
    }
  }

  const createRides = async () => {
    console.log(`There are going to be ${ rideLimit } rides!`)

    const promises = []
    try {
      for(let i = 0; i < rideLimit; i++) {
        const to = routes[ genRand(routes.length) ]
        const frm = routes[ genRand(routes.length) ]
        const status = rideStatus[ genRand(rideStatus.length) ]
        const time = genRand(24)
        const seats = genRand(40)
        const luggage = genRand(50)
        const date = getAnyDate()

        promises.push(Bus
          .aggregate([{ $sample : { size : 1 }}])
          .then(([ bus ]) => createRide({
              id : i + 1,
              bus : bus._id,
              to,
              frm,
              status,
              time,
              date,
              seatsOccupied : seats,
              luggage
            }))
          )
      }

      const aggregate = await Promise.all(promises)

      await Promise.all(aggregate)

      // meta.lastRideId = rideLimit + 1

      console.log('Rides created!!!')
      // await meta.save()

      return rideLimit
    } catch (e) {
      console.log(e)
      // process.exit()
    }

    return null
  }

  const createBusses = async () => {
    const promises = []
    try {
      const drivers = await User.find({ position : 'DRIVER' })

      const bussesCount = busNames.length

      for(let i = 0; i < bussesCount; i++) {
        const status = busStatus[ genRand([ busStatus.length ]) ]
        const name = busNames[ i ]
        const seats = genRand(30,20)
        const luggage = genRand(50,30)

        promises.push(createBus({ id : i + 1, user : (drivers[ i ] ? drivers[ i ]._id : null), name, status, seats, luggage }))
      }

      await Promise.all(promises)

      console.log('Busses created!!')

      return bussesCount
    } catch (e) {
      console.log(e)
      // process.exit()
    }

    return null
  }

  const createTickets = async () => {
    console.log(`There are going to be ${ ticketLimit } tickets!`)
    const projection = { $project : { _id : 1 }}
    const promises = []

    try {
      for(let i = 0; i < ticketLimit; i++)
        promises.push(
          Person
            .aggregate([{ $sample : { size : 1 }}, projection ])
            .then(([ person ]) =>
              Promise.all([
                person,
                Ride.aggregate([{ $sample : { size : 1 }}, projection ])
              ])
            )
            .then(([ person, rid /*, addProm*/ ]) => {
              // const [ address ] = addProm
              const [ ride ] = rid
              const type = payType[ genRand(payType.length) ]
              
              const isCard = type === 'CARD'
              const cardBrand
                = isCard
                ? getRandCard()
                : ''
              const cardLastDigits
                = isCard
                ? `${ genRand(10000, 0) }`
                : ''

              const fee = genRand(100,20)
              const extraFee = genRand(40,10)
              const totalAmount = fee + extraFee
              const luggage = genRand(5)

              const receipt = createReceipt({
                id : i + 1,
                type,
                amnt : totalAmount,
                fee,
                extraFee,
                cardBrand,
                cardLastDigits,
                luggage,
                ticketCount : 1,
              })

              return Promise.all([ person, ride/*, address*/, receipt ])
            })
            .then(async ([ person, ride/*, address*/, receipt ]) => {
              // const [ fee, extraFee ] = payDetails

              const date = getAnyDate()
              const time = genRand(24, 0)

              const status = ticktsStatus[ genRand(ticktsStatus.length) ]

              const assignedRide = genRand(2)
              const willPick = genRand(2)
              const willDrop = genRand(2)

              // If more routes, change this logic...
              const toState = routes[ Number(!assignedRide) ]
              const frmState = routes[ Number(assignedRide) ]

              const pick = await (
                          willPick
                          ? Address.aggregate([{ $sample : { size : 1 }}, projection ])
                          : null
                        )
              const drop = await (
                          willDrop
                          ? Address.aggregate([{ $sample : { size : 1 }}, projection ])
                          : null
                        )

              // console.log(time, date)

              const ticket = await createTicket({
                id : i + 1,
                to : assignedRide ? ride.routeTo : toState,
                frm : assignedRide ? ride.routeFrom : frmState,
                ride : assignedRide ? ride._id : null,
                person : person._id,
                receipt,
                status,
                // luggage,
                pick : willPick ? pick[ 0 ] : null,
                drop : willDrop ? drop[ 0 ] : null,
                date,
                time,
              })

              return ticket
            })
        )

      const p = await Promise.all(promises)
      const r = await Promise.all(p)
      const a = await Promise.all(r)
      const py = await Promise.all(a)

      // // console.log(py)
      // const meta = await new Meta({ lastTicketId : py.length }).save()
      
      // meta.lastTicketId = ticketLimit + 1
      // meta.lastReceiptId = ticketLimit + 1

      console.log('Tickets created!!')
      // await meta.save()

      return ticketLimit
    } catch (e) {
      console.log(e)
      console.log('shit happened')
      throw new Error(`Ticket =====> ${ JSON.stringify(e) }`)
      // */
    }
  }

  // /////////////////////////////////////////////////
  //        DANGER ZONE!!!!!
  // ////////////////////////////////////////////////
  const eraseContent = async () => {
    try{
      const a = await Person.remove({})//, () => {})
      const b = await User.remove({})//, () => {})
      const c = await Ride.remove({})//, () => {})
      const d = await RideDetail.remove({})
      const e = await Ticket.remove({})//, () => {})
      const f = await TicketDetail.remove({})
      const g = await Payment.remove({})
      const h = await Address.remove({})
      const i = await Bus.remove({})
      const j = await BusDetail.remove({})
      const k = await Meta.remove({})

      // await Person.collection.dropIndexes()
      // await User.collection.dropIndexes()
      // await Ride.collection.dropIndexes()
      // await Ticket.collection.dropIndexes()
      // await TicketDetail.collection.dropIndexes()
      // await Payment.collection.dropIndexes()
      // await Route.collection.dropIndexes()
      // await Bus.collection.dropIndexes()
      // process.exit()

    } catch(e) {
      console.log(e)
      console.log('something happened....')
      
    }
  }
  // /////////////////////////////////////////////////

  (async () => {
    try {
      // console.log(meta)
      await eraseContent()
      await createSuperUser()
      await createPeople()
      await createUsers()
      await createAddresses()
      const bs = await createBusses()
      const rd = await createRides()
      const tkt = await createTickets()

      await new Meta({
        lastReceiptId : (tkt + 1) || 1,
        lastTicketId : (tkt + 1) || 1,
        lastRideId : (rd + 1) || 1,
        lastBusId : (bs + 1) || 1,
      }).save()
      
      await mongoose.connection.close()

      console.log('')
      console.log('')
      console.log('Process done!')
      console.log('')
    } catch (e) {
      console.log(e, 'Something happened on data (models/mockupData.js)...') 
      process.exit()
    }
  })()
})