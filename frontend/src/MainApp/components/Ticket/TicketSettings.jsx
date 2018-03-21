import React from 'react'

import { List, ListDivider, ListCheckbox, ListItem } from 'react-toolbox/lib/list'
import { Card, /*CardActions, /*CardMedia,*/ CardTitle } from 'react-toolbox/lib/card'
import RadioButton from 'react-toolbox/lib/radio/RadioButton'
import RadioGroup from 'react-toolbox/lib/radio/RadioGroup'
import { MdBuild, MdReceipt, MdDirectionsBus, MdFilterList } from 'react-icons/lib/md'

const TicketSettings = props => {
  const {
    selected,
    requestTickets,
    onChange,
    ticketStatus,
    ticketType,
    showForm
  } = props

  const onInputChange = (val, name) => {
    onChange(val, name)
    return setTimeout(requestTickets, 10)
  }

  return (
    <Card className="ticket-settings">
      <List>
        <CardTitle title="Actions"/>
        <ListDivider />
        {
          selected.length
          ?
          <ListItem
            avatar={ <MdBuild /> }
            caption="Modify Ticket"
            onClick={ () => showForm('showForm', true) }
            disabled={ selected.length > 1 }
          />
          :
          <ListItem
            avatar={ <MdReceipt /> }
            caption="Create a new Ticket"
            onClick={ () => showForm('showForm', true) }
            disabled={ selected.length > 0 }
            selectable
          />
        }
        <ListItem
          avatar={ <MdDirectionsBus /> }
          caption="Assign to ride"
          onClick={ () => showForm('showRidesModal', true) }
          disabled={ selected.length === 0 }
          selectable
        />
        {
          <React.Fragment>
            <CardTitle title="Advanced"/>
            <ListDivider />
            {/* <ListCheckbox
              caption="Packages"
              legend="Only show packages"
              inset
              checked={ isPackage }
              onChange={ val => onChecked(val, 'isPackage') }
              avatar={ <MdAttachFile /> }
              selectable
            /> */}
            <CardTitle avatar={ <MdFilterList /> } title="Filter" />
            <div className="ticket-settings__filter">
              <div className="ticket-settings__filter-options">
                <h3>By Type</h3>
                <RadioGroup onChange={ val => onInputChange(val, 'ticketType') } value={ ticketType }>
                  <RadioButton label="All" value="ALL" />
                  <RadioButton label="Only Regular" value="REGULAR" />
                  <RadioButton label="Only Packages" value="PACKAGE" />
                  <RadioButton label="Only VIP" value="VIP" />
                  <RadioButton label="Only Airport" value="AIRPORT" />
                  <RadioButton label="Only Special" value="SPECIAL" />
                </RadioGroup>
              </div>
              <div className="ticket-settings__filter-options">
                <h3>By Status</h3>
                <RadioGroup onChange={ val => onInputChange(val, 'ticketStatus') } value={ ticketStatus }>
                  <RadioButton label="All" value="ALL" />
                  <RadioButton label="Active" value="NEW,REDEEMED" />
                  <RadioButton label="Used" value="USED" />
                  <RadioButton label="Redeemed" value="REDEEMED" />
                  <RadioButton label="Cancelled" value="DELETED,NULL" />
                  {/* <RadioButton label="Only Special" value="special" /> */}
                </RadioGroup>
              </div>
            </div>
          </React.Fragment>
        }
      </List>
    </Card>
  )
}

export default TicketSettings
