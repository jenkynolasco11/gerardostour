import mongoose, { Schema } from 'mongoose'
// import UUID from 'uuid/v4'
// import bcrypt from 'bcrypt-nodejs'

const ROUTES = [ 'NY', 'PA', 'N/A' ]
const STATUS_TYPES = [ 'USED', 'REDEEMED', 'NULL', 'NEW', 'DELETED' ]
const TICKET_TYPES = [ 'REGULAR', 'PACKAGE', 'VIP', 'SPECIAL', 'AIRPORT' ]
// const issuedList = [ 'WEBSITE', 'LOCAL' ]

const TicketSchema = new Schema({
  id : { type : Number, required : true, unique : { index : true }},
  person : { type : Schema.Types.ObjectId, ref : 'person', required : true, index : true }, // Doesnt need index
  ride : { type : Schema.Types.ObjectId, ref : 'ride', index : true, default : null }, // Should also be unique, Doesnt need index
  receipt : { type : Schema.Types.ObjectId, ref : 'receipt', required : true, index : true }, // Should also be unique, Doesnt need index
  details : { type : Schema.Types.ObjectId, ref : 'ticketDetails', required : true, index : true }, // Should also be unique, Doesnt need index
  status : { type : String, index : true, enum : STATUS_TYPES },
  willPick : { type : Boolean, default : false, index : true },
  willDrop : { type : Boolean, default : false, index : true },
  frm : { type : String, enum : ROUTES, index : true },
  to : { type : String, enum : ROUTES, index : true },
  time : { type : Number, required : true, index : true },
  date : { type : Date, required : true, index : true },
  type : { type : String, enum : TICKET_TYPES, index : true, default : 'REGULAR' },
  reminded : { type : Boolean, default : false },
  createdAt : { type : Date, default : Date.now },
  modifiedAt : { type : Date, default : Date.now },
})

const TicketDetailsSchema = new Schema({
  pickUpAddress : { type : Schema.Types.ObjectId, ref : 'address', index : true },
  dropOffAddress : { type : Schema.Types.ObjectId, ref : 'address', index : true },
  redeemedCount : { type : Number, default : 0 },
  isLocal : { type : Boolean, default : false },
  message : { type : String, default : '' },
  // reminded : { type : Boolean, default : false },
  // fee : { type : Number, default : 0 },
  // extraFee : { type : Number, default : 0 },
  createdAt : { type : Date, default : Date.now },
  modifiedAt : { type : Date, default : Date.now },
})

TicketSchema.pre('save', function(next) {
  this.modifiedAt = Date.now()
  next()
})

TicketDetailsSchema.pre('save', function(next) {
  this.modifiedAt = Date.now()
  next()
})

export const Ticket = mongoose.model('ticket', TicketSchema, 'ticket')
export const TicketDetail = mongoose.model('ticketDetails', TicketDetailsSchema, 'ticketDetails')
