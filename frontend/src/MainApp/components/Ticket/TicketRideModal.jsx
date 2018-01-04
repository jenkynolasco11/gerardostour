import React, { Component } from 'react'
import axios from 'axios'
// import { connect } from 'react-redux'

import { MdThumbUp, MdThumbDown } from 'react-icons/lib/md'
import { List, ListDivider, /*ListCheckbox,*/ ListItem } from 'react-toolbox/lib/list'
import { Card, /*CardActions, /*CardMedia,*/ CardTitle, CardActions } from 'react-toolbox/lib/card'
import DatePicker from 'react-toolbox/lib/date_picker/DatePicker'
import Dropdown from 'react-toolbox/lib/dropdown/Dropdown'
import Dialog from 'react-toolbox/lib/dialog/Dialog'

import configData, { url } from '../../config/config-values.json'
import { dropDownData } from '../../utils'
import { FormatRideItem } from './utils'

import './ticket-modal.scss'
import Button from 'react-toolbox/lib/button/Button'

const dateNow = new Date(new Date().setHours(0,0,0,0))
// const dateTmp = new Date()

// dateTmp.setDate(dateNow.getDate() + 1)

// const dateLater = new Date(dateTmp.setHours(0,0,0,0))
const getMinDate = () => new Date(new Date().setDate(dateNow.getDate() - 1))

class TicketRide extends Component {
  state = {
    rides : [],
    date : dateNow,
    time : -1,  // 4 AM
    // dateStart : dateNow,
    // dateFinish : dateLater,
    rideSelected : -1
  }

  constructor(props) {
    super(props)

    this._onSubmitChange = this._onSubmitChange.bind(this)
    this._makeRequest = this._makeRequest.bind(this)
    this._onChange = this._onChange.bind(this)
  }

  async _onSubmitChange() {
    const { rideSelected } = this.state
    // const { onDialogClose } = this.props

    // console.log(rideSelected)
    // console.log(rides)
    // console.log(rides[ rideSelected ])

    this.props.onDialogClose()
    return this.props.onAccept(rideSelected)
  }

  async _makeRequest() {
    const { date, time } = this.state
    let rideSelected = -1
    let rids = []

    try {
      const { data } = await axios.get(`${ url }/ride/date/${ date.getTime() }/hour/${ time }`)

      if(data.ok) {
        const { rides } = data.data
        const [ ride ] = rides

        rids = [].concat(rides)
        rideSelected = ride.id
      }
      
      return this.setState({ rides : rids, rideSelected })
    } catch (e) {
      console.log(e)
    }
  }

  _onChange(val, name) {
    return this.setState({ [ name ] : val }, this._makeRequest)
  }

  _onSelected(val) {
    return this.setState({ rideSelected : val })
  }

//#region lifecycle
  componentWillMount() {
    return this._makeRequest()
  }

  // componentWillReceiveProps(props) {
  //   if()
  // }
//#endregion

  render() {
    const { date, time, rides, rideSelected } = this.state
    const { onDialogClose } = this.props

    const source = rides.map(dropDownData)
    // console.log(rides)

    return (
      // <List>
      <React.Fragment>
        <CardTitle title="Assign Ride" />
        <ListDivider />
        <h3>Select Date and Time</h3>
        <List className="dates">
          <DatePicker
            label="Date"
            autoOk
            minDate={ getMinDate() }
            onChange={ val => this._onChange(val, 'date') }
            value={ date }
          />
          <Dropdown
            label="Time"
            allowBlank={ false }
            source={ [].concat({ value : -1, label : 'All Times' }, configData.times) }
            value={ time }
            onChange={ val => this._onChange(val, 'time') }
          />
        </List>
        {
          rides.length
          ? 
            <React.Fragment>
              <CardTitle title="Rides" />
              <Dropdown
                source={ [].concat(source) }
                label="Ride"
                // required
                allowBlank={ false }
                value={ rideSelected }
                onChange={ val => this._onChange(val, 'rideSelected') }
                template={ FormatRideItem }
              />
            </React.Fragment>
          :
          //<ListItem selectable={ false } ripple={ false } caption="There are no rides available" />
          <h3>There are no rides available</h3>
        }
        {/*
          Continue on here after setting the dropdown template up
        */
          <CardActions className="actions">
            <Button
              label="Cancel"
              icon={ <MdThumbDown /> }
              onClick={ onDialogClose }
            />
            <Button
              disabled={ rides.length === 0 }
              label="Assign"
              icon={ <MdThumbUp /> }
              onClick={ this._onSubmitChange }
            />
          </CardActions>
        }
      </React.Fragment>
      // </List>
    )
  }
}

const TicketRideDialog = props => (
  <Dialog
    className="ticket-modal dialog"
    active={ props.active }
    onEscKeyDown={ props.onDialogClose }
    // actions={  }
  >
    <TicketRide { ...props } />
  </Dialog>
)

export default TicketRideDialog