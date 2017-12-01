import mongoose, { Schema } from 'mongoose'

const PaymentSchema = new Schema({
  type : { 
    type : String, 
    index : true, 
    enum : [ 'CASH', 'CARD' ]
  },
  totalAmount : Number,
  cardBrand : {
    type : String,
    // index : true,
    enum : [ '', 'VISA', 'MASTERCARD', 'AMERICAN EXPRESS', 'DISCOVERY' ]
  },
  cardLastDigits : Number,
  createdAt : { type : Date, default : Date.now }
})

export default mongoose.model('payment', PaymentSchema, 'payment')