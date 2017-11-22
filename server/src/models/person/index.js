import mongoose, { Schema, SchemaTypes } from 'mongoose'

const PersonSchema = new Schema({
  // firstname : String,
  // lastname : String,
  // phonenumber : String,
  firstname : { type : String, required : true },
  lastname : { type : String, required : true },
  phoneNumber : { type : String, match : /^\d{10}$/, required : true },
  created_at : { type : Date, default : Date.now() },
})

PersonSchema.pre('validate', function(next) {
  let { firstname, lastname, phoneNumber } = this
  const first = firstname.split(' ')[0]
  const last = lastname.split(' ')[0]
  
  // Validate Phone Number
  // console.log(typeof this.phoneNumber)
  this.firstname = first.charAt(0).toUpperCase() + first.slice(1).toLowerCase()
  this.lastname = last.charAt(0).toUpperCase() + last.slice(1).toLowerCase()
  next()
})

// PersonSchema.post('save', function(){
//   console.log(this)
// })

export default mongoose.model('person', PersonSchema)