const user = 'database'
const pass = 'database'
const session = 'key for my session'
const database = 'generic'

export const userDefault = 'admin'
export const passDefault = 'admin12345'

export const PORT = 8000
export const DBURI = `mongodb://${ user }:${ pass }@ds123129.mlab.com:23129/${ database }`
export const KEY = 'THIS IS MY KEY'
export const SESSIONID = session
export const KEYS = ['asdbkjqnwe', 'akhdasjdkajhkasjdn']
export const ALLOWED_USERS = [ 'SUPERUSER', 'DISPATCHER', 'MANAGER' ]
export const TWILIO_PHONE_NUMBER = '+14134895573'
export const HOURS_BEFORE_TO_REMIND = 2

export default {
    PORT,
    DBURI,
    KEY,
    SESSIONID,
    KEYS,
    ALLOWED_USERS,
    TWILIO_PHONE_NUMBER,
    HOURS_BEFORE_TO_REMIND
}
