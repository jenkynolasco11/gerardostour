import mongoose, { Schema } from 'mongoose'
// import UUID from 'uuid/v4'
// import bcrypt from 'bcrypt-nodejs'

const routes = [ 'NY', 'PA' ]

const RideSchema = new Schema({
  bus : { type : Schema.Types.ObjectId, ref : 'bus', index : true },
  routeTo : { type : String, enum : routes, required : true },
  routeFrom : { type : String, enum : routes, required : true },
  createdAt : { type : Date, default : Date.now },
  modifiedAt : { type : Date, default : Date.now },
})

const RideDetailSchema = new Schema({
  ride : { type : Schema.Types.ObjectId, ref : 'ride', index : true },
  time : { type : Number, default : -1 },
  date : { type : Date },
  createdAt : { type : Date, default : Date.now },
  modifiedAt : { type : Date, default : Date.now }
})

RideSchema.pre('save', function(next) {
  this.modifiedAt = Date.now()
  next()
})

RideDetailSchema.pre('validate', function(next) {
  this.modifiedAt = Date.now()
  next()
})

// [ RideSchema, RideDetailSchema ].forEach(schema => {
//   schema.pre('save', function(next) {
//     this.modifiedAt = Date.now()
//     next()
//   })
// })


export const Ride = mongoose.model('ride', RideSchema, 'ride')
export const RideDetail = mongoose.model('rideDetail', RideDetailSchema, 'rideDetail')