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

    const { type = 'ADMIN' } = props

    this.state = {
      type,
      fetching : false,
      overlayHeight : 0,
    }

    this.renderData = this.renderData.bind(this)
  }

  renderHeader() {
    return (
      <div className="view-table__head">
        <div className="view-table__row">
        {
          ridesHeader.map( (th, indx) => (
            <div className="view-table__header" key={ indx }>{ th }</div>
          ))
        }
        </div>
      </div>
    )
  }

  renderData() {
    const { rides, fetching } = this.props
    const { overlayHeight } = this.state

    return (
      <div className="view-table__body">
        {
          rides
          ? rides.map((tr, indx) => {
            const [ date, hr ] = tr.departing.slice(0,16).split('T')
            const modified = tr.modifiedAt.slice(0,16).split('T').join(' at ')

            return (
              <div className="view-table__row" key={ indx }>
                <div className="view-table__data">{ tr.from }</div>
                <div className="view-table__data">{ tr.to }</div>
                <div className="view-table__data">{ date }</div>
                <div className="view-table__data">{ hr }</div>
                <div className="view-table__data">{ tr.assignedTo }</div>
                <div className="view-table__data">{ tr.ticketCount }</div>
                <div className="view-table__data">{ modified }</div>
              </div>
            )
          })
          : <div className="view-table__row">
              <div className="view-table__data">
                { 'There is no data available' }
              </div>
            </div>
        }
        {
          fetching &&
          <div className="overlay-fetching" style={{ height : `${ overlayHeight }px` }}>{ 'fetching' }</div>
        }
      </div>
    )
  }

  componentWillMount() {
    // setTimeout(() => this.props.getRides(5), 2000)
    this.props.getRides(10)
    this.setState({ fetching : true })
  }

  componentDidUpdate() {
    const { clientHeight } = document.querySelector('.view-table__body')
    
    this.setState({ overlayHeight : clientHeight })
  }

  render() {
    const { overlayHeight } = this.state

    return (
      <div className="view-table">
        { this.renderHeader() }
        { this.renderData() }
        {/* this.renderFooter() */}
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { rides, meta } = state

  return { 
    rides : rides.rides,
    fetching : meta.fetching
  }
}

const mapDispatchToProps = dispatch => ({
  //
  getRides : (limit = 10, skip = 0) => dispatch(retrieveRides({ limit, skip }))
})

export default connect(mapStateToProps, mapDispatchToProps)(RidList)
