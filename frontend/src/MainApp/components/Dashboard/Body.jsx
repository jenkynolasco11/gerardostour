import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import Ticket from '../Ticket'
import Ride from '../Ride'

const Extra = props => (
  <div>This is a test</div>
)

class Body extends Component {
  render() {
    return (
      <div className="main-body">
        <div>
          <Route exact path="/" component={ Extra }/> 
          <Route exact path="/ticket" component={ Ticket }/>
          <Route exact path="/ride" component={ Ride }/>
        </div>
      </div>
    )
  }
}

export default Body