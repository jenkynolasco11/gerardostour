import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'

import { CardTitle, CardActions } from 'react-toolbox/lib/card'
import Dialog from 'react-toolbox/lib/dialog/Dialog'
import { List, ListDivider } from 'react-toolbox/lib/list'
import Dropdown from 'react-toolbox/lib/dropdown/Dropdown'
import { /*MdChevronLeft, MdChevronRight, */ MdEventAvailable } from 'react-icons/lib/md'
import DatePicker from 'react-toolbox/lib/date_picker/DatePicker'
import Button from 'react-toolbox/lib/button/Button'

import { submitRideData } from '../../store-redux/actions'

import { FormatBusItem, dropDownData, getMinDate } from './utils'
import configData, { url } from '../../config/config-values.json'
import './ride-form.scss'

import theme from './ride.theme.scss'

const defaultState = {
  id : 0,
  title : 'Create',
  bus : '',
  routeTo : 'NY',
  routeFrom : 'PA',
  status : 'PENDING',
  time : 3,
  date : new Date(new Date().setHours(0,0,0,0)),
  busses : []
}

class RideForm extends Component {
  state = {
    ...defaultState
  }

  constructor(props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
  }

  async onSubmit(e) {
    e.preventDefault()

    const { id, bus, routeTo, routeFrom, time, date, status } = this.state

    await this.props.submitData({ id, bus, routeTo, routeFrom, time, date, status })
    this.props.onSubmitData()
    this.props.closeForm('showForm', false)
  }

  async componentWillMount() {
    const { ride } = this.props

    if(ride) {
      const { id, bus, routeTo, routeFrom, time, date, status } = ride

      this.setState({ id, bus : (bus ? bus.id : null), routeTo, routeFrom, time, date, status, title : 'Modify' })
    }

    try {
      const { data } = await axios.get(`${ url }/bus/all`)

      if(data.ok) {
        const { busses } = data.data

        this.setState({ busses })
      }
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    const { closeForm } = this.props
    const {
      id,
      title,
      busses,
      routeTo,
      routeFrom,
      bus,
      time,
      date,
    } = this.state

    const busData = busses.map(dropDownData)

    return (
      <form className="" onSubmit={ this.onSubmit }>
        <List className="ride-form-header">
          <CardTitle className="" title={`${ title } Ride`}/>
          { id ? <p>Ride ID: { id }</p> : null }
        </List>
        <ListDivider className="margin-bottom" />
        <Dropdown
          label="Time"
          allowBlank={ false }
          source={ configData.times }
          value={ time }
          onChange={ e => this.setState({ time : e }) }
        />
        <Dropdown
          label="Going from"
          source={ configData.routes }
          value={ routeFrom }
          onChange={ e => this.setState({ routeFrom : e }) }
        />
        <Dropdown
          label="Going to"
          source={ configData.routes }
          value={ routeTo }
          onChange={ e => this.setState({ routeTo : e }) }
        />
        <DatePicker
          autoOk
          minDate={ getMinDate() }
          icon={ <MdEventAvailable /> }
          value={ new Date(date) }
          onChange={ e => this.setState({ date : new Date(e.setHours(0,0,0,0)) }) }
        />
        <Dropdown
          source={ busData }
          label="Bus"
          template={ FormatBusItem }
          value={ bus }
          onChange={ bus => this.setState({ bus }) }
          allowBlank={ true }
          auto={ true }
        />
        <CardActions className="ticket-form_actions">
          <Button type="button" label="Cancel" onClick={ () => closeForm('showForm', false) }/>
          <Button type="submit" label="Save"/>
        </CardActions>
      </form>
    )
  }
}

const Form = props => (
  <Dialog
    className="ride-form dialog"
    active={ props.active }
    theme={ theme }
    autoScrollBodyContent
  >
    <RideForm { ...props } />
  </Dialog>
)

const mapDispatchToProps = dispatch => ({
  submitData : data => dispatch(submitRideData(data))
})

export default connect(null, mapDispatchToProps)(Form)//(withRouter(Form))