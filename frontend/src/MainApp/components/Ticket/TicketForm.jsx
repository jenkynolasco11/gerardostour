import React, { Component } from 'react'
import { Input } from 'react-toolbox/lib/input'
import { Card, CardTitle, CardActions } from 'react-toolbox/lib/card'
import Layout from 'react-toolbox/lib/layout/Layout'
import Button from 'react-toolbox/lib/button/Button'
import Checkbox from 'react-toolbox/lib/checkbox/Checkbox'
import Dropdown from 'react-toolbox/lib/dropdown/Dropdown'
import { MdPhone, MdEmail } from 'react-icons/lib/md'
import axios from 'axios'

import theme from './theme.scss'

const inputFields = {
  firstname : ['First Name', 'text'],
  lastname : ['Last Name', 'text'],
  phoneNumber : ['Phone Number', 'tel'],
  luggage : ['Luggage', 'number'],
  willPick : ['Will Pick?', 'checkbox'],
  willDrop : ['Will Drop?', 'checkbox'],
  pickUpAddress : ['Pick Up Address', 'text'],
  dropOffAddress : ['Drop Off Address', 'text'],
}

const ListItem = props => (
  props.value !== '1'
  ? (
    <div className="route-list">
      <div className="from">{ `${ props.from.street  } ${ props.from.city }, ${ props.from.state } ${ props.from.zip }` }</div>
      <div>&nbsp;->&nbsp;</div>
      <div className="to">{ `${ props.to.street } ${ props.to.city }, ${ props.to.state } ${ props.to.zip }` }</div>
    </div>
  )
  : <div />
)

class TicketForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      routes : [
        { value : '1', label : '--- fetching ---' },
      ],
      disabled : true,
      takeOffHour : 0,
      routeId : '1'
    }

    this._onChangeHours = this._onChangeHours.bind(this)
    this._onChangeRoute = this._onChangeRoute.bind(this)
  }

  async makeRequest(val) {
    try {
      const { data } = await axios.get(`http://localhost:8000/api/v1/ride/time/${ val }`)
      // console.log(data)
      if(data.ok) return data.data
    } catch (e) {
      console.log(e)
    }
    return [{ value : '1', label : '--- fetching ---'}]
  }

  async _onChangeHours(val) {
    this.setState({
      disabled : true,
      routes : [{ value : '1', label : '--- fetching ---'}]
    }, async () => {
      try {
        const data = await this.makeRequest(val)
        
        const routes = [].concat(data)
        const [ firstVal ] = routes
  
        this.setState({
          routes,
          takeOffHour : val,
          routeId : firstVal.value,
          disabled : false,
        })
      } catch (e) {
        // console.log('ereor', e)
        this.setState({ 
          routes : [{ value : '1', 'label' : '--- fetching ---'}], 
          routeId : '',
          disabled : true,
        })
      }
    })
  }

  hoursDefault() {
    return [...Array(24).keys()].map(i => {
      return {
        value : i,
        label : `${ (i % 12) + 1 }:00 ${ i >= 12 ? 'AM' : 'PM' }`
      }
    })
  }

  _onChangeRoute(val) {
    this.setState({ routeId : val })
  }

  async componentDidMount(){
    try {
      const routes = await this.makeRequest(this.state.takeOffHour)
      const [ firstVal ] = routes

      this.setState({ 
        routes,
        routeId : firstVal.value,
        disabled : false
      })
    } catch(e) {
      this.setState({ 
        routes : [{ value : '1', 'label' : '--- fetching ---'}], 
        routeId : '',
        disabled : true,
      })
    }
  }

  render() {
    const { title, inputs, onInputChange, onSubmit, onCancel } = this.props
    const {
      firstname,
      lastname,
      phoneNumber,
      email,
      luggage,
      willPick,
      willDrop,
      pickUpAddress,
      dropOffAddress,
    } = inputs

    const onChange = val => e => onInputChange(e, val)

    return (
      <form onSubmit={ onSubmit }>
        <Card className={ `ticket-form_add` }>
          <CardTitle className="ticket-form_title" title={ title }/>
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
          <CardActions className="ticket-form_actions">
            <Button type="button" label="Cancel" onClick={ onCancel }/>
            <Button type="submit" label="Save"/>
          </CardActions>
        </Card>
      </form>
    )
  }
}

export default TicketForm