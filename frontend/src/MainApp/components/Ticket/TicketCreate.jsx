import React, { Component } from 'react'
import Dialog from 'react-toolbox/lib/dialog/Dialog'

import TicketForm from './TicketForm'

import './ticket.scss'

const validateNumber = (next) => {
  let num = next.replace(/\D/g, '')
  const len = num.length

  // return num.split('').map((n,i) => i === 2 || i === 6 ? n + '-' : n ).join('')
}

class Body extends Component {
  constructor(props) {
    super(props)

    const { title, staticContext, location, history, match, ...rest } = props

    this.state = { 
      ...rest,
      showDialog : false,
      dialogMessage : 'Are you sure you want to cancel?'
    }
    
    this._onInputChange = this._onInputChange.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
    this._onCancel = this._onCancel.bind(this)
    this._fireModal = this._fireModal.bind(this)
  }
  
  _fireModal() {
    this.setState({ showDialog : true })
  }

  _onSubmit() {

  }

  _onCancel() {
    const { showDialog, dialogMessage, title, ...rest } = this.state
    const self = this

    for(let key in rest) {
      // console.log(key)
      if(rest[key]) {
        // console.log('this is ' + rest[key])
        // this.setState({
          
        // })
        setTimeout(self._fireModal, 100)
        break
      }
    }
  }

  _onInputChange(val, name) {
    let newVal = val
    
    if(name === 'phoneNumber') {
      if(val.length === 11) return
      // newVal = validateNumber(newVal)
    }

    this.setState({ [ name ] : newVal })
  }

  render() {
    const { dialogMessage, showDialog, ...inputs } = this.state
    const onSubmit = this._onSubmit
    const onInputChange = this._onInputChange
    const title = this.props.title
    const self = this
    const closeDialog = () => self.setState({ showDialog : false })
    const goBack = () => this.props.history.goBack()
    const dialogActions = [
      { label : 'Cancel', onClick : closeDialog },
      { label : 'Accept', onClick : goBack }
    ]
    
    return (
      <div className="ticket-form">
        <TicketForm { ...{ title, inputs, onInputChange, onSubmit, onCancel : this._onCancel }}/>
        <Dialog 
          actions={ dialogActions } 
          active={ showDialog }
          title="Confirm Action"
          onEscKeyDown={ closeDialog }
          onOverlayClick={ closeDialog }
        >
        {
          <p>{ dialogMessage }</p>
        }
        </Dialog>
      </div>
    )
  }
}

Body.defaultProps = {
  firstname : '',
  lastname : '',
  phoneNumber : '',
  email : '',
  luggage : 0,
  willPick : false,
  willDrop : false,
  pickUpAddress : '',
  dropOffAddress : '',
  title : 'Create Ticket'
  // total : '',
}

export default Body