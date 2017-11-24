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

    this.state = {
      type : props.type
    }

    this.renderData = this.renderData.bind(this)
  }

  renderHeader() {
    // 80, 120, 180
    const cls = [2,2,1,2,3,3]
    // 120, 240, 320, 440, 620, 
    return (
      <thead>
        <tr>
        {
          header.map( (th, indx) => (
            <th className={`space-${ cls[ indx ] }`} key={ indx }>{ th }</th>
          ))
        }
        </tr>
      </thead>
    )
  }

  renderData() {
    const { users } = this.props

    return (
      <tbody>
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
              <tr onClick={() => console.log(tr._id) } className="user-data" key={ indx }>
                <td className="space-2">{ tr.username }</td>
                <td className="space-2">{ tr.firstname }</td>
                <td className="space-1">{ tr.lastname }</td>
                <td className="space-2">{ this.state.type }</td>
                <td className="space-3">{ `(${ ft })-${ snd }-${ trd }` }</td>
                <td className="space-2">{ lastSession }</td>
              </tr>
            )
          })
          : <tr><td>{ 'There is no data available' }</td></tr>
        }
      </tbody>
    )
  }

  componentWillMount() {
    // setTimeout(() => this.props.getUsers(5), 2000)
    this.props.getUsers(50)
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
  const { users } = state.users

  return { users }
}

const mapDispatchToProps = dispatch => ({
  //
  getUsers : (limit = 10, skip = 0, type = 'ADMIN') => dispatch(retrieveUsers({ limit, skip, type }))
})

export default connect(mapStateToProps, mapDispatchToProps)(UserList)
