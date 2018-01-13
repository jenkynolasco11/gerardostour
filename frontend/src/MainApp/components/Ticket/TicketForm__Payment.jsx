import React from 'react'
import { List, ListDivider, ListCheckbox, /*ListItem*/ } from 'react-toolbox/lib/list'
import { MdCreditCard, MdDateRange, MdLabelOutline } from 'react-icons/lib/md'
import { CardTitle } from 'react-toolbox/lib/card'
import { Input } from 'react-toolbox/lib/input'

import { onlyNumber } from '../../utils'

const TicketPayment = props => {
  const { payment } = props
  const {
    isCard,
    cardNumber,
    expirationDate,
    cvc,
  } = payment

  return (
    <List className="ticket-form-payment">
      <CardTitle title="Total Amount" />
      <ListCheckbox 
        caption="Will Pay With Card?"
        checked={ isCard }
        onChange={ val => props.onChange(val, 'payment', 'isCard') }
      />
      { 
        isCard &&
        <React.Fragment>
          <ListDivider />
          <CardTitle title="Card Information" />
          <Input
            hint="Credit/Debit Card Number"
            label="Card Number"
            type="text"
            maxLength={ 16 }
            onChange={ val => props.onChange(onlyNumber(val, cardNumber), 'payment', 'cardNumber') }
            value={ cardNumber }
            icon={ <MdCreditCard /> }
            required
          />
          <Input
            hint="MMYY"
            label="Card Expiration Date"
            type="text"
            maxLength={ 4 }
            onChange={ val => props.onChange(onlyNumber(val, expirationDate), 'payment', 'expirationDate') }
            value={ expirationDate }
            icon={ <MdDateRange /> }
            required
          />
          <Input
            hint="000"
            label="CVC"
            type="text"
            maxLength={ 3 }
            onChange={ val => props.onChange(onlyNumber(val, cvc), 'payment', 'cvc') }
            value={ cvc }
            icon={ <MdLabelOutline /> }
            required
          />
        </React.Fragment>
      }
      <ListDivider />
    </List>
  )
}


export default TicketPayment