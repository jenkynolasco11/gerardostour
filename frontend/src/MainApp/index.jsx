import React, { Component } from 'react'
import { connect } from 'react-redux'

import { BrowserRouter as Router, Route } from 'react-router-dom'

import Login from './components/Login'
import Dashboard from './components/Dashboard'
import RTSnackbar from './components/extras/RTSnackbar'
// import LoaderOverlay from './components/extras/LoaderOverlay'

import { checkAuthentication } from './store-redux/actions'

class MainApp extends Component{
  // constructor(props) {
  //   super(props)
  // }

  componentWillMount() {
    this.props.checkAuth()
  }

  render() {
    const {
      isUserLoggedIn,
      isFetching
    } = this.props

    return (
      <Router>
        <div>
          {
            //*
            isUserLoggedIn 
            ? <Dashboard />
            // : <Login />
            : <Dashboard />
            //*/
          }
          <RTSnackbar />
          {/* <LoaderOverlay loading={ isFetching }/> */}
        </div>
      </Router>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  checkAuth : () => dispatch(checkAuthentication())
})

const mapStateToProps = state => {
  const { isUserLoggedIn, isFetching } = state.app

  return { isUserLoggedIn, isFetching }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainApp)