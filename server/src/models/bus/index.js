import mongoose, { Schema } from 'mongoose'

const { ObjectId } = Schema.Types

const STATUS_TYPES = [ 'STANDBY', 'OK', 'DAMAGED', 'DISABLED' ]

const BusSchema = new Schema({
  id : { type : Number, unique : { index : true }, required : true },
  user : { type : ObjectId, ref : 'user' },
  name : { type : String, unique : { index : true }},
  active : { type : Boolean, default : () => false },
  status : { type : String, default : () => 'STANDBY', enum : STATUS_TYPES },
  createdAt : { type : Date, default : Date.now },
  modifiedAt : { type : Date, default : Date.now }
})

const BusDetailsSchema = new Schema({
  bus : { type : ObjectId, ref : 'bus', unique : { index : true }, required : true },
  seatQty : { type : Number, default : () => 0 },
  luggageQty : { type : Number, default : () => 0 },

  // *other stats
  plate : { type : String, unique : { index : true }},
  modifiedAt : { type : Date, default : Date.now }
})

BusSchema.pre('save', function(next) {
  this.modifiedAt = Date.now()
  next()
})

BusDetailsSchema.pre('save', function(next) {
  this.modifiedAt = Date.now()
  next()
})

export const Bus = mongoose.model('bus', BusSchema, 'bus')
export const BusDetail = mongoose.model('busDetails', BusDetailsSchema, 'busDetails')
