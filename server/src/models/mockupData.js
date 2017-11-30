import mongoose from 'mongoose'
import config from '../../config'

mongoose.connect(config.DBURI, { useMongoClient : true }, () => {
  console.log('Connected to the DB')

  require('./user')
  require('./ride')
  require('./ticket')
  require('./person')
  require('./route')
  require('./bus')
  require('./financial')
  
  const addresses = require('./mockupData-streets').default
  
  mongoose.Promise = global.Promise
  
  const Person = mongoose.model('person')
  const User = mongoose.model('user')
  const Ride = mongoose.model('ride')
  const Ticket = mongoose.model('ticket')
  const TicketDetail = mongoose.model('ticketDetail')
  const Route = mongoose.model('route')
  const Bus = mongoose.model('bus')
  const Payment = mongoose.model('payment')
  
  const genRand = (limit, x = 0) => Math.floor(Math.random() * limit) + x
  const genRandDate = (start, end, startHour, endHour) => {
    const date = new Date(+start + Math.random() * (end - start))
    const hour = startHour + Math.random() * (endHour - startHour) | 0
    date.setHours(hour)
    return date
  }
  
  const limit = (lim = 100) => genRand(lim, 1)
  const ticketLimit = limit(200,100)
  const firstNames = [ 'jenky', 'julian', 'richard', 'diane', 'masmfas', 'bastion', 'august', 'ceasar', 'carlos' ]
  const lastNames = [ 'nolasco', 'matias', 'rodriguez', 'figueroa', 'masmfas', 'bastion', 'august', 'ceasar', 'carlos' ]
  const ticktsStatus = [ 'USED', 'REDEEMABLE', 'NULL', 'NEW' ]
  const positions = [ 'DRIVER', 'MANAGER', 'DISPATCHER' ]
  const busStatus = [ 'STANDBY', 'OK', 'DAMAGED' ]
  const busNames = [ 'Blanquita', 'Rocio', 'Maria la del Barrio', 'Calle 14', 'Vasito Verde', 'La Negra' ]
  const cardAffiliates = [ 'VISA', 'MASTERCARD', 'AMERICAN EXPRESS', 'DISCOVERY' ]
  const payType = [ 'CASH', 'CARD' ]

  const usersLimit = 50
  const addLen = addresses.length
  
  const createPhoneNumber = () => {
    let num = ''
    for(let i = 0; i < 10; i++) num += genRand(10)
  
    return num
  }
  
  const getRandCard = () => cardAffiliates[ genRand(cardAffiliates.length) ]
  const getRandAddress = () => addresses[ genRand(addresses.length) ]
  
  const createPerson = async (fn, ln ) => {
    try {
      const phone = createPhoneNumber()
  
      const person = await new Person({
        firstname : fn,
        lastname : ln,
        phoneNumber : phone,
        email : `${ fn[ 0 ] }.${ ln }@email.io`,
      }).save()
  
      return person._id
    } catch (e) {
      return new Error(`Person =====> ${ JSON.stringify(e) }`)
    }
  }

  const createUser = async (id, user, pass, pos) => {
    try {
      const usl = new User({
        personid : id,
        username : user,
        position : pos
      })
  
      usl.password = usl.generateHash(pass)
  
      return await usl.save()
    } catch (e) {
      return new Error(`User =====> ${ JSON.stringify(e) }`)
    }
  }
  
  const createBus = async (user, name, status, seats, luggage) => {
    try {
      const bus = await new Bus({
        user,
        name,
        status,
        seats,
        luggage
      }).save()
  
      return bus._id
    } catch (e) {
      return new Error(`Bus =====> ${ JSON.stringify(e) }`)
    }
  }
  
  const createRoute = async (state, city, street, zipcode, fee, extraFee) => {
    try {
      const route = await new Route({
        state,
        city,
        street,
        zipcode,
        fee,
        extraFee
      }).save()
  
      return route._id
    } catch (e) {
      return new Error(`Route =====> ${ JSON.stringify(e) }`)
    }
  }
  
  const createRide = async (bus, to, frm, time, date) => {
    try {
      const ride = await new Ride({
        bus,
        routeTo : to,
        routeFrom : frm,
        time,
        date
      }).save()
    } catch (e) {
      return new Error(`Ride =====> ${ JSON.stringify(e) }`)
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
      return new Error(`Payment =====> ${ JSON.stringify(e) }`)
    }
  }
  
  const createTicketDetail = async (pick, drop) => {
    try {
      const tcktDtl = await new TicketDetail({
        pickUpPlace : pick,
        dropOffPlace : drop
      }).save()
  
      return tcktDtl._id
    } catch (e) {
      return new Error(`Ticket Detail =====> ${ JSON.stringify(e) }`)
    }
  }
  
  const createTicket = async (person, ride, payment, status, luggage, pick, leave) => {
    try {
      const ticket = await new Ticket({
        person,
        ride,
        payment,
        status,
        luggageCount : luggage,
        willPick : pick,
        willDrop : leave
      }).save()
    } catch (e) {
      return new Error(`Ticket =====> ${ JSON.stringify(e) }`)
    }
  }
  
  ////////////////////////////
  
  const createSuperUser = async () => {
    try {
      const id = await createPerson('jenky', 'nolasco')
  
      return await createUser(id, 'jenky', 'lllll', 'SUPERUSER')
    } catch (e) {
      return new Error(`SuperUser =====> ${ JSON.stringify(e) }`)
    }
  }
  
  const createPeople = async () => {
    const ext = limit(500, 200)

    try {
      for(let i = 0; i < ext; i++) {
        const rnd1 = genRand(firstNames.length)
        const rnd2 = genRand(lastNames.length)

        const first = firstNames[ rnd1 ]
        const last = lastNames[ rnd2 ]

        await createPerson( first, last)
      }

      console.log('People created!!')
    } catch(e) {
      return new Error(`Create People =====> ${ JSON.stringify(e) }`)
    }
  }
  
  const createUsers = async () => {

    try {
      for(let i = 0; i < usersLimit; i++) {
        const rnd = genRand(positions.length)
        const pos = positions[ rnd ]

        const [ person ] = await Person.aggregate([{ $sample : { size : 1 }}])
        const user = await createUser(person._id, person.firstname, 'lllll', pos)
      }

      console.log('Users created!!')
    } catch (e) {
      return new Error(`Create User =====> ${ JSON.stringify(e) }`)
    }
  }
  
  const createRoutes = async () => {
    const ext = limit(40)

    try {
      for(let i = 0; i < ext; i++) {
        const { street, city, state, zipcode } = addresses[ genRand(addLen) ]
        const fee = genRand(100,20)
        const extraFee = genRand(40,10)
    
        await createRoute(state, city, street, zipcode, fee, extraFee)
      }

      console.log('Routes created!!')
    } catch (e) {
      return new Error(`Create Routes =====> ${ JSON.stringify(e) }`)
    }
  }
  
  const createBusses = async () => {
    try {
      const drivers = await User.find({ position : 'DRIVER' })
      const bussesCount = busNames.length

      await Promise.all(
        drivers.slice(0, bussesCount).map(async (driver, i) => {
          const status = busStatus[ genRand[ busStatus.length ] ]
          const name = busNames[ i ]
          const seats = genRand(30,20)
          const luggage = genRand(50,30)
  
          try {
            return await createBus(
              driver._id,
              name,
              status,
              seats,
              luggage,
            )
          } catch(e) {
            return Promise.reject(e)
          }
      }))

      console.log('Busses created!!')
    } catch (e) {
      return new Error(`Create Busses =====> ${ JSON.stringify(e) }`)
    }
  }
  
  const createRides = async () => {
    const ext = limit(100)
  
    try {
      for(let i = 0; i < ext; i++) {
        const date = genRandDate(new Date(2017, 11, 1), new Date(2018, 12, 1), 0, 23)

        const [ bus ] = await Bus.aggregate([{ $sample : { size : 1 }}])
        const [ routeTo ] = await Route.aggregate([{ $sample : { size : 1 }}])
        const [ routeFrom ] = await Route.aggregate([{ $sample : { size : 1 }}])

        await createRide(
          bus._id,
          routeTo._id,
          routeFrom._id,
          date.getHours(),
          date.toDateString(),
        )
      }

      console.log('Rides created!!!')

    } catch (e) {
      return new Error(`Create Rides =====> ${ JSON.stringify(e) }`)
    }
  }
  
  const createTickets = async () => {
    try {
      for(let i = 0; i < ticketLimit; i++) {
        const willPick = !!genRand(2)
        const willLeave = !!genRand(2)

        const type = payType[ genRand(payType.length) ]

        const isCard = type === 'CARD'
        const cardBrand 
          = isCard
          ? getRandCard()
          : ''
        const cardLastDigits
          = isCard 
          ? `${ genRand(10000, 1000) }`
          : ''
  
        const totalAmount = genRand(70,40)
        
        const payment = await createPayment(
          type,
          totalAmount,
          cardBrand,
          cardLastDigits
        )
  
        const details = await createTicketDetail(
          willPick ? getRandAddress().street : '',
          willLeave ? getRandAddress().street : ''
        )
        
        const [ person ] = await Person.aggregate([{ $sample : { size : 1 }}])
        const [ ride ] = await Ride.aggregate([{ $sample : { size : 1 }}])
  
        const luggage = genRand(5)
        const status = ticktsStatus[ genRand(ticktsStatus.length) ]
  
        const ticket = await createTicket(
          person._id,
          ride._id,
          payment,
          status,
          luggage,
          willPick,
          willLeave
        )
      }

      console.log('Tickets created!!')
    } catch (e) {
      return new Error(` =====> ${ JSON.stringify(e) }`)
    }
  }
  
  // /////////////////////////////////////////////////
  //        DANGER ZONE!!!!!
  // ////////////////////////////////////////////////
  const eraseContent = async () => {
    const a = await Person.remove({})//, () => {})
    const b = await User.remove({})//, () => {})
    const c = await Ride.remove({})//, () => {})
    const d = await Ticket.remove({})//, () => {})
  
    await Person.collection.dropIndexes()
    await User.collection.dropIndexes()
    await Ride.collection.dropIndexes()
    await Ticket.collection.dropIndexes()
  }
  // /////////////////////////////////////////////////
  
  (async () => {
    try {
      await eraseContent()
      await createSuperUser()
      await createPeople()
      await createUsers()
      await createRoutes()
      await createBusses()
      await createRides()
      await createTickets()

      await mongoose.connection.close()
      console.log('Process done!')
      console.log('')

      return
    } catch (e) {
      console.log(e, 'Something happened while erasing the data (models/mockupData.js)...') 
      process.exit()
    }
  })()
})