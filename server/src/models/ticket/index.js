import mongoose, { Schema } from 'mongoose'
// import UUID from 'uuid/v4'
// import bcrypt from 'bcrypt-nodejs'

const TicketSchema = new Schema({
  person : { type : Schema.Types.ObjectId, ref : 'person', required : true, index : true }, // Doesnt need index
  ride : { type : Schema.Types.ObjectId, ref : 'ride', required : true, index : true }, // Should also be unique, Doesnt need index
  payment : { type : Schema.Types.ObjectId, ref : 'payment', required : true, index : true }, // Should also be unique, Doesnt need index
  details : { type : Schema.Types.ObjectId, ref : 'ticketDetail', required : true, index : true }, // Should also be unique, Doesnt need index
  status : { 
    type : String, 
    index : true, 
    enum : [ 'USED', 'REDEEMABLE', 'NULL', 'NEW' ] 
  },
  luggageCount : { type : Number, default : 0 },
  willPick : { type : Boolean, default : false, index : true },
  willDrop : { type : Boolean, default : false, index : true },
  createdAt : { type : Date, default : Date.now() },
  modifiedAt : { type : Date, default : Date.now() }
})

const TicketDetailsSchema = new Schema({
  pickUpPlace : String, //{ type : String, require : true },
  dropOffPlace : String, //{ type : String, required : true },
  redeemedCount : { Type : Number, default : 0 },
  createdAt : { type : Date, default : Date.now() },
})

TicketSchema.pre('validate', function(next){
  // console.log(this)
  this.modifiedAt = Date.now()
  next()
})

export const Ticket = mongoose.model('ticket', TicketSchema, 'ticket')
export const TicketDetail = mongoose.model('ticketDetail', TicketDetailsSchema, 'ticketDetail')