import React /*, { Component }*/ from 'react'
import { CardTitle, CardActions } from 'react-toolbox/lib/card'
import { List, ListItem, ListDivider } from 'react-toolbox/lib/list'
import Button from 'react-toolbox/lib/button/Button'
import {
  MdThumbUp,
  MdThumbDown,
  MdPersonPinCircle,
  MdPinDrop,
  MdAttachMoney,
  MdPhone,
  MdEmail,
  MdPerson,
  MdEventAvailable,
  MdTimer,
  // MdDirectionsBus
} from 'react-icons/lib/md'
import { TiHome } from 'react-icons/lib/ti'
import { FaRoad } from 'react-icons/lib/fa'

import configData from '../../config/config-values.json'
import { formatDate, formatHour } from '../../utils'
import { getExtraPrice } from './utils'

const Title = prop => ([
  <CardTitle key="1" title={ prop.title }/>,
  <ListDivider key="2" />
])

const ReviewPersonal = props => {
  const {
    firstname,
    lastname,
    phoneNumber,
    email
  } = props

  return (
    <List className="review-personal">
      <ListItem
        ripple={ false }
        leftIcon={ <MdPerson /> }
        caption={ `${ firstname } ${ lastname }` }
        legend="Person Name"
      />
      <ListItem
        ripple={ false }
        leftIcon={ <MdPhone /> }
        caption={ phoneNumber }
        legend="Phone Number"
      />
      {
        email
        ? <ListItem
            ripple={ false }
            leftIcon={ <MdEmail /> }
            caption={ email }
            legend="Email"
          />
        : null
      }
    </List>
  )
}

const ReviewTrip = props => {
  const {
    date,
    time,
    to,
    from,
    willDrop,
    willPick,
    pickUpAddress,
    dropOffAddress,
  } = props

  return (
    <List className="review-trip">
      <List className="list">
        <ListItem
          ripple={ false }
          leftIcon={ <MdEventAvailable /> }
          caption={ formatDate(date) }
          legend="Date"
        />
        <ListItem
          ripple={ false }
          leftIcon={ <MdTimer /> }
          caption={ formatHour(time) }
          legend="Departure Time"
        />
      </List>
      <List className="list">
        <ListItem
          ripple={ false }
          leftIcon={ <TiHome/> }
          caption={ from }
          legend="From"
        />
        <ListItem
          ripple={ false }
          leftIcon={ <FaRoad /> }
          caption={ to }
          legend="Going To"
        />
      </List>
      {
        willPick &&
        <ListItem
          ripple={ false }
          leftIcon={ <MdPersonPinCircle /> }
          caption={ `${ pickUpAddress.street }, ${ pickUpAddress.city }, ${ pickUpAddress.state } ${ pickUpAddress.zipcode }` }
          legend="Pick Up Address"
        />
      }
      {
        willDrop &&
        <ListItem
          ripple={ false }
          leftIcon={ <MdPinDrop /> }
          caption={ `${ dropOffAddress.street }, ${ dropOffAddress.city }, ${ dropOffAddress.state } ${ dropOffAddress.zipcode }` }
          legend="Pick Up Address"
        />
      }
    </List>
  )
}

const ReviewPayment = props => {
  const {
    ticketMany,
    to,
    luggage,
    fee,
    extraFee,
    totalAmount,
    from,
    willDrop,
    willPick,
    pickUpAddress,
    dropOffAddress
  } = props

  const { luggagePrice, prices } = configData
  
  let dropOffFee = 0
  let pickUpFee = 0

  if(willPick) {
    pickUpFee = getExtraPrice(prices[ from ], pickUpAddress.zipcode)
  }

  if(willDrop) {
    dropOffFee = getExtraPrice(prices[ to ], dropOffAddress.zipcode)
  }

  const totalAmoutCaption = `Total Amount : $${ parseFloat(totalAmount).toFixed(2) }`
  let feesCaption = `$${ parseFloat(fee).toFixed(2) } (${ ticketMany } tickets x ${ prices.default }) `
  feesCaption += `${ willPick ? willDrop ? ` + ${ pickUpFee } Pick Up + ${ dropOffFee } Drop Off fees` : ` + ${ pickUpFee } Pick Up fee` : willDrop ? ` + ${ dropOffFee } Drop off fee` : '' }`
  let extraFeesCaption = `$${ parseFloat(extraFee).toFixed(2) } (${ luggage } extra luggage x ${ luggagePrice })`

  return (
    <List className="review-payment">
      <List className="list">
        <ListItem
          leftIcon={ <MdAttachMoney /> }
          ripple={ false }
          caption={ totalAmoutCaption }
        />
        <ListItem
          className="review-fee"
          ripple={ false }
          itemContent={ <div><div className="small-caption">Fee:</div> { feesCaption }</div> }
          // caption={ []}
        />
        <ListItem
          className="review-fee"
          ripple={ false }
          itemContent={ <div><div className="small-caption">Extra Fee:</div> { extraFeesCaption }</div> }
          // caption={  }
        />
      </List>
    </List>
  )
}

const ReviewActions = props => {
  return (
    <List className="review-actions">
      <p> Proceed with the payment? </p>
      <CardActions>
        <Button
          // raised
          icon={ <MdThumbDown /> }
          onClick={ props.onCancel }
          label="Cancel"
        />
        <Button
          // raised
          type="submit"
          icon={ <MdThumbUp /> }
          label="Accept"
        />
      </CardActions>
    </List>
  )
}

const TicketReview = props => {
  return (
    <List className="ticket-form-review">
      <Title title="Personal Information" />
      <ReviewPersonal { ...props.person } />
      <Title title="Trip Information" />
      <ReviewTrip { ...props } />
      <Title title="Payment Information" />
      <ReviewPayment { ...props } />
      <ListDivider />
      <ReviewActions { ...props } />
    </List>
  )
}

export default TicketReview