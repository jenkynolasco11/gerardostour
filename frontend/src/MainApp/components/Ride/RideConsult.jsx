import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import RideBusModal from './RideBusModal'
import CustomTable from '../extras/CustomizedTable'
import RideSettings from './RideSettings'
import RideForm from './RideForm'

import { ListDivider, ListItem, List } from 'react-toolbox/lib/list'
import { CardTitle } from 'react-toolbox/lib/card'
import FontIcon from 'react-toolbox/lib/font_icon/FontIcon'
import tooltip from 'react-toolbox/lib/tooltip'
// import Button from 'react-toolbox/lib/button/Button'

import { retrieveRides, assignBusToRides, setRideQueryOption, dispatchToBus, clearRides, setHeader } from '../../store-redux/actions'
import { formatPhone } from '../../utils'

import './ride-consult.scss'
import { Dropdown } from 'react-toolbox/lib/dropdown'

// const formatData = data => {
//   return data.map(item => {
//     const { time, date } = item

//     return {
//       ...item,
//       time : formatHour(time),
//       date : formatDate(date),
//     }
//   })
// }

const tableData = {
  headers : [
    { value : 'id', label : 'Ride ID', flex : 1 },
    { value : 'frm', label : 'From', flex : 1 },
    { value : 'to', label : 'To', flex : 1 },
    { value : 'busName', label : 'Bus', flex : 1, ifNone : 'None' },
    { value : 'ticketsCount', label : 'Used Seats', flex : 1 },
    { value : 'time', label : 'Time', flex : 1.5 },
    { value : 'date', label : 'Date', flex : 1.5 },
  ],
  rowToMatch : 'time,date',
  rowConditionToMatch : {
    '#edb1b1' : ({ time, date }) => (new Date() - (1000 * 60 * 60 * 2)) > new Date(new Date(date).setHours(time+1,0,0,0)),
    default : 'blue'
  },
  colors : {
    'PENDING' : 'red',
    'ASSIGNED' : 'orange',
    'ON-THE-WAY' : 'cyan',
    'FINISHED' : 'lightgreen'
  },
  colorsPropToMatch : 'status',
  dropdownData : [
    { value : 'id', label : 'ID' },
    { value : 'bus', label : 'Bus' },
  ],
}

const ToolTipIcon = tooltip(FontIcon)

const DetailTemplate = props => {
  const { removeFromRide, deleteTicket, ticket } = props

  return (
    <List className="detail-template">
      {
        props.tickets.length ?
        <React.Fragment>
          <h3>Tickets</h3>
          <div className="details-header">
              <div className="th" style={{ flex : 0.4 }}>ID</div>
              <div className="th" style={{ flex : 1 }}>Person</div>
              <div className="th" style={{ flex : 1.5 }}>Phone Number</div>
              <div className="th" style={{ flex : 1 }}>Confirmed</div>
              <div className="th" style={{ flex : 0.5 }}>Status</div>
              <div className="th" style={{ flex : 0.6 }}>Type</div>
              <div className="th" style={{ flex : 0.5 }}>Pick?</div>
              <div className="th" style={{ flex : 0.5 }}>Drop?</div>
              <div className="th" style={{ flex : 0.5 }} />
              {/* <div className="th" style={{ flex : 0.5 }} /> */}
          </div>
          {
            props.tickets.map(
              ({ _id, id, confirmed, person, details, reminded, status, type, willPick, willDrop }) => (
                <div className="details-data" key={ _id }>
                  <div className="td" style={{ flex : 0.4 }}>{ id }</div>
                  <div className="td" style={{ flex : 1 }}>{ `${ person.firstname } ${ person.lastname }` }</div>
                  <div className="td" style={{ flex : 1.5 }}>{ formatPhone(person.phoneNumber) }</div>
                  <div className="td" style={{ flex : 1 }}>{ confirmed ? 'Yes' : 'No' }</div>
                  <div className="td" style={{ flex : 0.5}}>{ status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() }</div>
                  <div className="td" style={{ flex : 0.6 }}>{ type.charAt(0).toUpperCase() + type.slice(1).toLowerCase() }</div>
                  <div className="td" style={{ flex : 0.5 }}>{ willDrop ? 'Yes' : 'No' }</div>
                  <div className="td" style={{ flex : 0.5 }}>{ willPick ? 'Yes' : 'No' }</div>
                  <div className="td" style={{ flex : 0.5 }}>
                    <ToolTipIcon onClick={ () => props.removeFromRide(props.id,id) } tooltip="Remove" tooltipPosition="bottom" style={{ color : 'hotpink' }} value="delete_sweep" />
                    <ToolTipIcon onClick={ () => props.deleteTicket(id) } tooltip="Delete" tooltipPosition="bottom" style={{ color : 'red' }} value="delete_forever" />
                  </div>
                  {/* <div className="td" style={{ flex : 0.5 }}></div> */}
                </div>
              )
            )
          }
        </React.Fragment>
        : <ListItem caption="There is nothing to show here yet"/>
      }
    </List>
  )
}

