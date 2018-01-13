import React from 'react'
import { List, ListDivider } from 'react-toolbox/lib/list'
import { CardTitle } from 'react-toolbox/lib/card'
import { MdEmail, MdPhone } from 'react-icons/lib/md'
import { Input } from 'react-toolbox/lib/input'

const TicketPersonal = props => {
  const { person } = props
  const { firstname, lastname, email, phoneNumber } = person

  return (
    <List className="ticket-form-personal">
      <CardTitle title="Personal Information" />
      <ListDivider />
      <List>
        <Input
          type="text"
          label="First Name"
          hint="John"
          value={ firstname }
          onChange={ val => props.onChange(val, 'person', 'firstname') }
          required
        />
        <Input
          type="text"
          label="Last Name"
          hint="Doe"
          value={ lastname }
          onChange={ val => props.onChange(val, 'person', 'lastname') }
          required
        />
        <Input
          type="email"
          label="Email"
          hint="john.doe@email.me"
          value={ email }
          onChange={ val => props.onChange(val, 'person', 'email') }
          required
          icon={ <MdEmail /> }
        />
        <Input
          type="text"
          label="Phone Number"
          hint="(555) 555-2435"
          value={ phoneNumber }
          onChange={ val => props.onChange(val, 'person', 'phoneNumber') }
          required
          icon={ <MdPhone /> }
          maxLength={ 10 }
        />
      </List>
    </List>
  )
}

export default TicketPersonal