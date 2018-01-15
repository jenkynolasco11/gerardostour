import React from 'react'

import { List, ListDivider, ListCheckbox, ListItem } from 'react-toolbox/lib/list'
import { Card, /*CardActions, /*CardMedia,*/ CardTitle } from 'react-toolbox/lib/card'
import { MdDirectionsBus, MdBuild, MdAdd, MdPublish } from 'react-icons/lib/md'

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
    dispatchToBus,
    shouldDisableDispatch
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
        onClick={ dispatchToBus }
        disabled={ shouldDisableDispatch }
        selectable
      />
      <List>
        <CardTitle title="Settings" />
        <ListDivider />
        <ListCheckbox
          legend="Those rides waiting to be dispatched"
          inset
          caption="Pending rides"
          checked={ pending }
          onChange={ val => onChecked(val, 'pending') }
          disabled
        />
        <ListCheckbox
          legend="Haven't been assigned to a bus"
          inset
          caption="Assigned rides"
          checked={ assigned }
          onChange={ val => onChecked(val, 'assigned') }
        />
        <ListCheckbox
          legend="Those that are on their way"
          inset
          caption="On the way rides"
          checked={ onTheWay }
          onChange={ val => onChecked(val, 'onTheWay') }
        />
        <ListCheckbox
          legend="Those rides that have finished for the day"
          inset
          caption="Finished rides"
          checked={ finished }
          onChange={ val => onChecked(val, 'finished') }
        />
        {
          //////////////////////////////////////////
          ///// ADMIN SETTINGS | Not implemented yet
          //////////////////////////////////////////
          false &&
            <List>
              <CardTitle title="Admin Settings" />
              <ListDivider/>
              <ListCheckbox
                legend="Those rides that have finished for the day"
                inset
                caption="Past rides"
                checked={ future }
                onChange={ val => onChecked(val, 'future') }
                // Come here later....
                disabled
              />
          </List>
        }
      </List>
    </Card>
  )
}

export default RideSettings