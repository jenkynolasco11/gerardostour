import React, { Component } from 'react'

import TicketForm from './TicketForm'

import './ticket.scss'

class Body extends Component {
  constructor(props) {
    super(props)

    const { title, staticContext, location, history, match, ...rest } = props

    this.state = { ...rest }
    
    this._onInputChange = this._onInputChange.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
  }
  
  _onSubmit() {

  }

  _onInputChange(val, name) {
    this.setState({ [ name ] : val })
  }

  render() {
    const inputs = this.state
    const onSubmit = this._onSubmit
    const onInputChange = this._onInputChange
    const title = this.props.title
    
    return (
      <div className="ticket-form">
        <TicketForm { ...{ title, inputs, onInputChange, onSubmit }}/>
      </div>
    )
  }
}

Body.defaultProps = {
  firstname : '',
  lastname : '',
  phoneNumber : '',
  luggage : 0,
  willPick : false,
  willDrop : false,
  pickUpAddress : '',
  dropOffAddress : '',
  title : 'Add Tickets'
  // total : '',
}

export default Body