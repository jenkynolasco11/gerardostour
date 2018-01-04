import React from 'react'

import { List, ListDivider, /*ListCheckbox,*/ ListItem } from 'react-toolbox/lib/list'
import { Card, /*CardActions, /*CardMedia,*/ CardTitle } from 'react-toolbox/lib/card'
import { /*MdSearch,*/ MdReceipt, MdDirectionsBus } from 'react-icons/lib/md'

// import { setTicketQueryOption } from '../../store-redux/actions'

const TicketSettings = props => {
  const {
    selected,
    // getSelectedTicket,
    // openPreview,
    showForm
  } = props

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
          // <React.Fragment>
          //   <CardTitle title="Advanced"/>
          //   <ListDivider />
          //   <ListItem
          //     // onClick={ openPreview }
          //     avatar={ <MdDeleteForever /> }
          //     caption="Delete Ticket"
          //     disabled={ selected.length > 0 }
          //     selectable
          //   />
          // </React.Fragment>
        }
      </List>
    </Card>
  )
}

export default TicketSettings