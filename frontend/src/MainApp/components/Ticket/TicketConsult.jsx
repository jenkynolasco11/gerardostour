import React, { Component } from 'react'
import { connect } from 'react-redux'

import { List, ListDivider, /*ListCheckbox,*/ ListItem } from 'react-toolbox/lib/list'
import { /*Card, CardActions, CardMedia,*/ CardTitle } from 'react-toolbox/lib/card'

import TicketSettings from './TicketSettings'
import TicketForm from './TicketForm'
import CustomTable from '../extras/CustomizedTable'

import { formatDate, formatHour, formatPhone } from '../../utils'
import { retrieveTickets } from '../../store-redux/actions'

import './ticket-consult.scss'

const formatData = data => {
  return data.map( item => {
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
      dropOffAddress,
      pickUpAddress
    } = item

    return {
      id,
      willDrop : willDrop ? 'YES' : 'NO' ,
      willPick : willPick ? 'YES' : 'NO' ,
      to,
      from,
      time : formatHour(time),
      date : formatDate(date),
      status,
      person : `${ person.firstname } ${ person.lastname }`,
      phoneNumber : formatPhone(person.phoneNumber),
      dropOffAddress,
      pickUpAddress
    }
  })
}

const tableData = {
  headers : [
    { value : 'id', label : 'Ticket ID', flex : 1 },
    { value : 'person', label : 'Name', flex : 2 },
    { value : 'time', label : 'Time', flex : 1 },
    { value : 'date', label : 'Date', flex : 2 },
    { value : 'phoneNumber', label : 'Phone Number', flex : 2 },
  ] 
}

const TicketTemplate = props => (
  <List className="detail-template">
    <CardTitle title="Ticket Details" />
    <ListDivider />
    <ListItem ripple={ false } selectable={ false } caption={ `From :  ${ props.from }` } />
    <ListItem ripple={ false } selectable={ false } caption={ `To :  ${ props.to }` } />
    <ListItem ripple={ false } selectable={ false } caption={ `Will Pick? ${ props.willPick }` } />
    <ListItem ripple={ false } selectable={ false } caption={ `Will Drop? ${ props.willDrop }` } />
    <List className="address-location">
      {
        props.willPick === 'YES' &&
        <List className="detail-template pick-up-items">
          <CardTitle title="Pick Up Location" />
          <ListDivider />
          <ListItem ripple={ false } selectable={ false } caption={ `Address: ${ props.pickUpAddress.street }, ${ props.pickUpAddress.city }, ${ props.pickUpAddress.state } ${ props.pickUpAddress.zipcode }` } />
        </List>
      }
      {
        props.willDrop === 'YES' &&
        <List className="detail-template drop-off-items">
          <CardTitle title="Drop Off Location" />
          <ListDivider />
          <ListItem ripple={ false } selectable={ false } caption={ `Address: ${ props.dropOffAddress.street }, ${ props.dropOffAddress.city }, ${ props.dropOffAddress.state } ${ props.dropOffAddress.zipcode }` } />
        </List>
      }
    </List>
  </List>
)

class TicketConsult extends Component {
  constructor(props) {
    super(props)
      this.state = {
        limit : 20,
        skip : 0,
        sortBy : 'date',
        sortOrder : -1,
        selected : [],
        showForm : false,
        ticketToModify : null,
      }

    this._requestTickets = this._requestTickets.bind(this)
    this._clearSelected = this._clearSelected.bind(this)
    this._onRowSelected = this._onRowSelected.bind(this)
    this._onPaginate = this._onPaginate.bind(this)
    this._getStatus = this._getStatus.bind(this)
    this._showForm = this._showForm.bind(this)
    this._onChange = this._onChange.bind(this)
    this._onSort = this._onSort.bind(this)
  }
//#region Private functions

  _getStatus() {
    const { used, redeemed, tnull, tnew, deleted } = this.props

    const statusList = {
      'REDEEMED' : redeemed,
      'DELETED' : deleted,
      'USED' : used,
      'NULL' : tnull,
      'NEW' : tnew,
    }

    const status = Object
      .keys(statusList)
      .map(stat => statusList[ stat ] ? stat : '')
      .filter(stat => stat !== '')
      .join(',')

    return status
  }

  _requestTickets() {
    const { skip : oldSkip, limit, sortBy, sortOrder } = this.state

    const skip = oldSkip * limit

    const status = this._getStatus()

    const sort = `${ sortBy } ${ sortOrder }`

    return this.props.queryTickets({ skip, status, sort, limit, unassigned : true })
  }

  _onChange(val, name) {
    return this.setState({ [ name ] : val }, this._requestTickets)
  }

  _onRowSelected(rows) {
    return this.setState({ selected : [].concat(rows) })
  }

  _clearSelected() {
    return this.setState({ selected : [] })
  }

  _onPaginate({ selected : skip }) {
    return this.setState({ skip, selected : [] }, this._requestTickets)
  }

  _onSort(nextSortBy) {
    let { sortBy, sortOrder } = this.state

    if(sortBy !== nextSortBy) sortOrder = -1
    else sortOrder = sortOrder * -1

    sortBy = nextSortBy

    this.setState({ sortBy, sortOrder, selected : [] }, this._requestTickets)
  }

  _showForm(willShow) {
    let ticketToModify = null
    const { selected } = this.state

    if(willShow && selected.length === 1) {
      const { tickets } = this.props
      ticketToModify = tickets[ selected[ 0 ] ]
    } else setTimeout(this._requestTickets, 100)

    return this.setState({ showForm : willShow, ticketToModify })
  }
//#endregion

//#region Lifecycle
  componentWillMount() {
    return this._requestTickets()
  }

//#endregion
  render() {
    const {
      skip,
      limit,
      selected,
      showForm,
      ticketToModify
    } = this.state

    const { tickets, count } = this.props
    const data = formatData(tickets)

    return (
      <div className="ticket-consult">
        <CustomTable
          className="ticket-consult-table"
          selected={ selected }
          onRowSelect={ this._onRowSelected }
          onPaginate={ this._onPaginate }
          onSort={ this._onSort }
          data={ data }
          skip={ skip }
          limit={ limit }
          total={ count }
          headerProps={ tableData.headers }
          template={ <TicketTemplate /> }
        />
        <TicketSettings
          selected={ selected }
          showForm={ () => this._showForm(true) }
          requestTickets={ this._requestTickets }
        />
        <TicketForm
          active={ showForm }
          closeForm={ () => this._showForm(false) }
          ticket={ ticketToModify }
          onSubmitData={ this._requestTickets }
        />
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  queryTickets : args => dispatch(retrieveTickets(args))
})

const mapStateToProps = state => {
  const { tickets, searchOptions, count } = state.ticket
  const { used, redeemed, tnull, tnew, deleted, unassigned } = searchOptions

  return { tickets, used, redeemed, tnull, tnew, deleted, unassigned, count }
}

export default connect(mapStateToProps, mapDispatchToProps)(TicketConsult)