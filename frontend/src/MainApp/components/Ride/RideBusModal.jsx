import React, { Component } from 'react'
import { CardTitle } from 'react-toolbox/lib/card'
import { ListCheckbox, /*ListItem,*/ ListDivider } from 'react-toolbox/lib/list'
import Dropdown from 'react-toolbox/lib/dropdown/Dropdown'
import Dialog from 'react-toolbox/lib/dialog/Dialog'
import axios from 'axios'

import { FormatBusItem, dropDownData } from './utils'
import './ride-modal.scss'

import { url } from '../../config/config-values.json'

class RideBusModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      busses : [],
      damaged : false,
      selected : null
    }

    this.makeRequest = this.makeRequest.bind(this)
    this.setSelected = this.setSelected.bind(this)
    this.onAccept = this.onAccept.bind(this)
  }

  setSelected(val) {
    this.setState({ selected : val })
  }

  onAccept() {
    this.props.onAccept(this.state.selected)
    this.props.onDialogClose()
  }

  async makeRequest() {
    const { damaged } = this.state

    try {
      const { data } = await axios.get(`${ url }/bus/all${ damaged ? '?status=DAMAGED' : '' }`)

      if(data.ok) {
        const { busses } = data.data
  
        const busFormatted = busses.map(dropDownData)

        this.setState({ busses : [].concat(busFormatted), selected : busFormatted[ 0 ].value })
      }
    } catch(e) {
      console.log(e)
      console.log('This happened in rideBusModal.jsx')
    }
  }

  async componentWillMount() {
    this.makeRequest()
  }

  render() {
    const { active, onDialogClose } = this.props
    const { busses, damaged, selected } = this.state

    const actions = [
      { label : 'Cancel', onClick : onDialogClose },
      { label : 'Assign', onClick : this.onAccept }
    ]

    return (
      <Dialog
        className="ride-modal"
        actions={ actions }
        onEscKeyDown={ onDialogClose }
        active={ active }
      >
        <div>
          <CardTitle title="Assign Bus" />
          <ListDivider />
          <Dropdown
            className="bus-list"
            value={ selected }
            // selectable={ false }
            source={ busses }
            template={ FormatBusItem }
            onChange={ this.setSelected }
            auto={ true }
            label="Choose a bus"
          />
          <ListCheckbox
            checked={ damaged }
            onChange={ e => this.setState({ damaged : e }, () => this.makeRequest()) }
            caption="Show Damaged?"
          />
        </div>
      </Dialog>
    )
  }
}

export default RideBusModal