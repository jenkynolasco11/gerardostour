import React, { Component } from 'react'
import Dialog from 'react-toolbox/lib/dialog/Dialog'
import axios from 'axios'

import TicketTabs from './TicketTabs'
import configData from '../../config/config-values.json'
import { formatTicketData, reformatTicketData, getExtraPrice } from './utils'

import './ticket-form.scss'

import { url } from '../../config/config-values.json'
// const url = 'http://localhost:8000/api/v1/ticket'

const defaultState = {
  id : '',
  isModify : false,
  isLocal : true,
  showDialog : false,
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
  redeemedCount : 0,
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
    zipcode : '10128'
  }, 
  dropOffAddress : {
    street : '172 Smith Street',
    city : 'Brooklyn',
    state : 'NY',
    zipcode : '10025',
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
    const { title, oldDate, oldTime, isModify, ...rest } = this.state

    // console.log(this.state)
    let data = null
    const body = reformatTicketData(rest)
    
    try {
      if(isModify) {
        if(oldDate && oldTime && (body.departureDate.getDate() !== oldDate.getDate() || body.departureTime !== oldTime )) body.status = 'REDEEMED'

        // console.log(body)
        data = await axios.put(`${ url }/ticket/modify/`, body)
        console.log(data)

      } else data = await axios.post(`${ url }/ticket/save`, body)
      
      if(data.data.ok) {
        console.log(data)
        return history.push('/ticket')
      }
    } catch (e) {
      console.log(e)
    }

    return console.log('Something happened...')
  }

  _calculateFees() {
    let {
      to,
      from,
      luggage,
      ticketMany,
      // extraFee,
      // fee,
      // totalAmount,
      dropOffAddress,
      pickUpAddress,
      willDrop,
      willPick
    } = this.state

    const { luggagePrice, prices } = configData

    let totalAmount = 0
    let extraFee = 0
    let fee = prices.default

    if(willPick) {
      const extra = getExtraPrice(prices[ from ], pickUpAddress.zipcode)
      // console.log(extra)
      fee += extra
      extraFee += extra
    }

    if(willDrop) {
      const extra = getExtraPrice(prices[ to ], dropOffAddress.zipcode)
      // console.log(extra)
      fee += extra
      extraFee += extra
    }

    // console.log(luggagePrice)
    fee = parseFloat(ticketMany * fee)

    totalAmount += parseFloat(fee + (luggagePrice * luggage))
// console.log(totalAmount)
    extraFee += parseFloat(luggagePrice * luggage)
// console.log(extraFee)
// console.log(fee)
    console.log(extraFee, fee, totalAmount )

    return { totalAmount, fee, extraFee }
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

    const fees = this._calculateFees(/*to, luggage, ticketMany*/)

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
    // let { to, luggage, ticketMany } = this.state

    const params = this._calculateFees()
    let ticketData = null

    if(state) {
      params.title = state.title
      params.isModify = state.isModify
      // if(params.isModify) params.status = 'REDEEMED'

      const id = state.ticket

      try {
        const { data } = await axios.get(`${ url }/ticket/${ id }`)

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
    console.log(params)
    console.log(ticketData)
    this.setState({ ...ticketData, ...params, })
  }

  render() {
    // console.log(this.state)
    const { showDialog } = this.state

    return (
      <form onSubmit={ this._onSubmit }>
        <TicketTabs
          { ...this.state }
          onChange={ this._onChange }
          onCancel={ this._onCancel }
        />
        <Dialog
          active={ showDialog }
        />
      </form>
    )
  }
}

export default TicketForm