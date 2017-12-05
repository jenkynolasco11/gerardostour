import mongoose, { Schema } from 'mongoose'

const MetaSchema = new Schema({
  lastTicketId : Number,
  modifiedAt : { type : Number, default : Date.now }
})

MetaSchema.pre('save', function(next) {
  this.modifiedAt = Date.now()
  next()
})

export default mongoose.model('meta', MetaSchema, 'meta')