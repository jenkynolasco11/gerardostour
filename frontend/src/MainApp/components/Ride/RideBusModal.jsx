import React, { Component } from 'react'
import Dialog from 'react-toolbox/lib/dialog/Dialog'
import Dropdown from 'react-toolbox/lib/dropdown/Dropdown'
import axios from 'axios'
// import { Card, CardActions, /*CardMedia,*/ CardTitle } from 'react-toolbox/lib/card'
import { List, ListDivider, ListCheckbox, ListItem, ListSubHeader } from 'react-toolbox/lib/list'

import './ride-modal.scss'

const url = 'http://localhost:8000/api/v1/bus'

const FormatBusItem = bus => (
  <div className="bus-item">
    <div className="">
      <strong>{ bus.name }</strong>
      <p>
        <em><strong>Seats :</strong>{`${ bus.seats }`}</em>
        <em><strong>Luggage :</strong>{`${ bus.luggage }`}</em>
      </p>
    </div>
    <div className="">
      <p>Driver : { `${ bus.driver.firstname } ${ bus.driver.lastname }` }</p>
      <em>{ bus.alias }</em>
    </div>
  </div>
)

const formatData = bus => {
  const { id, ...rest } = bus

  return {
    ...rest,
    value : id
  }
}

/**
 *
 * {
    "id": "5a24be8eab02183380cfbe12",
    "name": "Blanquita",
    "alias": "Blanquita",
    "driver": {
    "firstname": "Quinlan",
    "lastname": "Franks",
    "phoneNumber": "3573563988",
    "position": "DRIVER"
    },
    "seats": 40,
    "luggage": 52
  }
 */

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
    this.props.onAccept( this.state.selected )
  }

  async makeRequest() {
    const { damaged } = this.state

    try {
      const { data } = await axios.get(`${ url }/all${ damaged ? '?status=DAMAGED' : '' }`)

      if(data.ok) {
        const { busses } = data.data
  
        const busFormatted = busses.map(formatData)

        this.setState({ busses : [].concat(busFormatted), selected : busFormatted[ 0 ].value })

      }
    } catch(e) {
      // console.log(e)
      return setTimeout(() => this.makeRequest(), 1000)
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
        // title="What to do?"
      >
        <div>
          <ListItem selectable={ false } legend="Assign bus" />
          <Dropdown
            value={ selected }
            selectable={ false }
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