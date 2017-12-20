import React from 'react'
import { connect } from 'react-redux'

import { List, ListDivider, ListCheckbox, ListItem, ListSubHeader } from 'react-toolbox/lib/list'
import { Card, /*CardActions, /*CardMedia,*/ CardTitle } from 'react-toolbox/lib/card'
import { MdDirectionsBus, MdBuild, MdAdd, MdPublish } from 'react-icons/lib/md'

import { setQueryOption } from '../../store-redux/actions'

const RideSettings = props => {
  const { 
    selected,
    pending,
    assigned,
    onTheWay,
    finished,
    onChange,
    future,
    requestRides,
    showForm,
  } = props

  const onChecked = (val, name) => {
    onChange(val, name)
    return setTimeout(requestRides, 10)
  }

  return (
    <Card className="ride-settings">
      <List>
        <CardTitle title="Actions" />
        <ListDivider />
        <ListItem 
          avatar={ <MdDirectionsBus /> }
          caption="Set To Bus"
          onClick={ () => showForm('showBusForm', true) }
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
            onClick={ () => showForm('showForm', true) }
          />
          :
          <ListItem
            avatar={ <MdBuild /> }
            caption="Modify Ride"
            selectable
            onClick={ () => showForm('showForm', true) }
          />
          :
          <ListItem
            avatar={ <MdAdd /> }
            caption="Add a new Ride"
            onClick={ () => showForm('showForm', true) }
            selectable
          />
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
          onChange={ val => onChecked(val, 'pending') }
          disabled={ true }
        />
        <ListCheckbox
          legend="Haven't been assigned to a bus"
          inset={ true }
          caption="Assigned rides"
          checked={ assigned }
          onChange={ val => onChecked(val, 'assigned') }
        />
        <ListCheckbox
          legend="Those that are on their way"
          inset={ true }
          caption="On the way rides"
          checked={ onTheWay }
          onChange={ val => onChecked(val, 'onTheWay') }
        />
        <ListCheckbox
          legend="Those rides that have finished for the day"
          inset={ true }
          caption="Finished rides"
          checked={ finished }
          onChange={ val => onChecked(val, 'finished') }
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
                onChange={ val => onChecked(val, 'future') }
                // Come here later....
                disabled={ true }
              />
          </List>
        }
      </List>
    </Card>
  )
}

const mapDispatchToProps = dispatch => ({
  onChange : (val, name) => dispatch(setQueryOption({ [ name ] : val })),
  // submitData : data => dispatch(submitRideData(data))
})

const mapStateToProps = state => {
  const { pending, finished, assigned, onTheWay, future } = state.ride.searchOptions

  return { pending, finished, assigned, onTheWay, future }
}

export default connect(mapStateToProps, mapDispatchToProps)(RideSettings)