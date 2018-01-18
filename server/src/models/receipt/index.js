import mongoose, { Schema } from 'mongoose'

const PAY_TYPES = [ 'CASH', 'CARD' ]
const CARD_TYPES = [ '', 'VISA', 'MASTERCARD', 'AMERICAN EXPRESS', 'DISCOVERY' ]

const ReceiptSchema = new Schema({
  id : { type : Number, index : true, required : true, unique : true },
  paymentType : { type : String, index : true, enum : PAY_TYPES },
  fee : { type : Number, default : () => 0 },
  extraFee : { type : Number, default : () => 0 },
  totalAmount : { type : Number, default : () => 0 },
  cardBrand : { type : String, enum : CARD_TYPES },
  luggageQty : Number,
  ticketQty : Number,
  cardLastDigits : Number,
  createdAt : { type : Date, default : Date.now }
})

export default mongoose.model('receipt', ReceiptSchema, 'receipt')