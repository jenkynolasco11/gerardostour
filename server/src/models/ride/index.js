import mongoose, { Schema, SchemaTypes } from 'mongoose'
// import UUID from 'uuid/v4'
// import bcrypt from 'bcrypt-nodejs'

const RideSchema = new Schema({
  from : { type : String, required : true, index : true },
  to : { type : String, required : true, index : true },
  departing : { type : Date, required : true, index : true },
  ticketCount : { type : Number, default : 0 },
  assignedTo : String,
  created_at : { type : Date, default : Date.now() },
  modifiedAt : { type : Date, default : Date.now() },
})

RideSchema.pre('validate', function(next) {
  this.modifiedAt = Date.now()
  next()
})

export default mongoose.model('ride', RideSchema)