import React, { Component } from 'react'
import axios from 'axios'
// import { ListItem } from 'react-toolbox/lib/list'

import TableContent from '../extras/CustomTable'

// import json from './response-rides-example.json'
import './ride-consult.scss'

const url = 'http://localhost:8000/api/v1/ride'

const tableFormat = {
  format : props => {
    // console.log(i)
    // console.log(props)
    const { 
      id,
      bus,
      status,
      routeTo,
      routeFrom,
      time,
      date,
      seatsAvailable,
      luggageAvailable,
    } = props
    // console.log(date)
    // var formatHour = t => `${ ('00' + (t % 12 ? (t % 12) + 1 : 1)).slice(-2) }:00 ${ t > 10 && t !== 23 ? 'PM' : 'AM' }`
    // var formatDate = date => {
    //   const dateRegx = /(\d{4})-(\d{2})-(\d{2})/g.exec(date)
  
    //   return `${ dateRegx[ 3 ] }-${ dateRegx[ 2 ] }-${ dateRegx[ 1 ] }`
    // }
  
    return {
      id,
      bus : bus ? bus.name : 'Not Assigned yet',
      status : status.replace(/-/g, ' '),
      to : routeTo,
      from : routeFrom,
      time : time,
      date : date,
      seats : seatsAvailable,
      luggage : luggageAvailable
    }
  },
  header : [
    { 'bus' : 'Bus' },
    { 'status' : 'Status' },
    { 'from' : 'From' },
    { 'to' : 'To' },
    { 'time' : 'Hour' },
    { 'date' : 'Date' },
    { 'seats' : 'Seats Available' },
    { 'luggage' : 'Luggage Available' }
  ]
}

class Ride extends Component {
  constructor(props) {
    super(props)

    this.state = {
      limit : 15,
      skip : 0,
      count : 0,
      unassigned : true,
      sort : 'date -1',
      rides : [],
    }

    this.onPaginate = this.onPaginate.bind(this)
  }

  async makeRequest(limit, skip, count, unassigned, sort) {
    return await axios.get(`${url}/all?skip=${ skip }&limit=${ limit }&unassigned=${ unassigned }&sort=${ sort }`)
  }

  async onPaginate(skip) {
    const { limit, count, unassigned, sort } = this.state

    const newSkip = skip.selected * limit

    try {
      const { data } = await this.makeRequest(limit, newSkip, count, unassigned, sort)

      if(data.ok) return this.setState({ rides : [].concat(data.data.rides), count : data.data.count, skip : skip.selected })
    } catch (e) {
      return setTimeout(() => this.onPaginate(skip), 1000)
    }
  }

  async componentWillMount() {
    await this.onPaginate({ selected : 0 })
  }

  render() {
    const { rides, count, skip, limit } = this.state
    const data = rides.map(tableFormat.format)

    return (
      <div className="ride-consult">
        <TableContent header={ tableFormat.header } {...{ onPaginate : this.onPaginate, data, skip, limit, count }} />
      </div>
    )
  }
}

export default Ride