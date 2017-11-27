import React, { PureComponent as Component } from 'react'
import { connect } from 'react-redux'

import { retrieveRides, changeRoute } from '../../store-redux/actions'

import TableList from '../TableList'

const header = [
  'from',
  'to',
  'date',
  'hour',
  'assigned to',
  'last time modified',
  'tickets',
]

class RidList extends Component{
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const { limit } = this.props

    this.props.getRides(limit)
  }

  // fixData

  render() {
    const { rides, fetching, getRides, limit, count, onRowClick } = this.props

    const props = {
      tdata : rides,
      thead : header,
      fetching,
      updateList : getRides,
      limit,
      count, 
      onRowClick,
      switchToRoute : 'add ride'
    }

    return (
      <div className="view-table">
        <TableList { ...props }/>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { rides, meta } = state

  return { 
    rides : rides.rides,
    count : rides.count,
    fetching : meta.fetching,
    limit : meta.config.listLimit
  }
}

const mapDispatchToProps = dispatch => ({
  //
  getRides : (limit = 10, skip = 0) => dispatch(retrieveRides({ limit, skip })),
  onRowClick : (which, props) => dispatch(changeRoute({ which, props })),
})

export default connect(mapStateToProps, mapDispatchToProps)(RidList)
