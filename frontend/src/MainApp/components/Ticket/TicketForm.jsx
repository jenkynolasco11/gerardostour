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
/*
const defaultState = {
  isLocal : true,
  
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
*/

const defaultState = {
  // general info
    isLocal : true,
    ticketQty : 1,
    packageQty : 0,
    
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
  
    // Ticket details
    hasPackage : false,
    packageInfo : {
      weight : 0,
      message : '',
      fee : 0
    }
}
//*
const myInfo = {
  // general info
  isLocal : true,
  ticketQty : 3,
  packageQty : 0,
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

  // Ticket details
  hasPackage : false,
  packageInfo : {
    weight : 0,
    message : '',
    fee : 0
  }
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
  state = { ...defaultState, ...myInfo }

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
      packageQty
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
    extraFee += parseFloat(luggageFee + pickFee + dropFee + packFee)

    const fees = { totalAmount, fee, extraFee }

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
      // case 'luggage':
      //   luggageQty = val
      //   break
      // case 'to' :
      //   to = val
      //   break
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

const mapDispatchToProps = dispatch => bindActionCreators({
  submitTicket : data => submitTicketData(data)
}, dispatch)

export default connect(null, mapDispatchToProps)(Form)