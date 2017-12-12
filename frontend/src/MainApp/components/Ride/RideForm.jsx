import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'

import { Card, CardTitle, CardActions } from 'react-toolbox/lib/card'
// import Checkbox from 'react-toolbox/lib/checkbox/Checkbox'
import { List, ListDivider } from 'react-toolbox/lib/list'
import Dropdown from 'react-toolbox/lib/dropdown/Dropdown'
import { /*MdChevronLeft, MdChevronRight, */ MdEventAvailable } from 'react-icons/lib/md'
// import Layout from 'react-toolbox/lib/layout/Layout'
import Button from 'react-toolbox/lib/button/Button'

import DatePicker from 'react-toolbox/lib/date_picker/DatePicker'

// import { formatDate, formatHour } from '../../utils'

import { FormatBusItem, formatData, getMinDate } from './utils'
import configData, { url } from '../../config/config-values.json'
import './ride-form.scss'

// const url = 'http://localhost:8000/api/v1'

const defaultState = {
  id : '',
  title : 'Create',
  bus : '',
  routeTo : 'NY',
  routeFrom : 'PA',
  status : 'PENDING',
  time : 3,
  date : new Date(new Date().setHours(0,0,0,0)),
  busses : []
}

// const headers = {
//   'Access-Control-Allow-Origin': '*',
//   'Content-Type': 'application/json',
// }

//TOO MUCH DRY IN HERE!!!! 




// const getHourValue = tim => {
//   const { times } = configData

//   for(let i = 0; i < times.length; i++) {
//     console.log(`${ tim } ${ times[i].label } ===> ${ tim === times[i].label }`)
//     if(tim === times[i].label) return times[i].value
//   }

//   return times[ 0 ].value
// }



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
    const { id, bus, routeTo, routeFrom, time, date, title, status } = this.state

    try {
      const body = { bus, routeTo, routeFrom, time, date, status }

      let data = null
      
      if(title === 'Create' ) data = await axios.post(`${ url }/ride/save`, body)
      else data = await axios.put(`${ url }/ride/${ id }/modify`, body)
      // console.log(data)
      if(data.data.ok) return history.goBack()
    } catch(e) {
      console.log(e)
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
          const { id, routeFrom, routeTo, time, date, bus, status } = data.data
                
          console.log(id)
    
          // console.log(data)
          // console.log(date)
          
          self.setState({ id, routeFrom, routeTo, time, date, status, bus : bus ? bus.id : null })
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
      id,
      title,
      busses,
      routeTo,
      routeFrom,
      bus,
      time,
      date,
    } = this.state

    // const source = [].concat(busses, { value : null, label : '' })

    return (
      <form className="" onSubmit={ this.onSubmit }>
        <Card className="ride-form">
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
            source={ busses /* source */ }
            label="Bus"
            template={ FormatBusItem }
            value={ bus }
            onChange={ bus => this.setState({ bus }) }
            allowBlank={ true }
            auto={ true }
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