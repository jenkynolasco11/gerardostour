import React, { Component } from 'react'
import { Input } from 'react-toolbox/lib/input'
import { Card, CardTitle, CardActions } from 'react-toolbox/lib/card'
import Button from 'react-toolbox/lib/button/Button'

import theme from './theme.scss'

const RTInput = props => {
  console.log(props.name)

  const commonProps = {
    onChange : val => props.onInputChange(val, props.input),
    name : props.name,
    label : props.name,
    value : props.input,
    maxLength : 50,
    type : 'text'
  }
  
  switch(props.name) {
    case /^will/ :
      commonProps.type = 'checkbox'
    // case '' :
    //   commonProps.type = 'checkbox'
  }
  
  return <Input {...commonProps} />

  //   <Input
  //     name="username"
  //     label="Username"
  //     type="text"
  //     value={ this.state.username }
  //     onChange={ value => onInputChange(value, 'username') }
  //     maxLength={ 16 }
  //   />
  // <Input
  //   name="password"
  //   label="Password"
  //   type="password"
  //   value={ this.state.password }
  //   onChange={ value => onInputChange(value, 'password') }
  // />
  // <CardActions className="actions">
  //   <Button
  //     type="submit"
  //     label="Login"
  //     onClick={ onSubmit }
  //   />
  // </CardActions>
  // }
}


class TicketForm extends Component {
  render() {
    const { title, inputs, onInputChange, onSubmit } = this.props
    return (
      <form onSubmit={ onSubmit }>
        <Card className={ `ticket-form_add` }>
          <CardTitle title={ title } />
          <div />
          { Object.keys(inputs).map( (name, i) => (
              <RTInput key={ i } {...{ name, input : inputs[ name ], onInputChange }} />
          ))}
        </Card>
      </form>
    )
  }
}

export default TicketForm