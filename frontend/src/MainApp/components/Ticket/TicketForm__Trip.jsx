import React, { Component } from 'react'
import { List, ListDivider, ListCheckbox, ListItem } from 'react-toolbox/lib/list'
import { CardTitle } from 'react-toolbox/lib/card'
import Dropdown from 'react-toolbox/lib/dropdown/Dropdown'
import { MdEventAvailable } from 'react-icons/lib/md'
import DatePicker from 'react-toolbox/lib/date_picker/DatePicker'
import { Input } from 'react-toolbox/lib/input'
import { Autocomplete } from 'react-toolbox/lib/autocomplete'
import { FontIcon } from 'react-toolbox/lib/font_icon'

import configData from '../../config/config-values.json'
import { onlyNumber } from '../../utils'

import theme from './ticket.theme.scss'

const getMinDate = () => {
  const date = new Date()

  date.setDate(date.getDate() - 1)

  return date
}

const Title = props => ([
  <CardTitle key={ 1 } title={ props.title } />,
  <ListDivider key={ 2 }/>
])

const TimeInfo = props => {
  const { departureDate, departureTime } = props

  return (
    <List className="address-trip-info time" theme={ theme.listItem }>
      <ListItem ripple={ false }>
        <DatePicker
          autoOk
          icon={ <MdEventAvailable /> }
          minDate={ getMinDate() }
          value={ departureDate }
          onChange={ val => props.onChange(val, 'date') }
        />
      </ListItem>
      <ListItem ripple={ false }>
        <FontIcon
          value="timer"
        />
        <Dropdown
          allowBlank={ false }
          label="Departure Time"
          source={ configData.times }
          value={ departureTime }
          onChange={ val => props.onChange(val, 'time') }
        />
      </ListItem>
    </List>
  )
}

const TripInfo = props => {
  const { howMany, luggage, to, frm, isModify } = props

  return (
    <List className="address-dropdown">
      <List className="list">
        <ListItem ripple={ false }>
          <p>Tickets:</p>
          <Input
            min="1"
            max="20"
            required
            type="number"
            label="Tickets"
            hint="How Many?"
            value={ howMany }
            disabled={ isModify }
            onChange={ val => props.onChange(val, 'howMany') }
          />
        </ListItem>
        <ListItem ripple={ false }>
          <p>Luggage:</p>
          <Input
            required
            type="number"
            label="Luggage"
            hint="How Many?"
            value={ luggage }
            disabled={ isModify }
            onChange={ val => props.onChange(val, 'luggage') }
          />
        </ListItem>
      </List>
      <List className="list">
        <ListItem ripple={ false }>
          <p>From:</p>
          <Dropdown
            className="address-dropdown from"
            label="From"
            required
            allowBlank={ false }
            disabled={ isModify }
            // template={ typeTemplate }
            source={ configData.routes }
            value={ frm }
            onChange={ val => props.onChange(val, 'frm') }
          />
        </ListItem>
        <ListItem ripple={ false }>
          <p>To:</p>
          <Dropdown
            className="address-dropdown to"
            label="To"
            required
            allowBlank={ false }
            disabled={ isModify }
            // template={ typeTemplate }
            source={ configData.routes }
            value={ to }
            onChange={ val => props.onChange(val, 'to') }
          />
        </ListItem>
      </List>
    </List>
  )
}

const AddressPickUpInfo = props => {
  const { willPick, pickUpAddress } = props

  return (
    <List className="address-pick-drop pick">
      <Title title="Pick Up Information" />
      <ListCheckbox
        caption="Will Pick Up?"
        checked={ willPick }
        onChange={ val => props.onChange(val, 'willPick') }
      />
      {
        willPick && [
          <Input
            key={ 0 }
            label="Street"
            value={ pickUpAddress.street }
            onChange={ val => props.onChange(val, 'pick', 'street')}
          />,
            <Input 
            key={ 1 }
            label="City"
            value={ pickUpAddress.city }
            onChange={ val => props.onChange(val, 'pick', 'city')}
          />,
          <Autocomplete
            multiple={ false }
            key={ 2 }
            source={ configData.stateCodes }
            value={ pickUpAddress.state }
            onChange={ val => props.onChange(val, 'pick', 'state') }
            direction="down"
            label="State"
            selectedPosition="below"
          />,
          <Input 
            key={ 3 }
            label="ZIP Code"
            value={ pickUpAddress.zipcode }
            onChange={ val => props.onChange(onlyNumber(val), 'pick', 'zipcode')}
            maxLength={ 5 }
          />,
        ]
      }
    </List>
  )
}

const AddressDropOffInfo = props => {
  const { willDrop, dropOffAddress } = props

  return (
    <List className="address-pick-drop drop">
      <Title title="Drop Off Information" />
      <ListCheckbox
        caption="Will Drop Off?"
        checked={ willDrop }
        onChange={ val => props.onChange(val, 'willDrop') }
      />
      {
        willDrop && [
          <Input 
            key={ 0 }
            label="Street"
            value={ dropOffAddress.street }
            onChange={ val => props.onChange(val, 'drop', 'street')}
          />,
          <Input 
            key={ 1 }
            label="City"
            value={ dropOffAddress.city }
            onChange={ val => props.onChange(val, 'drop', 'city')}
          />,
          <Autocomplete
            multiple={ false }
            key={ 2 }
            source={ configData.stateCodes }
            value={ dropOffAddress.state }
            onChange={ val => props.onChange(val, 'drop', 'state') }
            direction="down"
            label="State"
            selectedPosition="below"
          />
          ,
          <Input 
            key={ 3 }
            label="ZIP Code"
            value={ dropOffAddress.zipcode }
            onChange={ val => props.onChange(onlyNumber(val), 'drop', 'zipcode')}
            maxLength={ 5 }
          />
        ]
      }
    </List>
  )
}

const AddressInfo = props => {
  return [
    <AddressPickUpInfo key={ 1 } { ...props } />,
    <AddressDropOffInfo key={ 2 } { ...props } />
  ]
}

class TicketAddress extends Component {
  // componentWillMount() {
  // //   const { to } = this.props
  // //   const prices = configData.prices[ to ]
  // //                   ? configData.prices[ to ]
  // //                   : configData.prices.default

  // //   const fee = null
  // //   const extraFee = null

  // //   /*    
  // // const feesTotal = parseFloat(howMany * prices.fee).toFixed(2)
  // // const extraTotal = parseFloat(extraLuggage * prices.extraFee).toFixed(2)

  // // const totalAmoutCaption = `Total Amount : ${ parseFloat(Number(feesTotal) + Number(extraTotal)).toFixed(2) }`
  // // const feesCaption = `${ feesTotal } (${ howMany } tickets x ${ parseFloat(prices.fee).toFixed(2) }) `
  // // const extraFeesCaption = `${ extraTotal } (${ extraLuggage } extra luggage x ${ parseFloat(prices.extraFee).toFixed(2) })`
  // //    */
  // //   this.setState({ extraFee, fee })
  // }

  render() {
    return (
      <List className="ticket-form-address">
        <Title title="Time Information" />
        <TimeInfo { ...this.props } />
        <Title title="Trip Information" />
        <TripInfo { ...this.props } />
        <AddressInfo { ...this.props } />
      </List>
    )
  }
}

export default TicketAddress