class Ride extends Component {
  state = {
    limit : 20,
    skip : 0,
    count : 0,
    sortBy : 'date',
    sortOrder : -1,
    selected : [],
    showForm : false, // Show create ride form
    showBusForm : false, // Show assign bus modal
    rideToModify : null,
    searchCriteria : 'id',
    searchString : '',
  }

  timeout = null

  constructor(props) {
    super(props)

    this._getSelectedRides = this._getSelectedRides.bind(this)
    this._removeFromRide = this._removeFromRide.bind(this)
    this._onSearchChange = this._onSearchChange.bind(this)
    this._dispatchToBus = this._dispatchToBus.bind(this)
    this._onRowSelected = this._onRowSelected.bind(this)
    this._clearSelected = this._clearSelected.bind(this)
    this._deleteTicket = this._deleteTicket.bind(this)
    this._requestRides = this._requestRides.bind(this)
    this._onAssignBus = this._onAssignBus.bind(this)
    this._onPaginate = this._onPaginate.bind(this)
    this._getStatus = this._getStatus.bind(this)
    this._showForm = this._showForm.bind(this)
    this._onChange = this._onChange.bind(this)
    this._onSort = this._onSort.bind(this)
  }

  //#region Private functions
  _getSelectedRides() {
    const { selected } = this.state
    const { rides } = this.props

    const selectedRides = rides
                          .filter((_, i) => selected.includes(i))
                          .map(x => x.id)
    return selectedRides
  }

  _onAssignBus(bus) {
    const { sortBy, sortOrder, skip, limit } = this.state

    const selectedRides = this._getSelectedRides()

    const query = {
      skip,
      limit,
      sort : `${ sortBy } ${ sortOrder }`,
      status : this._getStatus(),
      future : true,
    }

    this.props.assignBus(bus, selectedRides, query)
    return setTimeout(this._requestRides, 500)
  }

  _getStatus() {
    const { settings } = this.props
    const { onTheWay, finished, assigned, pending } = settings

    const statusList = {
      'ON-THE-WAY' : onTheWay,
      'FINISHED' : finished,
      'ASSIGNED' : assigned,
      'PENDING' : pending
    }

    const status = Object
      .keys(statusList)
      .map(stat => statusList[ stat ] ? stat : '')
      .filter(stat => stat !== '')
      .join(',')

    return status
  }

  _removeFromRide(ride, ticket) {
    console.log(ride, ticket)
  }

  _deleteTicket(ticket) {
    console.log(ticket)
  }

  _requestRides() {
    const { skip : oldSkip, limit, sortBy, sortOrder, searchCriteria, searchString } = this.state
    const { settings } = this.props
    const {  /*onTheWay, finished, assigned, pending,*/ future } = settings

    const skip = oldSkip * limit

    const status = this._getStatus()

    const sort = `${ sortBy } ${ sortOrder }`

    this.setState({ selected : [], isDispatch : false })
    return this.props.queryRides({ skip, status, sort, future, limit, search : searchString, searchCriteria })
  }

  _onChange(val, name) {
    return this.setState({ [ name ] : val }, this._requestRides)
  }

  _onRowSelected(rows) {
    return this.setState({ selected : [].concat(rows) })
  }

  _clearSelected() {
    return this.setState({ selected : [] })
  }

  _onPaginate({ selected : skip }) {
    return this.setState({ skip/*, selected : []*/ }, this._requestRides)
  }

