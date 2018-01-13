import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { List, ListDivider, ListCheckbox, ListItem } from 'react-toolbox/lib/list'
import { Card, /*CardActions, /*CardMedia,*/ CardTitle } from 'react-toolbox/lib/card'
import { MdAttachFile, MdReceipt, MdDirectionsBus } from 'react-icons/lib/md'

import { setTicketQueryOption } from '../../store-redux/actions'

const TicketSettings = props => {
  const {
    selected,
    // getSelectedTicket,
    // openPreview,
    requestTickets,
    onChange,
    isPackage,
    showForm
  } = props

  const onChecked = (val, name) => {
    onChange(val, name)
    return setTimeout(requestTickets, 10)
  }

  return (
    <Card className="ticket-settings">
      <List>
        <CardTitle title="Actions"/>
        <ListDivider />
        {
          // selected.length
          // ?
          // <ListItem
          //   avatar={ <MdBuild /> }
          //   caption="Modify Ticket"
          //   onClick={ showForm }
          //   disabled={ selected.length > 1 }
          // />
          // :
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
            <ListCheckbox
              caption="Packages"
              legend="Only show packages"
              inset
              checked={ isPackage }
              onChange={ val => onChecked(val, 'isPackage') }
              avatar={ <MdAttachFile /> }
              selectable
            />
          </React.Fragment>
        }
      </List>
    </Card>
  )
}

const mapDispatchToProps = dispatch => bindActionCreators({
  onChange : (val, name) => setTicketQueryOption({ [ name ] : val }),
}, dispatch)

const mapStateToProps = state => {
  const { isPackage } = state.ticket.searchOptions

  return { isPackage }
}

export default connect(mapStateToProps, mapDispatchToProps)(TicketSettings)

// export default TicketSettings