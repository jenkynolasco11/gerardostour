import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'

import { Card, CardTitle, CardActions } from 'react-toolbox/lib/card'
// import Checkbox from 'react-toolbox/lib/checkbox/Checkbox'
import { List, ListDivider } from 'react-toolbox/lib/list'
import Dropdown from 'react-toolbox/lib/dropdown/Dropdown'
import { MdChevronLeft, MdChevronRight, MdEventAvailable } from 'react-icons/lib/md'
// import Layout from 'react-toolbox/lib/layout/Layout'
import Button from 'react-toolbox/lib/button/Button'
// import { Input } from 'react-toolbox/lib/input'
import DatePicker from 'react-toolbox/lib/date_picker/DatePicker'

import { formatDate, formatHour } from '../../utils'

import defaultData from './default-data-ride.json'
import './ride-form.scss'

const url = 'http://localhost:8000/api/v1'

const defaultState = {
  id : '',
  title : 'Create',
  bus : '',
  routeTo : 'NY',
  routeFrom : 'PA',
  // status : 'PENDING',
  time : 3,
  date : new Date(new Date().setHours(0,0,0,0)),
  busses : []
}

//TOO MUCH DRY IN HERE!!!! 
const formatData = bus => {
  const { id, ...rest } = bus

  return {
    ...rest,
    value : id
  }
}

const FormatBusItem = bus => (
  <div className="bus-item">
    <div className="">
      <strong>{ bus.name }</strong>
      <p>
        <em><strong>Seats :</strong>{`${ bus.seats }`}</em>
        <em><strong>Luggage :</strong>{`${ bus.luggage }`}</em>
      </p>
    </div>
    <div className="">
      <p>Driver : { `${ bus.driver.firstname } ${ bus.driver.lastname }` }</p>
      <em>{ bus.alias }</em>
    </div>
  </div>
)

const getHourValue = tim => {
  const { times } = defaultData

  for(let i = 0; i < times.length; i++) {
    console.log(`${ tim } ${ times[i].label } ===> ${ tim === times[i].label }`)
    if(tim === times[i].label) return times[i].value
  }

  return times[ 0 ].value
}

const getMinDate = () => {
  const date = new Date()

  date.setDate(date.getDate() - 1)

  return date
}

class RideForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ...defaultState
    }

    this.onSubmit = this.onSubmit.bind(this)
  }

  async onSubmit(e) {
    e.preventDefault()
    const { history } = this.props
    const { id, bus, routeTo, routeFrom, time, date, title } = this.state

    try {
      const body = { bus, routeTo, routeFrom, time, date }

      let data = null
      
      if(title === 'Create' ) data = await axios.post(`${ url }/ride/`, body)
      else data = await axios.put(`${ url }/ride/${ id }/modify`, body)
      // console.log(data)
      if(data.data.ok) return history.goBack()
    } catch(e) {

    }
  }

  componentWillMount() {
    const { state } = this.props.location
    const self = this

    if(state) {
      this.setState({ title : state.title })

      axios
      .get(`${ url }/ride/${ state.ride }`)
      .then(({ data }) => {
        console.log(data)

        if(data.ok) {
          // console.log(data.data)
          const { id, routeFrom, routeTo, time, date, bus } = data.data
          
          // console.log(data)
          // console.log(date)
          
          self.setState({ id, routeFrom, routeTo, time, date, bus : bus.id })  
        }
      })
      .catch(e=> {
        console.error(e)
      })
    }

    axios
    .get(`${ url }/bus/all`)
    .then(({ data }) => {
      if(data.ok) {
        const { busses } = data.data

        const busArr = busses.map(formatData)

        this.setState({ busses : [].concat(busArr) })
      }
    })
    .catch(e => {
      console.error(e)
    })
  }

  render() {
    const { history } = this.props
    const {
      title,
      busses,
      routeTo,
      routeFrom,
      bus,
      time,
      date,
    } = this.state

    return (
      <form className="" onSubmit={ this.onSubmit }>
        <Card className="ride-form">
          <CardTitle className="" title={`${ title } Ride`}/>
          <ListDivider />
          <Dropdown
            label="Time"
            source={ defaultData.times }
            value={ time }
            onChange={ e => this.setState({ time : e }) }
          />
          {/*<div className="ride-routes">*/}
          <Dropdown
            label="Going from"
            source={ defaultData.routes }
            value={ routeFrom }
            onChange={ e => this.setState({ routeFrom : e }) }
          />
          <Dropdown
            label="Going to"
            source={ defaultData.routes }
            value={ routeTo }
            onChange={ e => this.setState({ routeTo : e }) }
          />
          {/*</div>*/}
          <DatePicker 
            minDate={ getMinDate() }
            icon={ <MdEventAvailable /> }
            value={ new Date(date) }
            onChange={ e => this.setState({ date : new Date(e.setHours(0,0,0,0)) }) }
          />
          <Dropdown
            source={ busses }
            label="Bus"
            template={ FormatBusItem }
            value={ bus }
            onChange={ bus => {
              console.log(bus)
              this.setState({ bus })
            }}
          />
          {/*
            <Input 
              label="First Name" 
              type="text" 
              value={ firstname } 
              onChange={ onChange('firstname') } 
            />
            <Input 
              label="Last Name" 
              type="text" 
              value={ lastname } 
              onChange={ onChange('lastname') } 
            />
            <Input 
              label="Phone Number" 
              type="tel" 
              size={ 10 } 
              value={ phoneNumber } 
              onChange={ onChange('phoneNumber') } 
              icon={ <MdPhone /> }
            />
            <Input 
              label="Email" 
              type="email" 
              value={ email } 
              onChange={ onChange('email') } 
              icon={ <MdEmail /> }
            />
            <Input 
              label="Luggage" 
              type="number" 
              value={ luggage } 
              onChange={ onChange('luggage') }
            />
            <Checkbox 
              label="Want to be picked up?" 
              checked={ willPick } 
              onChange={ onChange('willPick') }
            />
            { 
              willPick &&
              <Input 
                label="Pick Up Address" 
                value={ pickUpAddress } 
                limit={100} 
                onChange={ onChange('pickUpAddress') }
              />
            }
            <Checkbox 
              label="Want to be dropped off?" 
              checked={ willDrop } 
              onChange={ onChange('willDrop') }
            />
            {
              willDrop &&
              <Input 
                label="Drop Off Address" 
                value={ dropOffAddress } 
                limit={100} 
                onChange={ onChange('dropOffAddress') } 
              />
            }
            <Dropdown
              onChange={ this._onChangeHours }
              source={ this.hoursDefault() }
              required
              label="Hour to Leave"
              value={ this.state.takeOffHour }
            />
            <Dropdown
              onChange={ this._onChangeRoute }
              source={ this.state.routes }
              required
              label="Routes"
              disabled={ this.state.disabled }
              value={ this.state.routeId }
              template={ ListItem }
            />
          */}
          <CardActions className="ticket-form_actions">
            <Button type="button" label="Cancel" onClick={ () => history.goBack() }/>
            <Button type="submit" label="Save"/>
          </CardActions>
        </Card>
      </form>
    )
  }
}

export default withRouter(RideForm)