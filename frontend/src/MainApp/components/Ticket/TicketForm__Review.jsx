import React from 'react'
import { CardTitle, CardActions } from 'react-toolbox/lib/card'
import { List, ListItem, ListDivider } from 'react-toolbox/lib/list'
import Button from 'react-toolbox/lib/button/Button'
import {
  MdBuild,
  MdThumbUp,
  MdThumbDown,
  MdAttachMoney,
  MdPhone,
  MdEmail,
  MdPerson,
  MdDeleteForever
} from 'react-icons/lib/md'

import configData from '../../config/config-values.json'
import { formatDate, formatHour } from '../../utils'
import { getExtraPrice } from './utils'
import FontIcon from 'react-toolbox/lib/font_icon/FontIcon'

const Title = prop => (
  <React.Fragment>
    <CardTitle title={ prop.title } />
    <ListDivider />
  </React.Fragment>
)

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
    date,
    time,
    to,
    frm,
    willDrop,
    willPick,
    pickUpAddress,
    dropOffAddress,
    ticketType
  } = props

  return (
    <React.Fragment>
      <List className="review-trip">
        <ListItem
          caption={ `Ticket(s) type: ${ ticketType }` }
          ripple={ false }

        />
        <List className="list">
          <ListItem
            ripple={ false }
            leftIcon={ <FontIcon value="event" /> }
            caption={ formatDate(date) }
            legend="Date"
          />
          <ListItem
            ripple={ false }
            leftIcon={ <FontIcon value="timer" /> }
            caption={ formatHour(time) }
            legend="Departure Time"
          />
        </List>
      </List>
      {
        ticketType !== 'SPECIAL' &&
        <List className="review-trip">
          <List className="list">
            <ListItem
              ripple={ false }
              leftIcon={ <FontIcon value="home" /> }
              caption={ frm }
              legend="From"
            />
            {
              ticketType !== 'AIRPORT' &&
              <ListItem
                ripple={ false }
                leftIcon={ <FontIcon value="location_on" /> }
                caption={ to }
                legend="Going To"
              />
            }
          </List>
        </List>
      }
      {
        willPick &&
        <ListItem
          ripple={ false }
          leftIcon={ <FontIcon value="person_pin_circle" /> }
          caption={ `${ pickUpAddress.street }, ${ pickUpAddress.city }, ${ pickUpAddress.state } ${ pickUpAddress.zipcode }` }
          legend="Pick Up Address"
        />
      }
      {
        willDrop &&
        <ListItem
          ripple={ false }
          leftIcon={ <FontIcon value="pin_drop" /> }
          caption={ `${ dropOffAddress.street }, ${ dropOffAddress.city }, ${ dropOffAddress.state } ${ dropOffAddress.zipcode }` }
          legend="Pick Up Address"
        />
      }
    </React.Fragment>
  )
}

const ExtraInfo = props => (
  <React.Fragment>
  {
    props.message
    ?
    <List>
      <Title title="Extra Information" />
      <ListItem
        caption={ props.message }
        ripple={ false }
        legend="Special Message"
      />
    </List>
    : null
  }
  </React.Fragment>
)

const ReviewPayment = props => {
  const {
    ticketQty,
    luggageQty,
    to,
    payment,
    frm,
    willDrop,
    willPick,
    pickUpAddress,
    dropOffAddress,
    ticketType
  } = props

  const { luggagePrice, prices } = configData
  const { fee, extraFee, totalAmount } = payment



  let dropOffFee = 0
  let pickUpFee = 0

  if(willPick) {
    pickUpFee = getExtraPrice(prices[ frm ], pickUpAddress.zipcode)
  }

  if(willDrop) {
    dropOffFee = getExtraPrice(prices[ to ], dropOffAddress.zipcode)
  }

  const totalAmoutCaption = `    $${ parseFloat(totalAmount).toFixed(2) }`
  const feesCaption = `    $${ parseFloat(fee).toFixed(2) } (${ ticketQty } tickets x ${ prices.default }) `
  const extraFeesCaption = `$${ parseFloat(extraFee).toFixed(2) }`

  const luggageFeeCaption = `    $${ parseFloat(luggagePrice * luggageQty).toFixed(2) } (${ luggageQty } extra luggage x ${ parseFloat(luggagePrice).toFixed(2) })`
  const extraCaption = willPick
                      ? willDrop
                      ? `    $${ parseFloat(pickUpFee).toFixed(2) } Pick Up + $${ parseFloat(dropOffFee).toFixed(2) } Drop Off fees`
                      : `    $${ parseFloat(pickUpFee).toFixed(2) } Pick Up fee`
                      : willDrop
                      ? `    $${ parseFloat(dropOffFee).toFixed(2) } Drop off fee`
                      : ''
  // const extraExtraCaption = ` $${ parseFloat(packFee).toFixed(2) } Package fee (${ packageQty } packages)`

  return (
    // <List className="review-payment">
      <List className="review-payment list">
        <ListItem
          className="review-fee"
          leftIcon={ <MdAttachMoney /> }
          ripple={ false }
          itemContent={ <div>Total Amount:<span className="total-amount-cap">{ totalAmoutCaption }</span></div> }
        />
        {
          ticketType === 'REGULAR' &&
          <React.Fragment>
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
            <ListDivider />
            <ListItem
              className="review-fee"
              ripple={ false }
              itemContent={ <div><div className="small-caption">Luggage Fee:</div> { luggageFeeCaption }</div> }
              // caption={  }
            />
            <ListItem
              className="review-fee"
              ripple={ false }
              itemContent={ <div><div className="small-caption">Drop/Pick fees:</div>{ extraCaption }</div> }
            />
          </React.Fragment>
        }
      </List>
    // </List>
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
        {
          props.id ?
          <Button
            onClick={ props.onModify }
            icon={ <MdBuild /> }
            label="Modify"
          />
          :
          <Button
            // raised
            type="submit"
            icon={ <MdThumbUp /> }
            label="Accept"
          />
        }
        {
          props.isModify &&
          <Button
            onClick={ props.onDelete }
            label="Delete"
            icon={ <MdDeleteForever/> }
          />
        }
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
      <ExtraInfo { ...props} />
      <Title title="Payment Information" />
      <ReviewPayment { ...props } />
      <ListDivider />
      <ReviewActions { ...props } />
    </List>
  )
}

export default TicketReview
