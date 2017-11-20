import mongoose, { Schema, SchemaTypes } from 'mongoose'
import bcrypt from 'bcrypt-nodejs'

const UserSchema = new Schema({
  username : { type : String, index : { unique : true }},
  password : { type : String, required : true, },
  firstname : String,
  lastname : String,
  position : {
    type : String,
    default : 'NONE',
    enum :  [ 'ADMIN', 'CHAUFFER', 'NONE'],
  },
  created_at : { type : Date, default : Date.now() },
  last_session : { type : Date, required : true, default : Date.now() }
})

UserSchema.methods.generateHash = function(password){ 
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null) 
}

UserSchema.methods.validPassword = function(password){ 
  const isValid = bcrypt.compareSync(password, this.password) 
  console.log(`Password is ${ isValid ? 'valid' : 'not valid' }`)
  return isValid
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