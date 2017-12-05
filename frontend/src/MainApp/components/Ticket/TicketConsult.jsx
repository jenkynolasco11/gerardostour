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
        sort : 'date',
        sortOrder :  -1,
        tickets : [],
      }

    this.onPaginate = this.onPaginate.bind(this)
    this.onSort = this.onSort.bind(this)
  }

  async makeRequest(limit, skip, count, unassigned, sort) {
    return await axios.get(`${url}/all?skip=${ skip }&limit=${ limit }&unassigned=${ unassigned }&sort=${ sort }`)
  }

  async onPaginate(skip) {
    const { limit, count, unassigned, sort, sortOrder } = this.state

    const newSkip = skip.selected * limit

    try {
      const { data } = await this.makeRequest(limit, newSkip, count, unassigned, `${ sort } ${ sortOrder }`)
      
      if(data.ok) {
        const { tickets, count } = data.data

        return this.setState({ tickets : [].concat(tickets), count, skip : skip.selected })
      }
    } catch (e) {
      return setTimeout(() => this.onPaginate(skip), 1000)
    }
  }

  // TODO : DRY with RideConsult - Also, fix the sort engine
  // For example, sorting by fields in other tables (person, details, etc)
  async onSort(val) {
    let { sort, sortOrder, skip } = this.state

    if(val === sort) sortOrder = sortOrder * -1
    else sort = val

    this.setState({ sort, sortOrder }, () => this.onPaginate({ selected : skip }))
  }

  async componentWillMount() {
    await this.onPaginate({ selected : 0 })
  }

  render() {
    const { tickets, skip, limit, count } = this.state
    const data = tickets.map(tableFormat.format)

    return (
      <div className="ticket-consult">
        <TableContent
          header={ tableFormat.header }
          onPaginate={ this.onPaginate }
          onSort={ this.onSort }
          {...{ data, skip, limit, count }}
        />
      </div>
    )
  }
}

export default TicketConsult