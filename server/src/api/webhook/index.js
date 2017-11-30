import Router from 'koa-router'
import axios from 'axios'

const webhook = new Router({ prefix : 'webhook' })

const WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/1160582/szth43/'

webhook.post('/', async ctx => {
  const { body } = ctx.request
  try {
    const res = await axios.post(WEBHOOK_URL, body)

    if(res.statusText === 'OK') return ctx.body = { ok : true, message : 'Data sent ok' }

    return ctx.body = { ok : false, message : 'Status Text not OK' }
  } catch (e) {
    return ctx.body = { ok : false, message : 'Error on post request' }
  }
})

webhook.get('/', ctx => {
  //
  return ctx.body = { ok : true, message : 'it works!' }
})

export default webhook