  _onSort(nextSortBy) {
    let { sortBy, sortOrder } = this.state

    if(sortBy !== nextSortBy) sortOrder = -1
    else sortOrder = sortOrder * -1

    sortBy = nextSortBy

    return this.setState({ sortBy, sortOrder/*, selected : []*/ }, this._requestRides)
  }

  _showForm(which, willShow) {
    let rideToModify = null
    const { selected } = this.state

    // 'if' opens the form, 'else' closes it
    if(which === 'showForm' && willShow && selected.length === 1) {
      const { rides } = this.props
      rideToModify = rides[ selected[ 0 ] ]

    } // else setTimeout(this._requestRides, 100)

    return this.setState({ [ which ] : willShow, rideToModify })
  }

  _dispatchToBus() {
    const selectedRides = this._getSelectedRides()

    return this.props.dispatchBus(selectedRides)
  }

  _onSearchChange(val) {
    if(this.timeout) clearTimeout(this.timeout)

    return this.setState({ searchString : val}, () => {
      this.timeout = setTimeout(this._requestRides, 500)
    })
  }
//#endregion

//#region Lifecycle functions
  componentDidMount() {
    this.props.setHeader()

    return this._requestRides()
  }

  componentWillUnmount() {
    return this.props.clearRides()
  }
//#endregion

  render() {
    const {
      skip,
      limit,
      selected,
      showForm,
      rideToModify,
      showBusForm,
      sortBy,
      sortOrder,
      searchCriteria,
      searchString,
    } = this.state

    const removeFromRide = this._removeFromRide
    const deleteTicket = this._deleteTicket
    const { rides, count, settings, setQueryOption } = this.props
    const data = rides // formatData(rides)
    const disableDispatch = !selected.every(i => rides[ i ].status === 'ASSIGNED')

    return (
      <div>
        <div className="ride-consult">
          <CustomTable
            className="ride-consult-table"
            selected={ selected }
            onRowSelect={ this._onRowSelected }
            onPaginate={ this._onPaginate }
            onSort={ this._onSort }
            data={ data }
            skip={ skip }
            limit={ limit }
            total={ count }
            template={ <DetailTemplate {...{ removeFromRide, deleteTicket }} /> }
            headerProps={ tableData.headers }
            colorProps={ tableData.colors }
            colorPropToMatch={ tableData.colorsPropToMatch }
            searchString={ searchString }
            onSearchChange={ this._onSearchChange }
            onSearchEnter={ console.log }
            searchPlaceholderText={ `Check on server for ${ searchCriteria }` }
            rowConditionsToMatch={ tableData.rowConditionToMatch }
            rowToMatchProp={ tableData.rowToMatch }
            rightDropDown={
              <Dropdown
                auto
                source={ tableData.dropdownData }
                value={ searchCriteria }
                onChange={ e => this.setState({ searchCriteria : e }) }
              />
            }
            sortOptions={{ sortBy, sortOrder }}
            shouldShowSkeleton={ this.props.isLoading }
          />
          <RideSettings
            selected={ selected }
            requestRides={ this._requestRides }
            showForm={ this._showForm }
            dispatchToBus={ this._dispatchToBus }
            shouldDisableDispatch={ selected.length === 0 || disableDispatch }
            onChange={ setQueryOption }
            { ...settings }
          />
          <RideForm
            active={ showForm }
            closeForm={ () => this._showForm('showForm', false) }
            ride={ rideToModify }
            onSubmitData={ this._requestRides }
          />
          <RideBusModal
            active={ showBusForm }
            onDialogClose={ () => this._showForm('showBusForm', false) }
            onAccept={ this._onAssignBus }
          />
        </div>
      </div>
    )
  }
}

// TODO : Refactor this part. All the connects should be send by the higher component
const mapStateToProps = state => {
  const { rides, count, searchOptions } = state.ride
  const { isLoading } = state.app

  return { rides, count, settings : searchOptions, isLoading }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  queryRides : args => retrieveRides(args),
  dispatchBus : rides => dispatchToBus(rides),
  setQueryOption : (val, name) => setRideQueryOption({ [ name ] : val }),
  assignBus : (bus, rides, query) => assignBusToRides(bus, rides, query),
  clearRides : () => clearRides(),
  setHeader : () => setHeader('Rides')
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Ride)
