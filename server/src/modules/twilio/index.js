import Twilio from 'twilio'

import { accountSID, authToken } from './secret.config.json'

const client = new Twilio(accountSID, authToken)

const sendSMS = ({ body, to, from }) => {
  const response = client.messages.create({ body, to, from })

  return response
}

export default {
  //
  sendSMS
}