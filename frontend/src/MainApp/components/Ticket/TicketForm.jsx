import React, { Component } from 'react'
import axios from 'axios'

import TicketTabs from './TicketTabs'
import configData from '../../config/config-values.json'
import { verifyCard } from '../../utils'

import './ticket-form.scss'

const url = 'http://localhost:8000/api/v1/ticket'

const defaultState = {
  id : '',
  isModify : false,
  title : 'Create',

  // Person Form Fields
  person : {
    firstname : '',
    lastname : '',
    email : '',
    phoneNumber : '',
  },

  // Address Form Fields
  date : new Date(new Date().setHours(0,0,0,0)),
  time : 3,
  willPick : false,
  willDrop : false,
  pickUpAddress : {
    street : '',
    city : '',
    state : '',
    zipcode : ''
  }, 
  dropOffAddress : {
    street : '',
    city : '',
    state : '',
    zipcode : '',
  },
  from : 'NY',
  to : 'PA',
  /////////

  // Payment From Fields
  payment : {
    type : 'CASH',
    isCard : false,
    cardLastDigits : '',
    cardNumber : '',
    expirationDate : '',
    cvc : '',
  },
  // Per Ticket Information
  extraFee : 0.0,
  fee : 0.0,
  totalAmount : 0,
  /////////////////

  // Ticket Information
  // ticketNumber : 0,
  ticketMany : 1,
  luggage : 0,
  ///////////
  status : 'NEW',
  isLocal : true,
}
/*
const myInfo  = {
  id : '',
  title : 'Create',

  // Person Form Fields
  person : {
    firstname : 'Jenky',
    lastname : 'Nolasco',
    email : 'jenky@nolasco.com',
    phoneNumber : '3479742990',
  },

  // Address Form Fields
  date : new Date(new Date('2018-05-11').setHours(0,0,0,0)),
  time : 11,
  willPick : true,
  willDrop : true,
  pickUpAddress : {
    street : '116  Sherman Ave',
    city : 'New York',
    state : 'NY',
    zipcode : '10034'
  }, 
  dropOffAddress : {
    street : '172 Smith Street',
    city : 'Brooklyn',
    state : 'NY',
    zipcode : '10034',
  },
  from : 'NY',
  to : 'NY',
  /////////

  // Payment From Fields
  payment : {
    type : 'CARD',
    isCard : true,
    totalAmount : 54.54,
    cardLastDigits : '4242',
    cardNumber : '4242424242424242',
    expirationDate : '0120',
    cvc : '123',
  },
  // Per Ticket Information
  extraFee : 50.5,
  fee : 4.04,
  /////////////////

  // Ticket Information
  // ticketNumber : 0,
  ticketMany : 4,
  luggage : 3,
  ///////////
}
*/
const formatTicketData = ticket => {
  const { person, pickUpAddress, dropOffAddress } = ticket

  return {
    id : ticket.id,
    person : {
      firstname : person.firstname,
      lastname : person.lastname,
      email : person.email,
      phoneNumber : person.phoneNumber,
    },
    date : new Date(ticket.date),
    time : ticket.time,
    willPick : ticket.willPick,
    willDrop : ticket.willDrop,
    pickUpAddress : {
      street : pickUpAddress.street,
      city : pickUpAddress.city,
      state : pickUpAddress.state,
      zipcode : pickUpAddress.zipcode
    }, 
    dropOffAddress : {
      street : dropOffAddress.street,
      city : dropOffAddress.city,
      state : dropOffAddress.state,
      zipcode : dropOffAddress.zipcode
    },
    from : ticket.from,
    to : ticket.to,
    oldDate : new Date(ticket.date),
    oldTime : ticket.time
  }
}

const reformatTicketData = tickt => {
  return {
    isLocal : true,
    frm : tickt.from,
    to : tickt.to,
    departureDate : tickt.date,
    departureTime : tickt.time,
    howMany : tickt.ticketMany,
    luggage : tickt.luggage,
    firstname : tickt.person.firstname,
    lastname : tickt.person.lastname,
    phoneNumber : tickt.person.phoneNumber,
    email : tickt.person.email,
    willPick : tickt.willPick,
    willDrop : tickt.willDrop,
    pickUpAddress : tickt.willPick ? tickt.pickUpAddress : null,
    dropOffAddress : tickt.willDrop ? tickt.dropOffAddress : null,
    totalAmount : tickt.totalAmount,
    cardBrand : tickt.payment.isCard ? verifyCard(tickt.payment.cardNumber) : '',
    cardLastDigits : tickt.payment.isCard ? tickt.payment.cardNumber.slice(-4) : '',
    paymentType : tickt.payment.isCard ? 'CARD' : 'CASH', 
    status : tickt.status,
    fee : parseFloat(tickt.fee),
    extraFee : parseFloat(tickt.extraFee),
  }
}

class TicketForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ...defaultState,
      // ...myInfo
    }

    this._onChange = this._onChange.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
    this._onCancel = this._onCancel.bind(this)
    this._calculateFees = this._calculateFees.bind(this)
  }

  async _onSubmit(e) {
    e.preventDefault()

    const { history } = this.props
    const { title, oldDate, oldTime, isModify, ...rest } = this.state

    const body = reformatTicketData(rest)
    
    try {
      if(isModify) {
        if(oldDate && oldTime && (new Date(body.date).getDate() !== new Date(oldDate).getDate() || body.time !== oldTime )) body.status = 'REDEEMABLE'

        // const { data } = await axios.put(`${ url }/modify/`)
      }
      const { data } = await axios.post(`${ url }/insert`, body)
      
      if(data) {
        return history.push('/ticket')
      }
    } catch (e) {
      console.log(e)
    }

    return console.log('Something happened...')
  }

  _calculateFees(to, luggage, ticketMany) {
    let { extraFee, fee, totalAmount } = this.state

    const prices = configData.prices[ to ]
                  ? configData.prices[ to ]
                  : configData.prices.default

    // console.log("Vars => ", luggage, prices)
    const extraLuggage = luggage - prices.minLuggage
    // console.log('Extra luggage => ', extraLuggage)
    extraFee = prices.extraFee * (extraLuggage > 0 ? extraLuggage : 0) 
    fee = prices.fee * ticketMany

    totalAmount = extraFee + fee

    return { totalAmount, extraFee, fee }
  }

  _onCancel() {
    const { history } = this.props

    return history.push('/')
  }

  _onChange(val, name, extra) {
    const state = { ...this.state }
    const {
      payment,
      person,
      pickUpAddress,
      dropOffAddress,
      ticketMany
    } = state

    let {
      luggage,
      to
    } = state

    switch(name) {
      case 'pick' :
        pickUpAddress[ extra ] = val
        break
      case 'drop' :
        dropOffAddress[ extra ] = val
        break
      case 'person' :
        person[ extra ] = val
        break
      case 'payment' :
        payment[ extra ] = val
        if(extra === 'cardNumber') payment.cardLastDigits = val.slice(-4)
        break
      case 'luggage':
        luggage = val
        break
      case 'to' :
        to = val
        // const { prices } = configData
        // let fees = prices[ val ]
        // const extraLuggage = state.luggage - fees.minLuggage

        // if(!fees) fees = prices.default

        // state.fee = fees.fee
        // if(extraLuggage > 0) state.extraFee = extraLuggage * fees.extraFee

        // paymentType.totalAmount = state.ticketMany * (state.fee + state.extraFee)
        break
      default :
        break
    }

    const fees = this._calculateFees(to, luggage, ticketMany)

    return this.setState({
      ...state,
      [ name ] : val,
      person : { ...person },
      pickUpAddress : { ...pickUpAddress },
      dropOffAddress : { ...dropOffAddress },
      payment : { ...payment },
      to,
      luggage,
      ...fees
    })
  }

  async componentWillMount() {
    const { state } = this.props.location
    let { to, luggage, ticketMany } = this.state

    const params = this._calculateFees(to, luggage, ticketMany)
    let ticketData = null

    if(state) {
      params.title = state.title
      params.isModify = state.isModify

      const id = state.ticket

      try {
        const { data } = await axios.get(`${ url }/${ id }`)

        if(data.ok) {
          ticketData = { ...formatTicketData(data.data) }
          console.log(ticketData)
        }
        else this.props.history.goBack()
      } catch (e) {
        console.log('Something Happened....')
        console.log(e)
        this.props.history.goBack()
      }
      // Do axios in here
    }

    this.setState({ ...params, ...ticketData })
  }

  render() {
    return (
      <form onSubmit={ this._onSubmit }>
        <TicketTabs
          { ...this.state }
          onChange={ this._onChange }
          onCancel={ this._onCancel }
        />
      </form>
    )
  }
}

export default TicketForm