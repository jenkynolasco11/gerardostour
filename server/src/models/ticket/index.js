import mongoose, { Schema } from 'mongoose'
// import UUID from 'uuid/v4'
// import bcrypt from 'bcrypt-nodejs'

const routes = [ 'NY', 'PA' ]
const status = [ 'USED', 'REDEEMABLE', 'NULL', 'NEW' ]

const TicketSchema = new Schema({
  person : { type : Schema.Types.ObjectId, ref : 'person', required : true, index : true }, // Doesnt need index
  ride : { type : Schema.Types.ObjectId, ref : 'ride', index : true }, // Should also be unique, Doesnt need index
  payment : { type : Schema.Types.ObjectId, ref : 'payment', required : true, index : true }, // Should also be unique, Doesnt need index
  details : { type : Schema.Types.ObjectId, ref : 'ticketDetail', required : true, index : true }, // Should also be unique, Doesnt need index
  status : { type : String, index : true, enum : status },
  luggageCount : { type : Number, default : 0 },
  willPick : { type : Boolean, default : false, index : true },
  willDrop : { type : Boolean, default : false, index : true },
  createdAt : { type : Date, default : Date.now() },
  modifiedAt : { type : Date, default : Date.now() },
  //////****//
  // from : { type : String, enum : routes, index : true },
  // to : { type : String, enum : routes, index : true },
})

const TicketDetailsSchema = new Schema({
  pickUpPlace : { type : Schema.Types.ObjectId, ref : 'address', required : true, index : true },
  dropOffPlace : { type : Schema.Types.ObjectId, ref : 'address', required : true, index : true },
  redeemedCount : { Type : Number, default : 0 },
  fee : { type : Number, default : 0 },
  extraFee : { type : Number, default : 0 },
  time : { type : Number, required : true, index : true },
  date : { type : Date, required : true, index : true },
  createdAt : { type : Date, default : Date.now() },
  modifiedAt : { type : Date, default : Date.now() },
})

TicketSchema.pre('validate', function(next){
  // console.log(this)
  this.modifiedAt = Date.now()
  next()
})

TicketDetailsSchema.pre('validate', function(next){
  // console.log(this)
  this.modifiedAt = Date.now()
  next()
})

export const Ticket = mongoose.model('ticket', TicketSchema, 'ticket')
export const TicketDetail = mongoose.model('ticketDetail', TicketDetailsSchema, 'ticketDetail')