import mongoose, { Schema } from 'mongoose'
// import UUID from 'uuid/v4'
// import bcrypt from 'bcrypt-nodejs'

const TicketSchema = new Schema({
  person : { type : Schema.Types.ObjectId, required : true, index : true },
  ride : { type : Schema.Types.ObjectId, required : true, index : true },
  payment : { type : Schema.Types.ObjectId, required : true, index : true },
  details : { type : Schema.Types.ObjectId },
  status : { type : String, index : true, enum : [ 'USED', 'REDEEMABLE', 'NULL', 'NEW' ] },
  luggageCount : { type : Number, default : 0 },
  willPick : { type : Boolean, default : false, index : true },
  willDrop : { type : Boolean, default : false, index : true },
  createdAt : { type : Date, default : Date.now() },
  modifiedAt : { type : Date, default : Date.now() }
})

const TicketDetailsSchema = new Schema({
  pickUpPlace : { type : String, require : true },
  dropOffPlace : { type : String, required : true },
  redemmedCount : { Type : Number, default : 0 },
  createdAt : { type : Date, default : Date.now() },
})

TicketSchema.pre('validate', function(next){
  // console.log(this)
  this.modifiedAt = Date.now()
  next()
})

export const Ticket = mongoose.model('ticket', TicketSchema)
export const TicketDetail = mongoose.model('ticketDetail', TicketDetailsSchema)