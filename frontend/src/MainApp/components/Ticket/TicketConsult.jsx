import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { List, ListDivider, ListCheckbox, ListItem } from 'react-toolbox/lib/list'
import { MdReceipt, MdBuild, MdSearch } from 'react-icons/lib/md'
import { Card, CardTitle } from 'react-toolbox/lib/card'

import TicketPreview from './TicketPreview'
import TableContent from '../extras/CustomTable'


// import json from './response-ticket-example.json'
import './ticket-consult.scss'
import { url } from '../../config/config-values.json'
// const url = 'http://localhost:8000/api/v1/ticket'

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
    { 'luggage' : 'Luggage' },
    { 'willPick' : 'Pick Up?' },
    { 'willDrop' : 'Drop Off?' },
    { 'time' : 'Hour' },
    { 'date' : 'Date' },
  ]
}

const TicketSettings = props => {
  const {
    selected,
    getSelectedTicket,
    openPreview
  } = props

  return (
    <Card className="ticket-settings">
      <List>
        <CardTitle title="Actions"/>
        <ListDivider />
        {/*
          selected.length ?
          selected.length > 1 ?
          // <Link>
          <ListItem
            avatar={ <MdBuild /> }
            caption="Modify Ticket"
            disabled={ selected.length > 1 }
          />
          // </Link>
          :
          <Link to={{ pathname : '/ticket/create-modify', state : { ticket : getSelectedTicket(), title : 'Modify', isModify : true }}}>
            <ListItem
              avatar={ <MdBuild /> }
              caption="Modify Ticket"
              selectable
            />
          </Link>
          :
          */
          <Link to={{ pathname: '/ticket/create-modify' }}>
            <ListItem
              avatar={ <MdReceipt /> }
              caption="Create a new Ticket"
              selectable
            />
          </Link>
        }
        <CardTitle title="Settings"/>
        <ListDivider />
        <ListItem
          onClick={ openPreview }
          avatar={ <MdSearch /> }
          caption="Review details"
          disabled={ selected.length !== 1 }
          selectable
        />
      </List>
    </Card>
  )
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
        selected : [],
        showPreview : true,
        ticketSelected : 750
      }

    this.getSelectedTicket = this.getSelectedTicket.bind(this)
    this.onPreviewClose = this.onPreviewClose.bind(this)
    this.onGetSelected = this.onGetSelected.bind(this)
    this.onPaginate = this.onPaginate.bind(this)
    this.onSort = this.onSort.bind(this)
  }

  async makeRequest(limit, skip, count, unassigned, sort) {
    return await axios.get(`${ url }/ticket/all?skip=${ skip }&limit=${ limit }&unassigned=${ unassigned }&sort=${ sort }`)
  }

  async onPaginate(skip) {
    const {
      limit,
      count,
      unassigned,
      sort,
      sortOrder
    } = this.state

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

  onGetSelected(selected) {
    this.setState({ selected : [].concat(selected) })
  }

  getSelectedTicket() {
    const { selected, tickets } = this.state

    if(!selected.length) return null

    return tickets[ selected[ 0 ]].id
  }

  onPreviewClose() {
    this.setState({ showPreview : false })
  }

  async componentWillMount() {
    await this.onPaginate({ selected : 0 })
  }

  render() {
    const {
      tickets,
      skip,
      limit,
      count,
      selected,
      showPreview,
      ticketSelected
    } = this.state

    const data = tickets.map(tableFormat.format)

    return (
      <div className="ticket-consult">
        <TableContent
          getSelectedRows={ this.onGetSelected }
          onPaginate={ this.onPaginate }
          header={ tableFormat.header }
          onSort={ this.onSort }
          {...{ data, skip, limit, count }}
        />
        <TicketSettings
          selected={ selected } 
          getSelectedTicket={ this.getSelectedTicket }
          openPreview={ () => this.setState({ ticketSelected : this.getSelectedTicket(), showPreview : true }) }
        />
        {/*
          <TicketPreview
            {...{
              onPreviewClose : this.onPreviewClose,
              ticketId : ticketSelected,
              active : showPreview,
            }}
          />
        */}
      </div>
    )
  }
}

export default TicketConsult