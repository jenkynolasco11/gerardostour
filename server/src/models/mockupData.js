import mongoose from 'mongoose'
import config from '../../config'

mongoose.connect(config.DBURI, { useMongoClient : true }, async () => {
  console.log('Connected to the DB')

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

  require('./user')
  require('./ride')
  require('./ticket')
  require('./person')
  require('./address')
  require('./bus')
  require('./financial')

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
  const Payment = mongoose.model('payment')
  const RideDetail = mongoose.model('rideDetail')
  
  const genRand = (limit, x = 0) => Math.floor(Math.random() * limit) + x
  const genRandDate = (start, end, startHour, endHour) => {
    const date = new Date(+start + Math.random() * (end - start))
    const hour = startHour + Math.random() * (endHour - startHour) | 0
    date.setHours(hour)
    return date
  }
  
  const limit = (lim = 100) => genRand(lim, 1)
  const ticketLimit = genRand(300,200)
  // const firstNames = [ 'jenky', 'julian', 'richard', 'diane', 'masmfas', 'bastion', 'august', 'ceasar', 'carlos' ]
  // const lastNames = [ 'nolasco', 'matias', 'rodriguez', 'figueroa', 'masmfas', 'bastion', 'august', 'ceasar', 'carlos' ]
  const ticktsStatus = [ 'USED', 'REDEEMABLE', 'NULL', 'NEW' ]
  const positions = [ 'DRIVER', 'MANAGER', 'DISPATCHER' ]
  const busStatus = [ 'STANDBY', 'OK', 'DAMAGED' ]
  const busNames = [ 'Blanquita', 'Rocio', 'Maria la del Barrio', 'Calle 14', 'Vasito Verde', 'La Negra' ]
  const cardAffiliates = [ 'VISA', 'MASTERCARD', 'AMERICAN EXPRESS', 'DISCOVERY' ]
  const payType = [ 'CASH', 'CARD' ]
  const routes = [ 'NY', 'PA' ]

  const usersLimit = 50
  const addLen = addresses.length

  // const createPhoneNumber = () => {
  //   let num = ''
  //   for(let i = 0; i < 10; i++) num += genRand(10)
  
  //   return num
  // }

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
      console.log('shit happened at Person')
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
      console.log('shit happened at User')
      // console.log(e)
      // process.exit()
      // return new Error(`User =====> ${ JSON.stringify(e) }`)
    }
    return null
  }

  const createBus = async (user, name, status, seats, luggage) => {
    try {
      const bus = await new Bus({
        user,
        name,
        status,
        seats,
        luggage,
        alias : name
      }).save()

      const busDetail = await new BusDetail({
        bus : bus._id
      }).save()
  
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

  const createRide = async (bus, to, frm) => {
    try {
      const ride = await new Ride({
        bus,
        routeTo : to,
        routeFrom : frm,
        // time,
        // date
      }).save()

      return ride._id
    } catch (e) {
      console.log('shit happened at Ride')
      throw new Error(`Ride =====> ${ JSON.stringify(e) }`)
    }
  }

  const createPayment = async (type, amnt, affiliate, digits) => {
    try {
      const paymnt = await new Payment({
        type,
        totalAmount : amnt,
        cardBrand : affiliate,
        cardLastDigits : digits
      }).save()
  
      return paymnt._id
    } catch (e) {
      console.log(e)
      process.exit()
      // console.log('shit happened at Payment')
      // throw new Error(`Payment =====> ${ JSON.stringify(e) }`)
    }

    return null
  }

  const createTicketDetail = async (pick, drop, date, time, fee, extraFee ) => {
    try {
      const tcktDtl = await new TicketDetail({
        pickUpPlace : pick,
        dropOffPlace : drop,
        redeemedCount : 0,
        date,
        time,
        fee,
        extraFee
      }).save()
  
      return tcktDtl._id
    } catch (e) {
      console.log(e)
      process.exit()
      // console.log('shit happened at TicketDetail')
      // console.log(e)
      // throw new Error(`Ticket Detail =====> ${ JSON.stringify(e) }`)
    }

    return null
  }

  const createTicket = async (person, ride, payment, details, status, luggage, pick, leave) => {
    try {
      const ticket = await new Ticket({
        person,
        ride,
        details,
        payment,
        status,
        luggageCount : luggage,
        willPick : pick,
        willDrop : leave
      }).save()
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
    const ext = genRand(500, 300)
    const promises = []
    try {
      for(let i = 0; i < ext; i++) {
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
    // const promises = []

    try {
      for(let i = 0; i < usersLimit; i++) {
        const rnd = genRand(positions.length)
        const pos = positions[ rnd ]

        const [ person ] = await Person.aggregate([{ $sample : { size : 1 }}])
        const user = await createUser(person._id, person.firstname, 'lllll', pos)
      }

      console.log('Users created!!')
    } catch (e) {
      throw new Error(`Create User =====> ${ JSON.stringify(e) }`)
    }
  }

  const createAddresses = async () => {
    const ext = genRand(40,30)
    const promises = []

    try {
      for(let i = 0; i < ext; i++) {
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
    const ext = genRand(200,100)
    const promises = []

    try {
      for(let i = 0; i < ext; i++) {
        // const prmss = []
        const [ bus ] = await Bus.aggregate([{ $sample : { size : 1 }}])
        const to = routes[ genRand(routes.length) ]
        const frm = routes[ genRand(routes.length) ]

        promises.push(createRide(
          bus._id,
          to,
          frm
        ))
      }

      const rides = await Promise.all(promises)
      const rids = rides.map(rid => new RideDetail({ ride : rid }).save())

      const details = await Promise.all(rids)

      console.log(details)

      // console.log(details)

      console.log('Rides created!!!')
    } catch (e) {
      console.log(e)
      process.exit()

      // throw new Error(`Create Rides =====> ${ JSON.stringify(e) }`)
    }
  }

  const createBusses = async () => {
    try {
      const drivers = await User.find({ position : 'DRIVER' })

      if(!drivers.length) throw new Error('No drivers!!!!')

      const bussesCount = busNames.length

      const drvrs = drivers.slice(0, bussesCount).map(async (driver, i) => {
        const status = busStatus[ genRand[ busStatus.length ] ]
        const name = busNames[ i ]
        const seats = genRand(30,20)
        const luggage = genRand(50,30)

        return createBus(driver._id, name, status, seats, luggage)
      })

      await Promise.all(drvrs)

      console.log('Busses created!!')
    } catch (e) {
      throw new Error(`Create Busses =====> ${ JSON.stringify(e) }`)
    }
  }

  const createTickets = async () => {
    try {
      for(let i = 0; i < ticketLimit; i++) {
        // /*
        const [ person ] = await Person.aggregate([{ $sample : { size : 1 }}])
        const [ ride ] = await Ride.aggregate([{ $sample : { size : 1 }}])

        const willPick = Boolean(genRand(2))
        const willLeave = Boolean(genRand(2))

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

        // const totalAmount = genRand(70,40)
        const fee = genRand(100,20)
        const extraFee = genRand(40,10)
        const totalAmount = fee + extraFee

        const payment = await createPayment(
          type,
          totalAmount,
          cardBrand,
          cardLastDigits
        )

        const date = genRandDate(new Date(2017, 11, 1), new Date(2018, 12, 1), 0, 23)
        const hour = genRand(24,0)

        const [ frm, to ] = await Address.aggregate([{ $sample : { size : 2 }}])

        // console.log(frm, to)
        // console.log(adrss)
        // process.exit()

        const details = await createTicketDetail(
          frm._id,
          to._id,
          date,
          hour,
          fee,
          extraFee
        )
    // )
        if(!payment || !details) throw new Error('No payment/details!!! WTF IS HAPPENING!!!')

        const luggage = genRand(5)
        const status = ticktsStatus[ genRand(ticktsStatus.length) ]

        const ticket = await createTicket(
          person._id,
          genRand(2) ? ride._id : null,
          payment,
          details,
          status,
          luggage,
          willPick,
          willLeave
        )
      }

      console.log('Tickets created!!')
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
      const d = await Ticket.remove({})//, () => {})
      const e = await TicketDetail.remove({})
      const f = await Payment.remove({})
      const g = await Address.remove({})
      const h = await Bus.remove({})
      const i = await BusDetail.remove({})

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
      await eraseContent()
      await createSuperUser()
      await createPeople()
      await createUsers()
      await createAddresses()
      await createBusses()
      await createRides()
      await createTickets()

      await mongoose.connection.close()
      console.log('')
      console.log('')
      console.log('Process done!')
      console.log('')

      return
    } catch (e) {
      console.log(e, 'Something happened on data (models/mockupData.js)...') 
      process.exit()
    }
  })()
})