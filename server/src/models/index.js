import mongoose from 'mongoose'

import usr from './user'

export const User = mongoose.model('user')

const user = new User({
  username : 'jenky',
  password : 'lllll',
  firstname : 'Jenky',
  lastname : 'Nolasco',
  position : 'ADMIN',
}).save()

export default {
  //
  User,
}