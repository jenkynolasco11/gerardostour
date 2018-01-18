import React, { Component } from 'react'
import Button from 'react-toolbox/lib/button/Button'
import { CardTitle, CardActions } from 'react-toolbox/lib/card'
import { ListCheckbox, /*ListItem,*/ ListDivider } from 'react-toolbox/lib/list'
import Dropdown from 'react-toolbox/lib/dropdown/Dropdown'
import Dialog from 'react-toolbox/lib/dialog/Dialog'
import axios from 'axios'

import { dropDownData, FormatBusItem } from '../../utils'
import { url } from '../../config/config-values.json'
import './ride-modal.scss'

import theme from './ride.theme.scss'

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
    setTimeout(() => this.props.onAccept(this.state.selected, this.props.isDispatch), 1000)
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
    return this.makeRequest()
  }

  render() {
    const { active, onDialogClose } = this.props
    const { busses, damaged, selected } = this.state

    return (
      <Dialog
        className="ride-modal dialog"
        // actions={ actions }
        onEscKeyDown={ onDialogClose }
        active={ active }
        theme={ theme }
      >
        <div>
          <CardTitle title="Assign to Bus" />
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
            onChange={ e => this.setState({ damaged : e }, this.makeRequest) }
            caption="Show Damaged?"
          />
          <CardActions className="ride-bus-modal_actions">
            <Button type="button" label="Cancel" onClick={ onDialogClose } />
            <Button type="button" label="Assign" onClick={ this.onAccept } />
          </CardActions>
        </div>
      </Dialog>
    )
  }
}

export default RideBusModal