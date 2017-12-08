import mongoose, { Schema } from 'mongoose'

const ReceiptSchema = new Schema({
  id : { type : Number, index : true, required : true, unique : true },
  paymentType : { 
    type : String, 
    index : true, 
    enum : [ 'CASH', 'CARD' ]
  },
  // tickets : [{ type : String, required : true, index : true }],
  fee : Number,
  extraFee : Number,
  totalAmount : Number,
  cardBrand : {
    type : String,
    // index : true,
    enum : [ '', 'VISA', 'MASTERCARD', 'AMERICAN EXPRESS', 'DISCOVERY' ]
  },
  cardLastDigits : Number,
  createdAt : { type : Date, default : Date.now }
})

export default mongoose.model('receipt', ReceiptSchema, 'receipt')