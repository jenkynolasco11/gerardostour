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
    phoneNumber,// = 'No number provided yet',
    email,// = 'No email provided yet'
  } = props

  const fullName = `${ firstname } ${ lastname }`

  return (
    <List className="review-personal">
      <ListItem
        ripple={ false }
        leftIcon={ <MdPerson /> }
        caption={ fullName }
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
    departureDate,
    departureTime,
    to,
    frm,
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
          caption={ formatDate(departureDate) }
          legend="Date"
        />
        <ListItem
          ripple={ false }
          leftIcon={ <MdTimer /> }
          caption={ formatHour(departureTime) }
          legend="Departure Time"
        />
      </List>
      <List className="list">
        <ListItem
          ripple={ false }
          leftIcon={ <TiHome/> }
          caption={ frm }
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
    howMany,
    to,
    luggage,
    fee,
    extraFee,
    totalAmount,
    frm,
    willDrop,
    willPick,
    pickUpAddress,
    dropOffAddress
  } = props

  const { luggagePrice, prices } = configData
  
  let dropOffFee = 0
  let pickUpFee = 0

  if(willPick) {
    pickUpFee = getExtraPrice(prices[ frm ], pickUpAddress.zipcode)
  }

  if(willDrop) {
    dropOffFee = getExtraPrice(prices[ to ], dropOffAddress.zipcode)
  }

  const totalAmoutCaption = `Total Amount: $${ parseFloat(totalAmount).toFixed(2) }`
  let feesCaption = `$${ parseFloat(fee).toFixed(2) } (${ howMany } tickets x ${ prices.default }) `
  let extraFeesCaption = `$${ parseFloat(extraFee).toFixed(2) } (${ luggage } extra luggage x ${ parseFloat(luggagePrice).toFixed(2) })`
  let extraCaption = `${ willPick ? willDrop ? ` $${ parseFloat(pickUpFee).toFixed(2) } Pick Up + $${ parseFloat(dropOffFee).toFixed(2) } Drop Off fees` : ` + $${ parseFloat(pickUpFee).toFixed(2) } Pick Up fee` : willDrop ? ` + $${ parseFloat(dropOffFee).toFixed(2) } Drop off fee` : '' }`

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
        <ListItem
          className="review-fee"
          ripple={ false }
          itemContent={ <div><div className="small-caption">Drop/Pick fees:</div>{ extraCaption }</div> }
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