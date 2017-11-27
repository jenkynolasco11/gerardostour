import React, { Component } from 'react'

import UserList from './UserList'

class UsersDash extends Component{
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="users">
        <p>Users List</p>
        <UserList type="ADMIN" />
      </div>
    )
  }
}

export default UsersDash