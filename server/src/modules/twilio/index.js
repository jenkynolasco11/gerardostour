import Twilio from 'twilio'

import { accountSID, authToken } from './secret.config.json'

const client = new Twilio(accountSID, authToken)

// https://support.twilio.com/hc/en-us/articles/235288367-Receiving-two-way-SMS-messages-with-Twilio
// client
//   .incomingPhoneNumbers('PN299f42f7dcd3caa73129fc3310541709')
//   .update({ 
//      smsUrl : '' // http post url to where the webhook is gonna be
//   })
//   .then((number) => console.log(number.smsUrl))

export const sendSMS = ({ body, to, from }, test = false) => {
  const response = client.messages.create({ body, to, from })

  if(test) console.log(`Message sent to ${ to }: \n"${ body }"`)

  return response
}

export default {
  //
  sendSMS
}
