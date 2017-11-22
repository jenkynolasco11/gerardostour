import mongoose, { Schema, SchemaTypes } from 'mongoose'
import UUID from 'uuid/v4'
// import bcrypt from 'bcrypt-nodejs'

const TicketSchema = new Schema({
  user : { type : Schema.Types.ObjectId, required : true, index : true },
  ride : { type : Schema.Types.ObjectId, required : true, index : true },
  status : { type : String, index : true, enum : [ 'USED', 'SOLD', 'NEW' ] },
  luggage : { type : Number, default : 0 },
  pickAtDoor : { type : Boolean, default : false, index : true },
  leaveAtDoor : { type : Boolean, default : false, index : true },
  created_at : { type : Date, default : Date.now() },
  modifiedAt : { type : Date, default : Date.now() }
})

TicketSchema.pre('validate', function(next){
  // console.log(this)
  this.modifiedAt = Date.now()
  next()
})

export default mongoose.model('ticket', TicketSchema)