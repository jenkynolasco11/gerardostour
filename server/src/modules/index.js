import twlo from './twilio'
import mailr from './nodemailer'

export const twilio = twlo
export const Mailer = mailr

export default {
  //
  twilio,
  Mailer
}