import React, { Component } from 'react'
import { connect } from 'react-redux'

import { BrowserRouter as Router } from 'react-router-dom'
// import { logUserIn } from './store-redux/actions'

import Login from './components/Login'
import Dashboard from './components/Dashboard'
import RTSnackbar from './components/extras/RTSnackbar'
import LoaderOverlay from './components/extras/LoaderOverlay'

import { checkAuth } from './store-redux/actions'

// import asyncComp from './utils/asyncComp'

// const AsyncLogin = asyncComp(() => import('./components/Login'), 'login')
// const AsyncDash = asyncComp(() => import('./components/Dashboard'), 'dashboard')

class MainApp extends Component{
  state = {
    dashboard : null,
    login : null
  }

  // componentDidCatch(e, info) {
  //   console.log('On components/index.jsx')
  //   console.log(e)
  //   console.log(info)
  // }

  componentWillMount() {
    // TODO : send the username stored in LocalStorage

    const username = window.sessionStorage.getItem('session:user')

    this.props.isAuthenticated(username)
  }

  render() {
    // console.log(this.props.tickets)
    // console.log(this.props.rides)
    return (
      <Router>
        <React.Fragment>
          {
            this.props.isAuth
            // ? <AsyncDash />
            // : <AsyncLogin />
            ?  <Dashboard />
            : <Login />
          }
          <LoaderOverlay />
          <RTSnackbar />
        </React.Fragment>
      </Router>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  isAuthenticated : username => dispatch(checkAuth(username))
})

const mapStateToProps = state => {
  const { isAuth } = state.auth
  // const { rides } = state.ride
  // const { tickets } = state.ticket

  // return { isAuth, tickets, rides }
  return { isAuth }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainApp)