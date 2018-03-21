import React, { Component } from 'react'
import Dialog from 'react-toolbox/lib/dialog/Dialog'
import FontIcon from 'react-toolbox/lib/font_icon/FontIcon'

import TicketTabs from './TicketForm__Tabs'
import configData from '../../config/config-values.json'
import { /*formatTicketData, reformatTicketData,*/ getExtraPrice } from './utils'

import './ticket-form.scss'

const defaultState = {
  // general info
    isLocal : true,
    ticketQty : 1,
    luggageQty : 0,
    ticketType : 'REGULAR',
    id : 0,
    ride : -1,

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

    // Special Info
    message : '',
    specialFee : 0,

    // // VIP Fee
    // vipMessage : '',
    // vipFee : 0,

    // // Special Fee
    // specialMessage : '',
    // specialFee : 0,

    // // Airport Fee
    // airportMessage : '',
    // airportFee : 0
}

// const myInfo = {
//   // general info
//   isLocal : true,
//   ticketQty : 1,
//   luggageQty : 0,
//   ticketType : 'SPECIAL',

//   ride : -1,

//   // Person details
//   person : {
//     firstname : 'Jenky',
//     lastname : 'Nolasco',
//     phoneNumber : '3479742990',
//     email : 'jenky.nolasco@gmail.com',
//   },

//   // Trip details
//   willPick : true,
//   willDrop : false,
//   pickUpAddress : {
//     street : '116 Sherman Ave',
//     city : 'New York',
//     state : 'NY',
//     zipcode : 10034
//   },
//   dropOffAddress : {
//     street : '',
//     city : '',
//     state : '',
//     zipcode : ''
//   },
//   frm : 'NY',
//   to : 'PA',
//   date : new Date(2018, 0, 19),
//   time : 11,

//   // Receipt details
//   payment : {
//     fee : 90,
//     extraFee : 15,
//     totalAmount : 105,
//     cardBrand : 'VISA',
//     paymentType : 'CARD',
//     cardLastDigits : '4242',

//     // App settings
//     expirationDate : '',
//     cvc : '',
//     isCard : false,
//     cardNumber : '',
//   },

//   // Special Info
//   message : 'Handle with care',
//   specialFee : 40,
// }

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
  state = { ...defaultState }

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

    console.log(data)

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
      ticketType,
      specialFee
    } = obj

    if(ticketType !== 'REGULAR') return { totalAmount : specialFee, fee : specialFee, extraFee : 0 }

    // const packFee = packageInfo.fee
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
    // totalAmount += hasPackage ? packFee : 0

    extraFee += parseFloat(luggageFee + pickFee + dropFee)
    // extraFee += hasPackage ? packFee : 0

    const fees = { totalAmount, fee, extraFee }

    return fees
  }

  _onCancel() {
    return this.props.closeForm()
  }

  _onChange(val, name, extra) {
    const state = { ...this.state }
    const { payment, person, pickUpAddress, dropOffAddress } = state

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
      case 'ticketType':
        newProp.message = ''
        newProp.specialFee = 0
        newProp.ticketType = val
        if(val === 'SPECIAL') {
          newProp.ticketQty = 1
          newProp.luggageQty = 0
        }
        break
      // case 'package' :
      //   packageInfo[ extra ] = val
      //   break
      // case 'packageQty' :
      //   if(val > ticketQty) {
      //     newProp.packageQty = ticketQty
      //     break
      //   }

      //   newProp.packageQty = val
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
      // packageInfo : { ...packageInfo },
    }

    return this.setState({ ...newState }, () => {
      const { payment } = this.state
      const fees = this._calculateFees()

      return this.setState({ payment : { ...payment, ...fees }})
    })
  }

  componentWillMount() {
    this.setState({ ...defaultState })
  }

  componentDidMount() {
    const { ticket = {} } = this.props
    const { payment } = this.state

    return this.setState({ ...defaultState, payment : { ...payment, ...this._calculateFees() }, ...ticket, isModify : !!ticket.id })
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

// const TicketFormBottom = props => {
//   return (
//     <List className="review-actions" style={{ position : 'absolute', bottom : 0 }}>
//       <p> Save Ticket? </p>
//       <CardActions>
//         <Button
//           // raised
//           icon={ <MdThumbDown /> }
//           onClick={ props.onCancel }
//           label="Cancel"
//         />
//         <Button
//           // raised
//           type="submit"
//           icon={ <MdThumbUp /> }
//           label="Accept"
//         />
//       </CardActions>
//     </List>
//   )
// }

const Form = props => (
  <Dialog
    className="ticket-form dialog"
    active={ props.active }
  >
    <TicketFormTop { ...props } />
    <TicketForm { ...props } />
    {/* <ListDivider />
    <TicketFormBottom { ...props } /> */}
  </Dialog>
)

export default Form
