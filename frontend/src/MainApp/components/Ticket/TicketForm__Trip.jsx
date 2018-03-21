import React, { Component } from 'react'
import axios from 'axios'

import { List, ListDivider, ListCheckbox, ListItem } from 'react-toolbox/lib/list'
import { CardTitle } from 'react-toolbox/lib/card'
import Dropdown from 'react-toolbox/lib/dropdown/Dropdown'
import DatePicker from 'react-toolbox/lib/date_picker/DatePicker'
import { Input } from 'react-toolbox/lib/input'
import { Autocomplete } from 'react-toolbox/lib/autocomplete'
import { FontIcon } from 'react-toolbox/lib/font_icon'

import configData, { url } from '../../config/config-values.json'
import { onlyNumber, dropDownData, FormatRideItem } from '../../utils'

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

const ticketOptions = [
  { value : 'REGULAR', label : 'Regular' },
  { value : 'PACKAGE', label : 'Package' },
  { value : 'VIP', label : 'VIP' },
  { value : 'SPECIAL', label : 'Special' },
  { value : 'AIRPORT', label : 'Airport' },
]

const TypeTicket = props => (
  <List>
    <Title title="Ticket Type" />
    <ListItem ripple={ false }>
      <Dropdown
        label="Ticket Type"
        source={ ticketOptions }
        onChange={ e => props.onChange(e, 'ticketType') }
        value={ props.ticketType }
      />
    </ListItem>
  </List>
)

class TimeInfo extends Component{
  state = { rides : [] }

  constructor(props) {
    super(props)

    this._requestRides = this._requestRides.bind(this)
  }

  async _requestRides(date, time) {
    // console.log(date, time)
    let rids = []

    try {
      const { data } = await axios.get(`${ url }/ride/date/${ new Date(date).getTime() }/hour/${ time }`)

      if(data.ok) {
        const { rides } = data.data
        // const [ rid ] = rides

        rids = [].concat({ value : -1, label : 'none' }, rides)
      }

      this.setState({ rides : rids })

      const [ rid ] = rids

      return rid
    } catch (e) {
      console.log(e)
    }
  }

  componentWillReceiveProps(props) {
    const { date, time, ticketType } = props

    if(ticketType === 'SPECIAL' || ticketType === 'AIRPORT') return
    return this._requestRides(date, time)
  }

  componentWillMount() {
    const { date, time, ticketType } = this.props

    if(ticketType === 'SPECIAL' || ticketType === 'AIRPORT') return
    return this._requestRides(date, time)
  }

  render() {
    const { rides } = this.state
    const { date, time, onChange, ride, ticketType } = this.props
    const src = rides.map(dropDownData)

    const source = src.length ? [].concat(src) : [{ value : -1, label : 'none' }]

    return (
      <List className="address-trip-info time" theme={ theme.listItem }>
        <List className="list">
          <ListItem ripple={ false }>
            <FontIcon value="date_range" />
            <DatePicker
              autoOk
              minDate={ getMinDate() }
              value={ new Date(date) }
              onChange={ val => onChange(val, 'date') }
            />
          </ListItem>
          <ListItem ripple={ false }>
            <FontIcon value="timer" />
            <Dropdown
              allowBlank={ false }
              label="Departure Time"
              source={ configData.times }
              value={ time }
              onChange={ val => onChange(val, 'time') }
            />
          </ListItem>
        </List>
        {
          ticketType !== 'SPECIAL' &&
          ticketType !== 'AIRPORT' &&
          <List className="list">
            <ListItem ripple={ false }>
              <FontIcon value="directions_bus"/>
              <Dropdown
                className="ride-select"
                source={ source }
                onChange={ e => onChange(e, 'ride') }
                value={ ride }
                label="Ride"
                allowBlank={ false }
                template={ src.length ? FormatRideItem : null }
              />
            </ListItem>
            <ListItem ripple={ false } />
          </List>
        }
      </List>
    )
  }
}

// BUG-INFO :
// THIS SHOULD ASSIGN A RIDE IF RETRIEVED FROM THE REQUEST WITH DATE AND HOUR
// WHEN THE COMPONENT MOUNTS...
const TripInfo = props => {
  const { ticketQty, luggageQty, to, frm, ticketType } = props
  const isPackage = ticketType === 'PACKAGE'
  const isSpecial = ticketType === 'SPECIAL'
  const isAirport = ticketType === 'AIRPORT'


  return (
    <List className="address-dropdown">
      <List className="list">
        <ListItem ripple={ false }>
          <p>{ !isPackage ? 'Tickets' : 'Packages' }:</p>
          <Input
            min={ 1 }
            max={ 20 }
            required
            type="number"
            label="Tickets"
            hint="How many tickets?"
            value={ ticketQty }
            disabled={ isSpecial }
            onChange={ val => props.onChange(onlyNumber(val), 'ticketQty') }
          />
        </ListItem>
        {
          !isPackage && !isSpecial
          ?
          <ListItem ripple={ false }>
            <p>Luggage:</p>
            <Input
              disabled={ isPackage }
              required
              type="number"
              label="Luggage"
              hint="How Many?"
              value={ luggageQty }
              onChange={ val => props.onChange(onlyNumber(val), 'luggageQty') }
            />
          </ListItem>
          : <ListItem disabled={ true } ripple={ false } />
        }
      </List>
      {
        !isSpecial && !isAirport &&
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
      }
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
    {
      props.ticketType !== 'AIRPORT' &&
      <AddressForm
        willProp={ props.willDrop }
        prop={ props.dropOffAddress }
        propName={ 'willDrop' }
        onChangePropName={ 'drop' }
        propClass={ 'drop' }
        propCaption={ 'Drop Off' }
        onChange={ props.onChange }
      />
    }
  </React.Fragment>
)

const ExtraInfo = props => {
  const { message, specialFee, ticketType, onChange } = props
  const isPackage = ticketType === 'PACKAGE'
  const isVIP = ticketType === 'VIP'
  const isSpecial = ticketType === 'SPECIAL'
  const isAirport = ticketType === 'AIRPORT'

  const isAny = isPackage || isVIP || isSpecial || isAirport

  if(!isAny) return null

  return (
    <List className="special-info">
      <Title title="Fee Information" />
      <Input
        type="number"
        label="Fee"
        min={ 0 }
        hint="How much?"
        value={ specialFee }
        onChange={ val => onChange(onlyNumber(val), 'specialFee') }
      />
      <Input
        type="text"
        label="Message"
        hint="Message specific for this(these) ticket(s)"
        value={ message }
        onChange={ val => onChange(val, 'message') }
      />
    </List>
  )
}

class TicketAddress extends Component {
  render() {
    return (
      <List className="ticket-form-address">
        <TypeTicket { ...this.props } />
        <Title title="Time Information" />
        <TimeInfo { ...this.props } />
        <Title title="Trip Information" />
        <TripInfo { ...this.props } />
        <ExtraInfo { ...this.props } />
        <AddressInfo { ...this.props } />
      </List>
    )
  }
}

export default TicketAddress
