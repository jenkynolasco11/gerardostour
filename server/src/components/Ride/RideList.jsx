import React, { Component } from 'react'
import { connect } from 'react-redux'

import actions, { retrieveRides } from '../../store-redux/actions'

const ridesHeader = [
  'from',
  'to',
  'departing',
  'assigned to',
  'tickets',
  'last time modified',
]

class RidList extends Component{
  constructor(props) {
    super(props)
  }

  renderHeader() {
    return (
      <thead>
        <tr>
        {
          ridesHeader.map( (th, indx) => (
            <th key={ indx }>{ th }</th>
          ))
        }
        </tr>
      </thead>
    )
  }

  renderData() {
    const { rides } = this.props
    return (
      <tbody>
        {
          rides
          ? rides.map((tr, indx) => (
            <tr className="ride-data" key={ indx }>
              <td>{ tr.from }</td>
              <td>{ tr.to }</td>
              <td>{ tr.departing }</td>
              <td>{ tr.assignedTo }</td>
              <td>{ tr.ticketCount }</td>
              <td>{ tr.modifiedAt }</td>
            </tr>
          ))
          : <tr><td>{ 'There is no data available' }</td></tr>
        }
      </tbody>
    )
  }

  componentWillMount() {
    this.props.getRides(5)
  }

  render() {
    return (
      <table className="ride-list">
        { this.renderHeader() }
        { this.renderData() }
        {/* this.renderFooter() */}
      </table>
    )
  }
}

const mapStateToProps = state => {
  const { rides } = state.rides

  return { rides }
}

const mapDispatchToProps = dispatch => ({
  //
  getRides : (limit = 10, skip = 0) => dispatch(retrieveRides({ limit, skip }))
})

export default connect(mapStateToProps, mapDispatchToProps)(RidList)
