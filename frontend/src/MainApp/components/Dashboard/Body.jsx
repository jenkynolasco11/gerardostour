import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import Ticket from '../Ticket'
import Ride from '../Ride'

import './body.scss'

// const Extra = props => (
//   <div>This route didn't render properly... Check the hell out of it!</div>
// )

class Body extends Component {
  render() {
    return (
      <div className="main-body">
        <Switch>
          <Route exact path="/ride" component={
            () => {
              this.props.setHeader('Rides')
              return <Ride.RideConsult />
            }
          } />
          <Route exact path="/ticket" component={
            () => {
              this.props.setHeader('Tickets')
              return <Ticket.TicketConsult />
          }} />
          {/*
            <Route exact path="/ride/create-modify" component={ Ride.RideForm } />
              <Route exact path="/ticket/create-modify" component={ Ticket.TicketForm } />
              <Redirect from="/" to="/ride/consult"/>
              <Redirect from="/*" to="/ticket/consult" />
          */}
          <Redirect from="/*" to="/ticket" />
        </Switch>
      </div>
    )
  }
}

export default Body
