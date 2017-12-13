import mongoose, { Schema } from 'mongoose'

const ReceiptSchema = new Schema({
  id : { type : Number, required : true, unique : { index : true }},
  paymentType : {
    type : String,
    index : true,
    enum : [ 'CASH', 'CARD' ]
  },
  fee : Number,
  extraFee : Number,
  totalAmount : Number,
  cardBrand : {
    type : String,
    // index : true,
    enum : [ '', 'VISA', 'MASTERCARD', 'AMERICAN EXPRESS', 'DISCOVERY' ]
  },
  luggage : Number,
  ticketCant : Number,
  cardLastDigits : { type : String, index : true },
  createdAt : { type : Date, default : Date.now }
})

export default mongoose.model('receipt', ReceiptSchema, 'receipt')