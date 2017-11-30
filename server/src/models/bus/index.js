import mongoose, { Schema } from 'mongoose'

const BusSchema = new Schema({
  user : Schema.Types.ObjectId,
  alias : String,
  name : String,
  status : {
    type : String,
    enum : [ 'STANDBY', 'OK', 'DAMAGED' ]
  },
  seats : Number,
  luggage : Number,
  createdAt : { type : Date, default : Date.now() }
})

export default mongoose.model('bus', BusSchema)