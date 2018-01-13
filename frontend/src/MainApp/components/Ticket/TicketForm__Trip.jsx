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

const Title = props => (
  <React.Fragment>
    <CardTitle title={ props.title } />
    <ListDivider />
  </React.Fragment>
)

const TimeInfo = props => {
  const { date, time } = props

  return (
    <List className="address-trip-info time" theme={ theme.listItem }>
      <ListItem ripple={ false }>
        <DatePicker
          autoOk
          icon={ <MdEventAvailable /> }
          minDate={ getMinDate() }
          value={ date }
          onChange={ val => props.onChange(val, 'date') }
        />
      </ListItem>
      <ListItem ripple={ false }>
        <FontIcon value="timer" />
        <Dropdown
          allowBlank={ false }
          label="Departure Time"
          source={ configData.times }
          value={ time }
          onChange={ val => props.onChange(val, 'time') }
        />
      </ListItem>
    </List>
  )
}

const TripInfo = props => {
  const { ticketQty, luggageQty, to, frm } = props

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
            hint="How many tickets?"
            value={ ticketQty }
            // disabled={ isModify }
            onChange={ val => props.onChange(onlyNumber(val), 'ticketQty') }
          />
        </ListItem>
        <ListItem ripple={ false }>
          <p>Luggage:</p>
          <Input
            required
            type="number"
            label="Luggage"
            hint="How Many?"
            value={ luggageQty }
            onChange={ val => props.onChange(onlyNumber(val), 'luggageQty') }
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
            // disabled={ isModify }
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
            // disabled={ isModify }
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

const AddressForm = props => {
  const { willProp, prop, propName, onChangePropName, propClass, propCaption } = props

  return (
    <List className={ `address-pick-drop ${ propClass }` }>
      <Title title={ `${ propCaption } Information` } />
      <ListCheckbox
        caption={ `Will ${ propCaption }?` }
        checked={ willProp }
        onChange={ val => props.onChange(val, propName) }
      />
      {
        willProp &&
        <React.Fragment>
          <Input
            label="Street"
            value={ prop.street }
            onChange={ val => props.onChange(val, onChangePropName, 'street')}
          />
            <Input 
            label="City"
            value={ prop.city }
            onChange={ val => props.onChange(val, onChangePropName, 'city')}
          />
          <Autocomplete
            multiple={ false }
            source={ configData.stateCodes }
            value={ prop.state }
            onChange={ val => props.onChange(val, onChangePropName, 'state') }
            direction="down"
            label="State"
            selectedPosition="below"
          />
          <Input 
            label="ZIP Code"
            value={ prop.zipcode }
            onChange={ val => props.onChange(onlyNumber(val), onChangePropName, 'zipcode')}
            maxLength={ 5 }
          />
        </React.Fragment>
      }
    </List>
  )
}

const AddressInfo = props => (
  <React.Fragment>
    <AddressForm
      willProp={ props.willPick }
      prop={ props.pickUpAddress }
      propName={ 'willPick' }
      onChangePropName={ 'pick' }
      propClass={ 'pick' }
      propCaption={ 'Pick Up' }
      onChange={ props.onChange }
    />
    <AddressForm
      willProp={ props.willDrop }
      prop={ props.dropOffAddress }
      propName={ 'willDrop' }
      onChangePropName={ 'drop' }
      propClass={ 'drop' }
      propCaption={ 'Drop Off' }
      onChange={ props.onChange }
    />
  </React.Fragment>
)

const PackageInfo = props => {
  const { hasPackage, onChange, packageInfo, packageQty } = props
  const { weight, message, fee } = packageInfo

  return (
    <List className="package-info">
      <Title title="Package Information" />
      <ListCheckbox
        caption="Is this a package?"
        checked={ hasPackage }
        onChange={ val => props.onChange(val, 'hasPackage') }
      />
      {
        hasPackage &&  
        <React.Fragment>
          <Input
            type="number"
            label="Packages"
            min="0"
            hint="How many package"
            value={ packageQty }
            onChange={ val => onChange(onlyNumber(val), 'packageQty') }
          />
          {
            packageQty === 1 &&
            <Input
              type="number"
              label="Weight"
              min="0"
              hint="Package Weight"
              value={ weight }
              onChange={ val => onChange(onlyNumber(val), 'package', 'weight') }
            />
          }
          <Input
            type="text"
            label="Message"
            hint="Message specific for the package(s)"
            value={ message }
            onChange={ val => onChange(val, 'package', 'message') }
          />
          <Input
            type="number"
            label="Fee"
            min="0"
            hint="Fee to charge"
            value={ fee }
            onChange={ val => onChange(onlyNumber(val), 'package', 'fee') }
          />
        </React.Fragment>
      }
    </List>
  )
}

class TicketAddress extends Component {
  render() {
    return (
      <List className="ticket-form-address">
        <Title title="Time Information" />
        <TimeInfo { ...this.props } />
        <Title title="Trip Information" />
        <TripInfo { ...this.props } />
        <AddressInfo { ...this.props } />
        <PackageInfo { ...this.props } />
      </List>
    )
  }
}

export default TicketAddress