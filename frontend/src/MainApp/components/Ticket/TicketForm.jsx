import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Dialog from 'react-toolbox/lib/dialog/Dialog'
import FontIcon from 'react-toolbox/lib/font_icon/FontIcon'
// import { MdClose } from 'react-icons/lib/md'

// import axios from 'axios'

import TicketTabs from './TicketForm__Tabs'
import configData from '../../config/config-values.json'
import { /*formatTicketData, reformatTicketData,*/ getExtraPrice } from './utils'
import { submitTicketData } from '../../store-redux/actions'

import './ticket-form.scss'

const defaultState = {
  id : 0,
  _isLocal : true,
  // title : 'Create',
  // isModify : false,
  // showDialog : false,

  // Person Form Fields
  person : {
    firstname : '',
    lastname : '',
    email : '',
    phoneNumber : '',
  },

  // Address Form Fields
  departureDate : new Date(new Date().setHours(0,0,0,0)),
  departureTime : 3,
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
  frm : 'NY',
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

  howMany : 1,
  luggage : 0,
  ///////////
  status : 'NEW',
  redeemedCount : 0,
}
//*
const myInfo  = {
  id : '',
  // title : 'Create',

  // Person Form Fields
  person : {
    firstname : 'Jenky',
    lastname : 'Nolasco',
    email : 'jenky@nolasco.com',
    phoneNumber : '3479742990',
  },

  // Address Form Fields
  departureDate : new Date(new Date('2018-11-11').setHours(0,0,0,0)),
  departureTime : 11,
  willPick : true,
  willDrop : true,
  pickUpAddress : {
    street : '116 Sherman Ave',
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
  frm : 'NY',
  to : 'NY',
  /////////

  // Payment From Fields
  payment : {
    type : 'CARD',
    isCard : true,
    cardLastDigits : '4242',
    cardNumber : '4242424242424242',
    expirationDate : '0120',
    cvc : '123',
  },
  // Per Ticket Information
  extraFee : 0.0,
  fee : 0.0,
  totalAmount : 0.0,
  /////////////////

  // Ticket Information
  // ticketNumber : 0,
  howMany : 4,
  luggage : 3,
  ///////////
}
// */

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

    const data = { ...this.state }

    await this.props.submitTicket(data)

    this.props.onSubmitData()
    return this.props.closeForm()
  }

  _calculateFees(ticket = {}) {
    const obj = { ...this.state, ...ticket }

    let {
      to,
      frm,
      luggage,
      howMany,
      // extraFee,
      // fee,
      // totalAmount,
      dropOffAddress,
      pickUpAddress,
      willDrop,
      willPick
    } = obj

    const { luggagePrice, prices } = configData

    let totalAmount = 0
    let extraFee = 0
    let fee = 0 // prices.default
    let pickFee = 0
    let dropFee = 0
    let luggageFee = 0

    if(willPick) pickFee += getExtraPrice(prices[ frm ], pickUpAddress.zipcode)

    if(willDrop) dropFee += getExtraPrice(prices[ to ], dropOffAddress.zipcode)

    fee += parseFloat(howMany * prices.default)
    luggageFee += (luggagePrice * luggage)

    totalAmount += parseFloat(fee + luggageFee + pickFee + dropFee)
    extraFee += parseFloat(luggageFee + pickFee + dropFee)

    const fees = { totalAmount, fee, extraFee }

    return fees
  }

  _onCancel() {
    // const { history } = this.props

    // return history.push('/')
  }

  _onChange(val, name, extra) {
    const state = { ...this.state }
    const {
      payment,
      person,
      pickUpAddress,
      dropOffAddress,
      // howMany
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

        // paymentType.totalAmount = state.howMany * (state.fee + state.extraFee)
        break
      default :
        break
    }

    // const fees = this._calculateFees(/*to, luggage, howMany*/)
    // console.log(...fees)

    return this.setState({
      ...state,
      [ name ] : val,
      person : { ...person },
      pickUpAddress : { ...pickUpAddress },
      dropOffAddress : { ...dropOffAddress },
      payment : { ...payment },
      to,
      luggage,
      // ...fees
    }, () => {
      const fees = this._calculateFees()

      return this.setState({ ...fees })
    })
  }

  componentWillMount() {
    // Check this out later
    return this.setState({ ...this._calculateFees() })
  /*
    const { ticket = {} } = this.props

    if(ticket) {

      // TODO : Show ticket ID, request payment info, set date properly
      ticket.date = new Date(ticket.date)

      setTimeout(async () => {
        try {
          const { data } = await axios.get(`${ url }/ticket/${ ticket.id }/receipt`)
          
            // TODO : 
            // Took this away cuz I don't want to modify tickets.
            // I will delete the receipt, then create a new one
          

        } catch (e) {
          console.log(e)
        }
      }, 100)
    }

    const fees = this._calculateFees(ticket)
    
    return this.setState({ ...ticket, ...fees })
    // */

    // const { state } = this.props.location
    // let { to, luggage, howMany } = this.state

    // const params = this._calculateFees()
    // let ticketData = null

    // if(state) {
    //   params.title = state.title
    //   params.isModify = state.isModify
    //   // if(params.isModify) params.status = 'REDEEMED'

    //   const id = state.ticket

    //   try {
    //     const { data } = await axios.get(`${ url }/ticket/${ id }`)

    //     if(data.ok) {
    //       ticketData = { ...formatTicketData(data.data) }
    //       console.log(ticketData)
    //     }
    //     // else this.props.history.goBack()
    //   } catch (e) {
    //     console.log('Something Happened....')
    //     console.log(e)
    //     // this.props.history.goBack()
    //   }
    //   // Do axios in here
    // }
    // console.log(params)
    // console.log(ticketData)
    // this.setState({ ...ticketData, ...params, })
  }

  render() {
    // console.log(this.state)

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
    // theme={ theme }
  >
    <TicketFormTop { ...props } />
    <TicketForm { ...props } />
  </Dialog>
)

const mapDispatchToProps = dispatch => bindActionCreators({
  submitTicket : data => submitTicketData(data)
}, dispatch)

export default connect(null, mapDispatchToProps)(Form)