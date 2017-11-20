import Router from 'koa-router'

const ride = new Router({ prefix : 'ride' })
// const routes = new Router()

ride.get('/all', ctx => {
  const maxPerDay = () => Math.floor((Math.random() * 5) + 1)
  const maxPerView = Math.floor((Math.random() * 10) + 1)
  const passengers = () => Math.floor((Math.random() * 31) + 20)
  const status = () => {
    const indx = Math.floor((Math.random() * 4))
    return [
      'COMPLETED',
      'PENDING',
      'NON-STARTED',
      'VIP'
    ][ indx ]
  }
  // const date = (start, end) => {
  //   const calc = start.getTime() + Math.random() 
  //               * (end.getTime() - start.getTime())
  //   return new Date( calc )
  // }
  
  function randomDate(start, end, startHour, endHour) {
    const date = new Date(+start + Math.random() * (end - start))
    const hour = startHour + Math.random() * (endHour - startHour) | 0
    date.setHours(hour)
    return date
  }

  let indx = 0
  const rides = Array.apply(null, Array(maxPerView)).map( (_, i) => {
    const day = randomDate(new Date(2017,11,1),new Date(), 0, 23)

    indx += passengers()

    const content = Array
                    .apply(null, Array(maxPerDay()))
                    .map( () => ({
                      id : indx,
                      passengers : passengers(),
                      status : status(),
                    }))

    return {
      day,
      content
    }
  })

  return ctx.body = { rides }
  // return ctx.body = {
  //   rides : Array.apply(null, Array(max)).map( _ => {
  //     indx += passengers()
  //     return {
  //       id : indx,
  //       passengers : passengers(),
  //       status : status(),
  //       date : date(new Date(2012,0,1), new Date())
  //     }
  //   })
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