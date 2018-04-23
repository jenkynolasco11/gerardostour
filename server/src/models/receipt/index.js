import mongoose, { Schema } from 'mongoose'

const PAY_TYPES = [ 'CASH', 'CARD' ]
const CARD_TYPES = [ '', 'VISA', 'MASTERCARD', 'AMERICAN EXPRESS', 'DISCOVERY' ]

const ReceiptSchema = new Schema({
  id : { type : Number, index : true, required : true, unique : true },
  paymentType : { type : String, index : true, enum : PAY_TYPES },
  // fee : { type : Number, default : () => 0 },
  // extraFee : { type : Number, default : () => 0 },
  // totalAmount : { type : Number, default : () => 0 },
  cardBrand : { type : String, enum : CARD_TYPES },
  luggageQty : Number,
  ticketQty : Number,
  cardLastDigits : Number,
  createdAt : { type : Date, default : Date.now },
  confirmationNumber : { type : String, index : true, required : true },
  tickets : [{
    // ride : { type : String,  },
    // datetime : Date,

  }],
  reminded : { }
})

// const ReceiptDetailsSchema = new Schema({

// })

// const ReceiptFeeSchema = new Schema({
//   receipt : { type : Schema.Types.ObjectId, unique : { index : true }},
//   // paymentType : { type : String, index : true, enum : PAY_TYPES },
//   fee : { type : Number, default : () => 0 },
//   extraFee : { type : Number, default : () => 0 },
//   totalAmount : { type : Number, default : () => 0 },
// })

// ReceiptSchema.methods.verifyConfirmation = function(number) {
//   return this.confirmationNumber === number
// }

// export const ReceiptFee = mongoose.model('receiptFee', ReceiptFeeSchema, 'receiptFee')
export const Receipt = mongoose.model('receipt', ReceiptSchema, 'receipt')
