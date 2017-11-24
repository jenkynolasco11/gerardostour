import React, { PureComponent as Component } from 'react'
import { connect } from 'react-redux'

import { retrieveRides } from '../../store-redux/actions'

const ridesHeader = [
  'from',
  'to',
  'date',
  'hour',
  'assigned to',
  'tickets',
  'last time modified',
]

class RidList extends Component{
  constructor(props) {
    super(props)
  }

  renderHeader() {
    // 80, 120, 180
    const cls = [1,1,3,2,1,3,1]
    // 80 + 80 + 180 + 120 + 80 + 180 + 80
    return (
      <thead>
        <tr>
        {
          ridesHeader.map( (th, indx) => (
            <th className={`space-${ cls[ indx ] }`} key={ indx }>{ th }</th>
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
          ? rides.map((tr, indx) => {
            const [ date, hr ] = tr.departing.slice(0,16).split('T')
            const modified = tr.modifiedAt.slice(0,16).split('T').join(' at ')

            return (
              <tr className="ride-data" key={ indx }>
                <td className="space-1">{ tr.from }</td>
                <td className="space-1">{ tr.to }</td>
                <td className="space-3">{ date }</td>
                <td className="space-2">{ hr }</td>
                <td className="space-1">{ tr.assignedTo }</td>
                <td className="space-3">{ tr.ticketCount }</td>
                <td className="space-2">{ modified }</td>
              </tr>
            )
          })
          : <tr><td>{ 'There is no data available' }</td></tr>
        }
      </tbody>
    )
  }

  componentWillMount() {
    // setTimeout(() => this.props.getRides(5), 2000)
    this.props.getRides(10)
  }

  render() {
    return (
      <table className="table-list ride-list">
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
