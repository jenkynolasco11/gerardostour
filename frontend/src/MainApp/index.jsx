import React, { Component } from 'react'
import { connect } from 'react-redux'

import Login from './components/Login'
import Dashboard from './components/Dashboard'

class MainApp extends Component{
  render() {
    const { isUserLoggedIn } = this.props

    if(isUserLoggedIn) return <Dashboard />

    return <Login />
  }
}

const mapStateToProps = state => {
  const { isUserLoggedIn } = state.app

  return { isUserLoggedIn }
}

export default connect(mapStateToProps)(MainApp)