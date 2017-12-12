import React, { Component } from 'react'
import { CardTitle } from 'react-toolbox/lib/card'
import { List, ListItem, ListDivider } from 'react-toolbox/lib/list'
import Dialog from 'react-toolbox/lib/dialog/Dialog'
import axios from 'axios'

import { formatDate, formatHour, formatPhone } from '../../utils'
import './ticket-preview.scss'

const url = 'http://localhost:8000/api/v1/ticket'

class TicketPreview extends Component {
  constructor(props) {
    super(props)

    this.state = {
      date : null,
      dropOffAddress : 'none',
      from : '',
      id : 0,
      luggage : 2,
      person : null,
      pickUpAddress : null,
      receipt : null,
      redeemedCount : 0,
      status : null,
      time : 0,
      to : '',
      willlDrop : false,
      willPick : false,

      luggage : 0,
      cardLastDigits : '',
      paymentType : '',
      totalAmount : 0,
      extraFee : 0,
      fee : 0,
      cardBrand : '',
    }
  }

  async componentWillReceiveProps(props) {
    const { ticketId } = props

    if(!ticketId) return null

    try{
      const { data } = await axios.get(`${ url }/${ ticketId }`)
      const { data2 } = await axios.get(`${ url }/${ ticketId }/receipt`)
      
      if(data.ok && data2.ok) return this.setState({ ...data.data, ...data2.data })
    } catch(e) {
      console.log(e)
    }

    return null
  }

  render() {
    const { onPreviewClose, active } = this.props
    const {
      date,
      dropOffAddress,
      from,
      id,
      luggage,
      person,
      pickUpAddress,
      receipt,
      redeemedCount,
      status,
      time,
      to,
      willDrop,
      willPick,

      // Payment Info
      // luggage,
      cardLastDigits,
      paymentType,
      totalAmount,
      extraFee,
      fee,
      cardBrand,
    } = this.state

    const dialogActions =  [
      { label : 'Close', onClick : onPreviewClose },
      // { label : 'Assign', onClick : this.onAccept }
    ]

    if(!person) return null

    return (
      <Dialog
        // className="ticket-review"
        actions={ dialogActions }
        onEscKeyDown={ onPreviewClose }
        onOverlayClick={ onPreviewClose }
        active={ active }
      >
        <List className="ticket-review">
          <List className="ticket-review-title">
            <CardTitle title="Ticket Review" />
            <ListItem caption={ `ID: ${ id }` }/>
          </List>
          <ListDivider />
          <List className="ticket-review-details" selectable={ false }>
            <ListItem caption={ `Date: ${ formatDate(date) }` }  ripple={ false }/>
            <ListItem caption={ `Hour: ${ formatHour(time) }` }  ripple={ false }/>
          </List>
          <List className="ticket-review-person">
            <CardTitle title="Person Details" />
            <ListDivider />
            <ListItem caption={ `Full Name: ${ person.firstname } ${ person.lastname }` } ripple={ false }/>
            <ListItem caption={ `Phone Number: ${ person.phoneNumber }` } ripple={ false }/>
            { person.email && <ListItem caption={ `Email: ${ person.email }` } ripple={ false }/>}
          </List>
          <List className="ticket-review-trip">
            <CardTitle title="Trip Details" />
            <ListDivider />
            <ListItem caption={ `Going to: ${ to }` } ripple={ false } />
            <ListItem caption={ `From: ${ from }` } ripple={ false } />
            <ListItem caption={ `Luggage on this receipt: ${ luggage }` } ripple={ false } />
            {
              willPick &&
                <ListItem caption={ `Pick Up Address: ${ pickUpAddress.street }, ${ pickUpAddress.city }, ${ pickUpAddress.state } ${ pickUpAddress.zipcode }` } ripple={ false } />
            }
            {
              willDrop &&
                <ListItem caption={ `Pick Up Address: ${ dropOffAddress.street }, ${ dropOffAddress.city }, ${ dropOffAddress.state } ${ dropOffAddress.zipcode }` } ripple={ false } />
            }
          </List>
          <List className="ticket-review-payment">
            <CardTitle title="Payment Information" />
            <ListDivider />
            <ListItem caption={ `Payment Type: ${ paymentType }` } ripple={ false }/>
            {  }
            <ListItem caption={ `Total Amount: ${ totalAmount }` } ripple={ false }/>
            <ListItem caption={ `Total Amount: ${ totalAmount }` } ripple={ false }/>
            
          </List>
          <ListDivider />
        </List>
      </Dialog>
    )
  }
}

export default TicketPreview