import React, { Component } from 'react'

import RideList from './RideList'

class Ride extends Component{
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="ride">
        <RideList />
      </div>
    )
  }
}

export default Ride