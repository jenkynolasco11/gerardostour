import React /*, { Component }*/ from 'react'
import { CardTitle, CardActions } from 'react-toolbox/lib/card'
// import { Input } from 'react-toolbox/lib/input'
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
          legend="Going From"
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
  const { ticketMany, to, luggage, fee, extraFee, totalAmount } = props

  const prices = configData.prices[ to ]
                  ? configData.prices[ to ]
                  : configData.prices.default

  const extraLuggage = (luggage - prices.minLuggage) < 0 
                        ? 0
                        : luggage - prices.minLuggage

  // const feesTotal = parseFloat(ticketMany * prices.fee).toFixed(2)
  // const extraTotal = parseFloat(extraLuggage * prices.extraFee).toFixed(2)
  // const totalTotal = parseFloat(Number(feesTotal) + Number(extraTotal)).toFixed(2)

  const feesTotal = fee
  const extraTotal = extraFee
  const totalTotal = totalAmount

  const totalAmoutCaption = `Total Amount : ${ totalTotal }`
  const feesCaption = `${ feesTotal } (${ ticketMany } tickets x ${ parseFloat(prices.fee).toFixed(2) }) `
  const extraFeesCaption = `${ extraTotal } (${ extraLuggage } extra luggage x ${ parseFloat(prices.extraFee).toFixed(2) })`

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
        <Button raised icon={ <MdThumbDown /> } onClick={ props.onCancel } label="Cancel" />
        <Button raised type="submit" icon={ <MdThumbUp /> } label="Accept" />
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