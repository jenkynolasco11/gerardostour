import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt-nodejs'

const USER_TYPES = [ 'SUPERUSER', 'DRIVER', 'MANAGER', 'DISPATCHER', 'NONE' ]
const USER_STATUS = [ 'ACTIVE', 'INACTIVE', 'DISABLED', 'DELETED' ]

const UserSchema = new Schema({
  person : { type : Schema.Types.ObjectId, ref : 'person', required : true, unique : true },
  internalCode : String, // F14 => Only for drivers
  username : { type : String, index : { unique : true }},
  password : { type : String, required : true },
  position : { type : String, default : 'NONE', enum : USER_TYPES },
  status : { type : String, enum : USER_STATUS, default : 'ACTIVE', required : true, index : true },
  createdAt : { type : Date, default : Date.now },
  modifiedAt : { type : Date, default : Date.now },
  lastSession : { type : Date, required : true, default : Date.now }
})

UserSchema.methods.generateHash = function(password) { 
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null) 
}

UserSchema.methods.validPassword = function(password) { 
  const isValid = bcrypt.compareSync(password, this.password) 
  // console.log(`Password is ${ isValid ? 'valid' : 'not valid' }`)
  return isValid
}

UserSchema.methods.updateLastSession = function() {
  this.lastSession = Date.now()
  this.save()
}

UserSchema.pre('update', function(next) {
  this.modifiedAt = Date.now()

  next()
})
// UserSchema.pre('save', function(next) {  
//   this.password = this.generateHash(this.password)
//   next()
// })

export default mongoose.model('user', UserSchema, 'user')