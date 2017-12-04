import React, { Component } from 'react'
import axios from 'axios'

import TableContent from '../extras/CustomTable'

import json from './response-ticket-example.json'
import './ticket-consult.scss'

const url = 'http://localhost:8000/api/v1/ticket'

const tableFormat = {
  format :  props => {
    const {
      id,
      willDrop,
      willPick,
      status,
      from,
      to,
      time,
      date,
      person,
      luggage,
    } = props

    return {
      id,
      willDrop : willDrop ? 'YES' : 'NO' ,
      willPick : willPick ? 'YES' : 'NO' ,
      to,
      from,
      time,
      date,
      luggage,
      status,
      person : `${ person.firstname } ${ person.lastname }`,
      phoneNumber : person.phoneNumber,
      // lastname : person.lastname,
    }
  },
  header : [
    { 'id' : 'Ticket ID' },
    { 'status' : 'Status' },
    { 'person' : 'Person' },
    { 'phoneNumber' : 'Phone Number' },
    { 'from' : 'From' },
    { 'to' : 'To' },
    { 'luggage' : 'Luggage Available' },
    { 'willPick' : 'Will Pick Up?' },
    { 'willDrop' : 'Will Drop Off?' },
    { 'time' : 'Hour' },
    { 'date' : 'Date' },
  ]
}

class TicketConsult extends Component {
  constructor(props) {
    super(props)
      this.state = {
        limit : 10,
        skip : 0,
        count : 0,
        unassigned : true,
        sort : 'date -1',
        tickets : [],
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
        console.log(data)
        if(data.ok) return this.setState({ tickets : [].concat(data.data.tickets), count : data.data.count, skip : skip.selected })
      } catch (e) {
        return setTimeout(() => this.onPaginate(skip), 1000)
      }
    }
  
    async componentWillMount() {
      await this.onPaginate({ selected : 0 })
    }
  
  render() {
    const { tickets, skip, limit, count } = this.state
    const data = tickets.map(tableFormat.format)

    return (
      <div className="ticket-consult">
        <TableContent header={ tableFormat.header } {...{ onPaginate : this.onPaginate, data, skip, limit, count }}/>
      </div>
    )
  }
}

export default TicketConsult