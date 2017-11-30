import mongoose, { Schema } from 'mongoose'
// import UUID from 'uuid/v4'
// import bcrypt from 'bcrypt-nodejs'

const RideSchema = new Schema({
  bus : { type : Schema.Types.ObjectId, ref : 'bus', required : true, index : true },
  routeTo : { type : Schema.Types.ObjectId, ref : 'route', required : true, index : true },
  routeFrom : { type : Schema.Types.ObjectId, ref : 'route', required : true, index : true },
  time : { type : Number, index : true },
  date : { type : Date, index : true },
  createdAt : { type : Date, default : Date.now() },
  modifiedAt : { type : Date, default : Date.now() },
})

RideSchema.pre('validate', function(next) {
  this.modifiedAt = Date.now()
  next()
})

export default mongoose.model('ride', RideSchema, 'ride')