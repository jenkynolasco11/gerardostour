import React, { Component } from 'react'
import axios from 'axios'

import TicketTabs from './TicketTabs'
import configData from '../../config/config-values.json'
import { verifyCard } from '../../utils'

import './ticket-form.scss'

const url = 'http://localhost:8000/api/v1/ticket'

/**
 * desde----------
hacia----------
fecha_salida----------
hora_salida----------
numero_tickets----------
extras_maletas------
nombre------
apellido------
telefono------
email------
calle_origen----------
cuidad_origen----------
estado_origen----------
zipcode_origen----------
precio_primera_ruta----------
precio_segunda_ruta----------
calle_destino----------
ciudad_destino----------
estado_destino----------
zipcode_destino----------
total_final---------
card_last_digits---------
card_brand---------
recoger---------
dejar---------
fecha_creacion---------

 */

const defaultState = {
  id : '',
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
      ...myInfo
    }

    this._onChange = this._onChange.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
    this._onCancel = this._onCancel.bind(this)
    this._calculateFees = this._calculateFees.bind(this)
  }

  async _onSubmit(e) {
    e.preventDefault()

    const { history } = this.props
    const { title, ...rest } = this.state
    const body = reformatTicketData(rest)
    
    try {
      const { data } = await axios.post(`${ url }/insert`, body)
      console.log(data)
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

  componentWillMount() {
    const { state } = this.props.location
    let { to, luggage, ticketMany } = this.state

    const params = this._calculateFees(to, luggage, ticketMany)

    if(state) {
      params.title = state.title
      // this.setState({ title : state.title })

      // Do axios in here
    }

    this.setState({ ...params })
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