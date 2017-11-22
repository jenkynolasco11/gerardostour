import mongoose, { Schema, SchemaTypes } from 'mongoose'
import bcrypt from 'bcrypt-nodejs'

const UserSchema = new Schema({
  personid : { type : Schema.Types.ObjectId, required : true, unique : true },
  username : { type : String, index : { unique : true }},
  password : { type : String, required : true, },
  position : {
    type : String,
    default : 'NONE',
    enum :  [ 'ADMIN', 'CHAUFFER', 'NONE'],
  },
  createdAt : { type : Date, default : Date.now() },
  lastSession : { type : Date, required : true, default : Date.now() }
})

UserSchema.methods.generateHash = function(password){ 
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null) 
}

UserSchema.methods.validPassword = function(password){ 
  const isValid = bcrypt.compareSync(password, this.password) 
  console.log(`Password is ${ isValid ? 'valid' : 'not valid' }`)
  return isValid
}

UserSchema.methods.updateLastSession = function() {
  this.lastSession = Date.now()
  this.save()
}

UserSchema.pre('validate', function(next){
  this.password = this.generateHash(this.password)
  next()
})

// UserSchema.post('save', doc => {  
//   console.log(doc)
//   console.log(doc.generateHash(doc.password))
//   // doc.password = doc.generateHash(doc.password)
//   // doc.save(console.log)
// })

export default mongoose.model('user', UserSchema)