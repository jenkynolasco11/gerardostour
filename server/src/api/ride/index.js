import Router from 'koa-router'

import RideModel from '../../models/ride'

const ride = new Router({ prefix : 'ride' })
// const routes = new Router()

ride.get('/all', async ctx => {
  const { limit = 10, skip = 0 } = ctx.request.body
  try {
    const rides = await RideModel.find({}).skip(skip).limit(limit).exec()
    
    console.log(rides.length)
    
    return ctx.body = { data : rides }
  } catch (e) {
    return ctx.body = { data : null, message : 'Error retrieving rides' }
  }
})

ride.get('/:id', ctx => {
  console.log('right here...')
  return ctx.body = {
    id : '0001',
    content : {
      from : 'NY',
      to : 'PENN',
      time : '00:00:00'
    }
  }
})

ride.get('/:id/passengers', ctx => {
  const randNumber = () => Math.floor((Math.random() * 10))
  const passengersNum = () => Math.floor((Math.random() * 31) + 20)
  const names = [
    'Luis',
    'Juan',
    'Pedro',
    'Diana',
    'Aracelis',
    'Yani',
    'Gutierrez',
    'Julian',
    'El chota',
    'Aramis'
  ]

  const generatePhoneNumber = () => {
    return '0000000000'.split('').map(randNumber).join('')
  }

  const passengers = Array.apply(null, Array(passengersNum())).map( (_, i) => (
    {
      name : names[ randNumber() ],
      number : generatePhoneNumber()
    }
  ))

  console.log(passengers)

  return ctx.body = { passengers }
})

// ride.use('/rides', routes.routes(), routes.allowedMethods())

export default ride