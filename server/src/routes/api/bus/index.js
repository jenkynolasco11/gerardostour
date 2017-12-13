import Router from 'koa-router'

import { saveBus, getBusData } from './bus.controller'

const busRouter = new Router({ prefix : 'bus' })

// Retrieve all busses
busRouter.get('/all', async ctx => {
  const { limit = 10, skip = 0 } = ctx.query

  try {
    const busses = await Bus
                    .find({}, { _id : 1 })
                    .skip(skip)
                    .limit(limit)
                    .exec()

    const data = await Promise.all(busses.map(getBusData))

    const count = await Bus.count({})

    if(data.length) return ctx.body = { ok : true, data : { busses : data, count }, message : '' }
  } catch (e) {
    return ctx.body = { ok : false, data : null, message : 'Error retrieving the busses' }
  }

  return ctx.body = { ok : false, data : null, message : 'There are no available busses to retrieve' }
})

// Retrieve a bus with :id
busRouter.get('/:id', async ctx => {
  const { id } = ctx.params

  try {
    const bus = await Bus.findById(id)

    if(bus) {
      const data = await getBusData(bus)

      if(bus) return ctx.body = { ok : true, data, message : '' }
    }
  } catch (e) {
    return ctx.body = { ok : false, data : null, message : 'Error retrieving the bus' }
  }
  return ctx.body = { ok : false, data : null, message : 'There is no available bus with that ID' }
})

// Saves a bus
busRouter.post('/save', async ctx => {
  const { body } = ctx.request

  try {
    const data = await saveBus(body)

    if(data) return ctx.body = { ok : true, data : { busId : data }, message : '' }
  } catch (e) {
    return ctx.body = { ok : false, data : null, message : 'Error saving bus.' }
  }

  return ctx.body = { ok : false, data : null, message : 'Couldn\'t save bus properly.' }
})

export default busRouter