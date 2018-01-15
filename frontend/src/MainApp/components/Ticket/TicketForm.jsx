import React, { Component } from 'react'
import Dialog from 'react-toolbox/lib/dialog/Dialog'
import FontIcon from 'react-toolbox/lib/font_icon/FontIcon'

import TicketTabs from './TicketForm__Tabs'
import configData from '../../config/config-values.json'
import { /*formatTicketData, reformatTicketData,*/ getExtraPrice } from './utils'
// import { submitTicketData } from '../../store-redux/actions'

import './ticket-form.scss'

const defaultState = {
  // general info
    isLocal : true,
    ticketQty : 1,
    
    // Person details
    person : {
      firstname : '',
      lastname : '',
      phoneNumber : '',
      email : '',
    },
  
    // Trip details
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
      zipcode : ''
    },
    frm : 'NY',
    to : 'PA',
    date : new Date(new Date().setHours(0,0,0,0)),
    time : 3,
  
    // Receipt details
    payment : {
      fee : 0,
      extraFee : 0,
      totalAmount : 0,
      paymentType : 'CASH',
      cardBrand : '',
      cardLastDigits : '',
    },
  
    luggageQty : 0,
  
    // Package details
    hasPackage : false,
    packageInfo : {
      weight : 0,
      message : '',
      fee : 0
    }
}

const myInfo = {
  // general info
  isLocal : true,
  ticketQty : 3,
  luggageQty : 1,  
  // Person details
  person : {
    firstname : 'Jenky',
    lastname : 'Nolasco',
    phoneNumber : '3479742990',
    email : 'jenky.nolasco@gmail.com',
  },

  // Trip details
  willPick : true,
  willDrop : false,
  pickUpAddress : {
    street : '116 Sherman Ave',
    city : 'New York',
    state : 'NY',
    zipcode : 10034
  },
  dropOffAddress : {
    street : '',
    city : '',
    state : '',
    zipcode : ''
  },
  frm : 'NY',
  to : 'PA',
  date : new Date('2018-05-12'),
  time : 13,

  // Receipt details
  payment : {
    fee : 90,
    extraFee : 15,
    totalAmount : 105,
    cardBrand : 'VISA',
    paymentType : 'CARD',
    cardLastDigits : '4242',

    // App settings
    expirationDate : '',
    cvc : '',
    isCard : false,
    cardNumber : '',
  },

  // Package details
  packageQty : 1,
  hasPackage : true,
  packageInfo : {
    weight : 43,
    message : 'Handle with care',
    fee : 40
  }
}

// TODO : Make a validation function to validate every field in the form
const checkValidation = state => {
  for(const key in state) {
    switch(key) {
      case 'person':
        if(!checkValidation(state.person)) return false
        break
      case 'willPick':
        if(state.willPick && !checkValidation(state.pickUpAddress)) return false
        break
      case 'willDrop':
        if(state.willlDrop && !checkValidation(state.dropOffAddress)) return false
        break
      // case 'payment':
      //   if(state.payment.isCard && )
      //   break
      default:

        break
    }
  }

  return true
}

class TicketForm extends Component {
  state = { ...defaultState/*, ...myInfo*/ }

  constructor(props) {
    super(props)

    this._onChange = this._onChange.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
    this._onCancel = this._onCancel.bind(this)
    this._calculateFees = this._calculateFees.bind(this)
  }

  async _onSubmit(e) {
    e.preventDefault()

    const data = { ...this.state }

    // console.log(data)

    await this.props.submitTicket(data)

    this.props.onSubmitData()
    return this.props.closeForm()
  }

  _calculateFees(ticket = {}) {
    const obj = { ...this.state, ...ticket }

    let {
      to,
      frm,
      luggageQty,
      ticketQty,
      dropOffAddress,
      pickUpAddress,
      willDrop,
      willPick,
      packageInfo,
      hasPackage
      // packageQty
    } = obj

    const packFee = packageInfo.fee
    const { luggagePrice, prices } = configData

    let totalAmount = 0
    let extraFee = 0
    let fee = 0 // prices.default
    let pickFee = 0
    let dropFee = 0
    let luggageFee = 0

    if(willPick) pickFee += getExtraPrice(prices[ frm ], pickUpAddress.zipcode)

    if(willDrop) dropFee += getExtraPrice(prices[ to ], dropOffAddress.zipcode)

    fee += parseFloat(ticketQty * prices.default)
    luggageFee += (luggagePrice * luggageQty)

    totalAmount += parseFloat(fee + luggageFee + pickFee + dropFee)
    totalAmount += hasPackage ? packFee : 0

    extraFee += parseFloat(luggageFee + pickFee + dropFee)
    extraFee += hasPackage ? packFee : 0

    const fees = { totalAmount, fee, extraFee }
    
    // console.log(fees)
    
    return fees
  }

  _onCancel() {
    return this.props.closeForm()
  }

  _onChange(val, name, extra) {
    const state = { ...this.state }
    const { payment, person, pickUpAddress, dropOffAddress, packageInfo, ticketQty } = state

    const newProp = {}

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
      case 'package' :
        packageInfo[ extra ] = val
        break
      case 'packageQty' :
        if(val > ticketQty) {
          newProp.packageQty = ticketQty
          break
        }

        newProp.packageQty = val
        break
      default :
        newProp[ name ] = val
        break
    }

    const newState = {
      ...state,
      ...newProp,
      person : { ...person },
      pickUpAddress : { ...pickUpAddress },
      dropOffAddress : { ...dropOffAddress },
      payment : { ...payment },
      packageInfo : { ...packageInfo },
    }

    return this.setState({ ...newState }, () => {
      const { payment } = this.state
      const fees = this._calculateFees()

      return this.setState({ payment : { ...payment, ...fees }})
    })
  }

  componentWillMount() {
    const { payment } = this.state

    return this.setState({ payment : { ...payment, ...this._calculateFees() }})
  }

  render() {
    return (
      <form onSubmit={ this._onSubmit }>
        <TicketTabs
          { ...this.state }
          onChange={ this._onChange }
          onCancel={ () => this.props.closeForm() }
        />
      </form>
    )
  }
}

const TicketFormTop = props => (
  <div className="ticket-form-top">
    <FontIcon value="close" onClick={ props.closeForm } style={{ cursor : 'pointer' }} />
    {
      props.ticket
      ? <div>{ `Ticket ID: ${ props.ticket.id }` }</div>
      : null
    }
  </div>
)

const Form = props => (
  <Dialog
    className="ticket-form dialog"
    active={ props.active }
  >
    <TicketFormTop { ...props } />
    <TicketForm { ...props } />
  </Dialog>
)

export default Form