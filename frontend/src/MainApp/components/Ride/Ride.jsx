import React, { Component } from 'react'

import RideForm from './RideForm'

class Ride extends Component {
  constructor(props) {
    super(props)

    console.log(props)
  }

  render() {
    return (
      <RideForm />
    )
  }
}

export default Ride