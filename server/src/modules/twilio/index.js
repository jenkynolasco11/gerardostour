import Twilio from 'twilio'

import { accountSID, authToken } from './secret.config.json'

const client = new Twilio(accountSID, authToken)

export const sendSMS = ({ body, to, from }, test = false) => {
  const response = client.messages.create({ body, to, from })

  if(test) console.log(`Message sent to ${ to }: \n"${ body }"`)

  return response
}

export default {
  //
  sendSMS
}
