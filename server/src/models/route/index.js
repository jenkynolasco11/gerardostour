import mongoose, { Schema } from 'mongoose'

const RouteSchema = new Schema({
  street : String,
  city : String,
  state : String,
  zipcode : Number,
  fee : { type : Number, default : 0 },
  extraFee : { type : Number, default : 0 },
  modifiedAt : { type : Date, default : Date.now() }
})

RouteSchema.pre('validate', function(next) {
  this.modifiedAt = Date.now()
  next()
})

export default mongoose.model('route', RouteSchema)