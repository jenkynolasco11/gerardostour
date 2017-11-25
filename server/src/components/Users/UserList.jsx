import React, { PureComponent as Component } from 'react'
import { connect } from 'react-redux'

import { retrieveUsers, changeRoute } from '../../store-redux/actions'

import TableList from '../TableList'
import Form from './UserForm'

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

    // this.state = { skip : 0 }
  }

  componentWillMount() {
    const { limit } = this.props

    this.props.getUsers(limit)
  }

  render() {
    const { users, fetching, getUsers, limit, count, onRowClick } = this.props
    // const { skip } = this.state

    const props = {
      tdata : users,
      thead : header,
      fetching,
      // skip,
      count,
      updateList : getUsers,
      limit,
      onRowClick,
      switchToRoute : 'add user'
    }

    return (
      <div className="view-table">
        <TableList { ...props } />
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { users, meta } = state

  return { 
    users : users.users,
    count : users.count,
    fetching : meta.fetching,
    limit : meta.config.listLimit,
  }
}

const mapDispatchToProps = dispatch => ({
  //
  getUsers : (limit = 10, skip = 0, type = 'ADMIN') => dispatch(retrieveUsers({ limit, skip, type })),
  onRowClick : (which, props) => dispatch(changeRoute({ which, props }))
})

export const UserForm = Form
export default connect(mapStateToProps, mapDispatchToProps)(UserList)
