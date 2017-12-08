import React, { Component } from 'react'
// import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import axios from 'axios'

import { List, ListDivider, ListCheckbox, ListItem, ListSubHeader } from 'react-toolbox/lib/list'
import { Card, /*CardActions, /*CardMedia,*/ CardTitle } from 'react-toolbox/lib/card'
// import Dropdown from 'react-toolbox/lib/dropdown/Dropdown'
// import Button from 'react-toolbox/lib/button/Button'
import { MdDirectionsBus, MdBuild, MdAdd, MdPublish } from 'react-icons/lib/md'

import TableContent from '../extras/CustomTable'
import RideBusModal from './RideBusModal'

// import json from './response-rides-example.json'
import './ride-consult.scss'

const url = 'http://localhost:8000/api/v1/ride'

const tableFormat = {
  format : props => {
    const { 
      id,
      bus,
      status,
      routeTo,
      routeFrom,
      time,
      date,
      seatsUsed,
      luggageUsed,
    } = props
  
    return {
      id,
      bus : bus ? bus.name : 'Not Assigned yet',
      status : status.replace(/-/g, ' '),
      to : routeTo,
      from : routeFrom,
      time : time,
      date : date,
      seats : seatsUsed,
      luggage : luggageUsed
    }
  },
  header : [
    { 'id' : 'Ride ID' },
    { 'bus' : 'Bus' },
    { 'status' : 'Status' },
    { 'from' : 'From' },
    { 'to' : 'To' },
    { 'time' : 'Hour' },
    { 'date' : 'Date' },
    { 'seats' : 'Seats' },
    { 'luggage' : 'Luggage' }
  ]
}

const RideSettings = props => {
  const { 
    selected,
    getSelectedRide,
    pending,
    assigned,
    onTheWay,
    finished,
    shouldShowModal,
    onChange,
    future
  } = props

  return (
    <Card className="ride-settings">
      <List>
        <CardTitle title="Actions" />
        <ListDivider />
        <ListItem 
          avatar={ <MdDirectionsBus /> }
          caption="Set To Bus"
          onClick={ () => shouldShowModal(true) }
          disabled={ selected.length === 0 }
          selectable
        />
        {
          selected.length ?
          selected.length > 1 ?
          <ListItem
            avatar={ <MdBuild /> }
            caption="Modify Ride"
            disabled={ selected.length > 1 }
          />
          :
          <Link to={{ pathname : '/ride/create-modify', state : { ride : getSelectedRide(), title : 'Modify' }}}>
            <ListItem
              avatar={ <MdBuild /> }
              caption="Modify Ride"
              selectable
              // disabled={ selected.length > 1 }
            />  
          </Link>
          : 
          <Link to="/ride/create-modify">
            <ListItem
              avatar={ <MdAdd /> }
              caption="Add a new Ride"
              selectable
            />
          </Link>
        }
      </List>
      <CardTitle title="Dispatch" />
      <ListDivider />
      <ListItem 
        avatar={ <MdPublish /> }
        caption="Dispatch to Bus"
        onClick={ e => console.log('Clicked on dispatch!') }
        disabled={ true }
        selectable
      />
      <List>
        <CardTitle title="Settings" />
        <ListDivider />
        <ListCheckbox
          legend="Those rides waiting to be dispatched"
          inset={ true }
          caption="Pending rides"
          checked={ pending }
          onChange={ val => onChange(val, 'pending') }
          disabled={ true }
        />
        <ListCheckbox
          legend="Haven't been assigned to a bus"
          inset={ true }
          caption="Assigned rides"
          checked={ assigned }
          onChange={ val => onChange(val, 'assigned') }
        />
        <ListCheckbox
          legend="Those that are on their way"
          inset={ true }
          caption="On the way rides"
          checked={ onTheWay }
          onChange={ val => onChange(val, 'onTheWay') }
        />
        <ListCheckbox
          legend="Those rides that have finished for the day"
          inset={ true }
          caption="Finished rides"
          checked={ finished }
          onChange={ val => onChange(val, 'finished') }
        />
        {
          //////////////////////////////////////////
          ///// ADMIN SETTINGS
          //////////////////////////////////////////
          false &&
            <List>
              <CardTitle title="Admin Settings" />
              <ListDivider/>
              <ListCheckbox
                legend="Those rides that have finished for the day"
                inset={ true }
                caption="Past rides"
                checked={ future }
                onChange={ val => onChange(val, 'future') }
                // Come here later....
                disabled={ true }
              />
          </List>
        }
      </List>
    </Card>
  )
}

