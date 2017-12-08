import React from 'react'
import { List, ListDivider, ListCheckbox, ListItem } from 'react-toolbox/lib/list'
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
    // totalAmount,
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
        isCard && [
          <ListDivider key={ 1 } />,
          <CardTitle key={ 2 } title="Card Information" />,
          <Input
            key={ 3 }
            hint="Credit/Debit Card Number"
            label="Card Number"
            type="text"
            maxLength={ 16 }
            onChange={ val => props.onChange(onlyNumber(val), 'payment', 'cardNumber') }
            value={ cardNumber }
            icon={ <MdCreditCard /> }
            required
          />,
          <Input
            key={ 4 }
            hint="MMYY"
            label="Card Expiration Date"
            type="text"
            maxLength={ 4 }
            onChange={ val => props.onChange(onlyNumber(val), 'payment', 'expirationDate') }
            value={ expirationDate }
            icon={ <MdDateRange /> }
            required
          />,
          <Input
            key={ 5 }
            hint="000"
            label="CVC"
            type="text"
            maxLength={ 3 }
            onChange={ val => props.onChange(onlyNumber(val), 'payment', 'cvc') }
            value={ cvc }
            icon={ <MdLabelOutline /> }
            required
          />
        ]
      }
      <ListDivider />
      {/*
      <ListItem ripple={ false }>
        <CardTitle title=" Total Amount:" />
        <p> { parseFloat(totalAmount).toFixed(2) } </p>
      </ListItem>
      {/*
        <ListItem ripple={ false }>
          <CardTitle title="  Extra Fees:" />
          <p> { parseFloat(extraFee).toFixed(2) } </p>
        </ListItem>
        <ListItem ripple={ false }>
          <CardTitle title="Total Amount:" />
          <p> { parseFloat(totalAmount).toFixed(2) } </p>
        </ListItem>
      */}
    </List>
  )
}


export default TicketPayment