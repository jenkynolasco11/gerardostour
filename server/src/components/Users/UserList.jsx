import React, { PureComponent as Component } from 'react'
import { connect } from 'react-redux'

import { retrieveUsers } from '../../store-redux/actions'

const header = [
  'username',
  'first name',
  'last name',
  'position',
  'phone number',
  'last session',
]

class UserList extends Component{
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
          header.map( (th, indx) => (
            <div className="view-table__header" key={ indx }>{ th }</div>
          ))
        }
        </div>
      </div>
    )
  }

  renderData() {
    const { users, fetching } = this.props
    const { overlayHeight } = this.state
    console.log(fetching)
    return (
      <div className="view-table__body">
        {
          users
          ? users.map((tr, indx) => {
            const [ ft, snd, trd ] = [
              tr.phoneNumber.slice(0,3), 
              tr.phoneNumber.slice(3,6), 
              tr.phoneNumber.slice(6)
            ]
            const lastSession = tr.lastSession.slice(0,16).split('T').join(' at ')

            return (
              <div className="view-table__row" onClick={() => console.log(tr._id)} key={ indx }>
                <div className="view-table__data">{ tr.username }</div>
                <div className="view-table__data">{ tr.firstname }</div>
                <div className="view-table__data">{ tr.lastname }</div>
                <div className="view-table__data">{ this.state.type }</div>
                <div className="view-table__data">{ `(${ ft })-${ snd }-${ trd }` }</div>
                <div className="view-table__data">{ lastSession }</div>
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
    this.props.getUsers(50)
  }

  componentDidUpdate() {
    const { clientHeight } = document.querySelector('.view-table__body')

    this.setState({ overlayHeight : clientHeight })
  }

  render() {    
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
  const { users, meta } = state

  return { 
    users : users.users,
    fetching : meta.fetching
  }
}

const mapDispatchToProps = dispatch => ({
  //
  getUsers : (limit = 10, skip = 0, type = 'ADMIN') => dispatch(retrieveUsers({ limit, skip, type }))
})

export default connect(mapStateToProps, mapDispatchToProps)(UserList)
