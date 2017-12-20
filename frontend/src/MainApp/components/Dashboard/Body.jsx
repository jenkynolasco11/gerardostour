import React, { Component, ReactFragment } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import Ticket from '../Ticket'
import Ride from '../Ride'

import './body.scss'

const Extra = props => (
  <div>This route didn't render properly... Check the hell out of it!</div>
)

class Body extends Component {
  render() {
    return (
      <div className="main-body">
        <Switch>
          <Route exact path="/ride/create-modify" component={ Ride.RideForm } />
          <Route exact path="/ride/consult" component={ Ride.RideConsult } />
          {/*
            <Redirect from="/ticket" to="/ticket/consult" />
            <Redirect from="/ride" to="/ride/consult" />
            <Route exact path="/ticket/create-modify" component={ Ticket.TicketForm } />
            <Route exact path="/ticket/consult" component={ Ticket.TicketConsult } />
            <Redirect from="/" to="/ride/consult"/>
          */}
          <Redirect from="/*" to="/ride/consult" />
        </Switch>
      </div>
    )
  }
}

export default Body