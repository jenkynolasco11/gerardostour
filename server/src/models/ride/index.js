import mongoose, { Schema } from 'mongoose'

const ROUTES = [ 'NY', 'PA' ]
const STATUS = [ 'FINISHED', 'PENDING', 'ASSIGNED', 'ON-THE-WAY', 'CANCELLED' ]

const RideSchema = new Schema({
  id : { type : Number, index : true, required : true },
  bus : { type : Schema.Types.ObjectId, ref : 'bus', index : true },
  frm : { type : String, enum : ROUTES, required : true },
  to : { type : String, enum : ROUTES, required : true },
  status : { type : String, enum : STATUS, index : true, default : 'PENDING' },
  time : { type : Number, default : -1 },
  date : { type : Date },
  // Nothing important after this
  createdAt : { type : Date, default : Date.now },
  modifiedAt : { type : Date, default : Date.now },
})

const RideDetailsSchema = new Schema({
  ride : { type : Schema.Types.ObjectId, ref : 'ride', index : true },
  seatsOccupied : { type : Number, default : 0 },
  luggage : { type : Number, default : 0 },
  startTime : Date,
  endTime : Date,
  createdAt : { type : Date, default : Date.now },
  modifiedAt : { type : Date, default : Date.now }
})

const RideFeesSchema = new Schema({
  ride : { type : Schema.Types.ObjectId, ref : 'ride', index : true },
  gas : { type : Number, default : 0 },
  toll : { type : Number, default : 0 },
  wash : { type : Number, default : 0 },
  other : { type : Number, default : 0 },
  parking : { type : Number, default : 0 },
  modifiedAt : { type : Date, default : Date.now },
  otherDetail : String,
})

RideSchema.pre('save', function(next) {
  this.modifiedAt = Date.now()
  next()
})

RideDetailsSchema.pre('validate', function(next) {
  this.modifiedAt = Date.now()
  next()
})

RideFeesSchema.pre('validate', function(next) {
  this.modifiedAt = Date.now()
  next()
})

export const Ride = mongoose.model('ride', RideSchema, 'ride')
export const RideFees = mongoose.model('rideFees', RideFeesSchema, 'rideFees')
export const RideDetails = mongoose.model('rideDetails', RideDetailsSchema, 'rideDetails')