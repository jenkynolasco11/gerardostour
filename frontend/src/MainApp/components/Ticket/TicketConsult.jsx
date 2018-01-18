import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { List, ListDivider, /*ListCheckbox,*/ ListItem } from 'react-toolbox/lib/list'
import { /*Card, CardActions, CardMedia,*/ CardTitle } from 'react-toolbox/lib/card'
import { Dropdown } from 'react-toolbox/lib/dropdown';

import TicketSettings from './TicketSettings'
import TicketForm from './TicketForm'
import TicketRideModal from './TicketRideModal'
import CustomTable from '../extras/CustomizedTable'

import { formatDate, formatHour, formatPhone } from '../../utils'
import { retrieveTickets, assignTicketsToRide, submitTicketData, setTicketQueryOption, clearTickets } from '../../store-redux/actions'

import './ticket-consult.scss'


const formatData = data => {
  return data.map( item => {
    const {
      id,
      willDrop,
      willPick,
      status,
      frm,
      to,
      time,
      date,
      person,
      dropOffAddress,
      pickUpAddress,
      receipt,
      isAssigned,
      type
    } = item

    return {
      id,
      willDrop : willDrop ? 'YES' : 'NO' ,
      willPick : willPick ? 'YES' : 'NO' ,
      to,
      frm,
      time : formatHour(time),
      date : formatDate(date),
      status,
      person : `${ person.firstname } ${ person.lastname }`,
      phoneNumber : formatPhone(person.phoneNumber),
      dropOffAddress,
      pickUpAddress,
      receipt,
      isAssigned,
      type
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
  ] ,
  colors : {
    'REGULAR' : 'orange',
    'PACKAGE' : 'darkgray',
    'VIP' : 'gold',
    'AIRPORT' : 'brown',
    'SPECIAL' : 'green',
  },
  colorsPropToMatch : 'type',
  rowToMatch : 'isAssigned',
  colorRowToMatch : '#B7F39E',
  dropdownData : [
    { value : 'id', label : 'ID' },
    { value : 'firstname', label : 'First Name' },
    { value : 'lastname', label : 'Last Name' },
    { value : 'phoneNumber', label : 'Phone Number' },
  ]
}

const TicketTemplate = props => {
  
  // console.log(props)

  return (
  <List className="detail-template">
    <CardTitle title="Ticket Details" />
    <ListDivider />
    <ListItem ripple={ false } selectable={ false } caption={ `From :  ${ props.frm }` } />
    <ListItem ripple={ false } selectable={ false } caption={ `To :  ${ props.to }` } />
    {/*
      <ListItem ripple={ false } selectable={ false } caption={ `Will Pick? ${ props.willPick }` } />
      <ListItem ripple={ false } selectable={ false } caption={ `Will Drop? ${ props.willDrop }` } />
    */}
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
)}

class TicketConsult extends Component {
  state = {
    limit : 20,
    skip : 0,
    sortBy : 'date',
    sortOrder : -1,
    selected : [],
    showForm : false,
    showRidesModal : false,
    ticketToModify : null,
    searchCriteria : 'id',
    searchString : ''
  }

  timeout = null

  constructor(props) {
    super(props)

    this._onSearchChange = this._onSearchChange.bind(this)
    this._requestTickets = this._requestTickets.bind(this)
    this._clearSelected = this._clearSelected.bind(this)
    this._onRowSelected = this._onRowSelected.bind(this)
    this._onAssignRide = this._onAssignRide.bind(this)
    this._onPaginate = this._onPaginate.bind(this)
    this._getStatus = this._getStatus.bind(this)
    this._showForm = this._showForm.bind(this)
    this._onChange = this._onChange.bind(this)
    this._onSort = this._onSort.bind(this)
  }

  //#region Private functions
  _onAssignRide(ride) {
    const { selected } = this.state
    const { tickets } = this.props

    const selectedTickets = tickets
                          .filter((_, i) => selected.includes(i))
                          .map(x => x.id)
    // console.log(ride)
    // console.log(selected)
    // console.log(selectedTickets)

    this.props.assignRide(selectedTickets, ride)
    return this._requestTickets()
  }

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
    const { skip : oldSkip, limit, sortBy, sortOrder, searchString, searchCriteria } = this.state
    const { settings } = this.props
    const { isPackage } = settings

    const skip = oldSkip * limit

    const status = this._getStatus()

    const sort = `${ sortBy } ${ sortOrder }`

    this.setState({ selected : [] })
    return this.props.queryTickets({ skip, status, sort, limit, unassigned : false, isPackage, search : searchString, searchCriteria })
  }

  _onChange(val, name) {
    let { skip } = this.state

    if(name === 'isPackage') skip = 0
    return this.setState({ [ name ] : val, skip }, this._requestTickets)
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

  _showForm(which, willShow) {
    // let ticketToModify = null
    // const { selected } = this.state

    // if(willShow && selected.length === 1) {
    //   const { tickets } = this.props
    //   ticketToModify = tickets[ selected[ 0 ] ]
    // } else setTimeout(this._requestTickets, 100)
    
    if(!willShow) this._requestTickets()

    return this.setState({ [ which ] : willShow, /*ticketToModify*/ })
  }
  
  _onSearchChange(val) {
    if(this.timeout) clearTimeout(this.timeout)

    return this.setState({ searchString : val}, () => {
      this.timeout = setTimeout(() => {
  
        if(val) this._requestTickets()
      }, 500)
    })
  }
//#endregion
  //#region Lifecycle
  componentWillMount() {
    // console.log(this.props.tickets)
    return this._requestTickets()
  }

  componentWillUnmount() {
    return this.props.clearTickets()
  }

//#endregion
  render() {
    const {
      skip,
      limit,
      selected,
      showForm,
      showRidesModal,
      ticketToModify,
      searchCriteria,
      sortBy,
      sortOrder,
      searchString
    } = this.state

    const { tickets, count, submitTicket, setQueryOption, settings } = this.props
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
          colorProps={ tableData.colors }
          colorPropToMatch={ tableData.colorsPropToMatch }
          colorToMatchRow={ tableData.colorRowToMatch }
          rowToMatchProp={ tableData.rowToMatch }
          searchString={ searchString }
          onSearchChange={ this._onSearchChange }
          onSearchEnter={ console.log }
          searchPlaceholderText={ `Check on server for ${ searchCriteria }` }
          rightDropDown={
            <Dropdown
              auto
              source={ tableData.dropdownData }
              value={ searchCriteria }
              onChange={ e => this.setState({ searchCriteria : e }) }
            /> 
          }
          sortOptions={{ sortBy, sortOrder }}
        />
        <TicketSettings
          selected={ selected }
          showForm={ this._showForm }
          requestTickets={ this._requestTickets }
          onChange={ setQueryOption }
          { ...settings }
        />
        <TicketForm
          active={ showForm }
          closeForm={ () => this._showForm('showForm', false) }
          ticket={ ticketToModify }
          onSubmitData={ this._requestTickets }
          submitTicket={ submitTicket }
        />
        <TicketRideModal
          active={ showRidesModal }
          onDialogClose={ () => this._showForm('showRidesModal', false) }
          onAccept={ this._onAssignRide }
        />
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  queryTickets : args => retrieveTickets(args),
  assignRide : (tickets, ride) => assignTicketsToRide(tickets, ride),
  submitTicket : data => submitTicketData(data),
  setQueryOption : (val, name) => setTicketQueryOption({ [ name ] : val }),
  clearTickets : () => clearTickets()
}, dispatch)

const mapStateToProps = state => {
  const { tickets, searchOptions, count } = state.ticket
  const { used, redeemed, tnull, tnew, deleted, unassigned } = searchOptions

  return {
    settings : { ...searchOptions },
    tickets,
    used,
    redeemed,
    tnull,
    tnew,
    deleted,
    unassigned,
    count
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TicketConsult)