class Ride extends Component {
  constructor(props) {
    super(props)

    this.state = {
      limit : 10,
      skip : 0,
      count : 0,
      pending : true,
      finished : false,
      assigned : false,
      onTheWay : false,
      future : true,
      sort : 'date',
      sortOrder : -1,
      rides : [],
      showModal : false,
      selected : []
    }

    this.shouldShowModal = this.shouldShowModal.bind(this)
    this.getSelectedRide = this.getSelectedRide.bind(this)
    this.onGetSelected = this.onGetSelected.bind(this)
    this.onPaginate = this.onPaginate.bind(this)
    this.assignBus = this.assignBus.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onSort = this.onSort.bind(this)
  }

  async makeRequest(limit, skip, count, /*assigned, */status, sort, future) {
    return await axios.get(`${ url }/all?skip=${ skip }&limit=${ limit }&sort=${ sort }&status=${ status }&future=${ future }`)//&unassigned=${ true }`)
  }

  async onPaginate(skip) {
    const {
      limit,
      count,
      sort,
      sortOrder,
      assigned,
      onTheWay,
      finished,
      pending,
      future
     } = this.state

    const newSkip = skip.selected * limit

    const statusList = { 'ON-THE-WAY' : onTheWay, 'FINISHED' : finished, 'ASSIGNED' : assigned, 'PENDING' : pending }

    const status = Object
      .keys(statusList)
      .map(stat => statusList[stat] ? stat : '')
      .filter(stat => stat !== '')
      .join(',')

    try {
      const { data } = await this.makeRequest(limit, newSkip, count,/* unassigned,*/ status, `${ sort } ${ sortOrder }`, future)

      if(data.ok) {
        let { rides, count } = data.data

        // rides = rides.map(({ date, ...rest }) => ({ date : formatDate() }))

        return this.setState({ rides : [].concat(rides), count, skip : skip.selected })
      }

    } catch (e) {
      return setTimeout(() => this.onPaginate(skip), 1000)
    }
  }

  // TODO : DRY with RideConsult - Also, fix the sort engine
  // For example, sorting by fields in other tables (bus, details, etc)
  async onSort(val) {
    let { sort, sortOrder, skip } = this.state

    if(val === sort) sortOrder = sortOrder * -1
    else {
      sort = val
      sortOrder = -1
    }

    this.setState({ sort, sortOrder }, () => this.onPaginate({ selected : skip }))
  }

  // async createRide() {

  // }

  getSelectedRide() {
    const { selected, rides } = this.state

    if(!selected.length) return null

    // console.log(selected[ 0 ])
    return rides[ selected[ 0 ]].id
  }

  async assignBus(bus) {
    const { selected, rides, skip } = this.state

    const ids = rides.filter((_, i) => selected.includes(i)).map(i => i.id)

    try {
      const { data } = await axios.put(`${ url }/assign-bus`, { bus,  ids })
      // console.log(data)
      if(data.ok) this.onPaginate({ selected : skip })

    } catch(e) {
      console.log(e)
    }

    this.setState({ showModal : false })
  }

  onChange(val, field) {
    this.setState({ [ field ] : val }, () => this.onPaginate({ selected : 0 }))
  }

  onGetSelected(selected) {
    this.setState({ selected : [].concat(selected) })
  }

  async componentWillMount() {
    await this.onPaginate({ selected : 0 })
  }

  shouldShowModal(val) {
    this.setState({ showModal : val })
  }

  render() {
    const {
      rides,
      count,
      skip, 
      limit,
      assigned,
      onTheWay,
      finished,
      pending,
      selected,
      showModal
    } = this.state

    const data = rides.map(tableFormat.format)

    return (
      <div className="ride-consult">
        <TableContent
          getSelectedRows={ this.onGetSelected }
          onPaginate={ this.onPaginate }
          header={ tableFormat.header }
          onSort={ this.onSort }
          {...{ data, skip, limit, count }}
        />
        <RideSettings
          {...{
            assigned,
            onTheWay,
            finished,
            pending,
            selected,
            getSelectedRide : this.getSelectedRide,
            shouldShowModal : this.shouldShowModal,
            onChange : this.onChange
        }}/>
        <RideBusModal
          active={ showModal }
          onDialogClose={ () => this.setState({ showModal : false }) }
          onAccept={ val => this.assignBus(val) }
        />
      </div>
    )
  }
}

export default Ride