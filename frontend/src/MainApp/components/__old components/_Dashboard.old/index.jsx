import React, { Component } from 'react'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { compose, applyMiddleware, createStore } from 'redux'

import reducers from '../../store-redux'

import Sidebar from './Sidebar'
import NavBar from './NavTop'

import { Router, Route } from '../Router'

import Rides from '../Rides'
import Users from '../Users'
import UserForm from '../Users/UserForm'

// Import styles
import '../../styles/css/dashboard.css'

const middlewares = [ thunk/*, historyMid*/ ]
const composeEnhancers =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose

const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(...middlewares)),
  // Redux connection with Chrome
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

class Dashboard extends Component{
  constructor(props) {
    super(props)

    this.state = { hideMenu : true }

    this._slideDash = this._slideDash.bind(this)
  }

  _slideDash(willHide) {
    this.setState({ hideMenu : willHide })
  }

  render() {
    const { hideMenu } = this.state

    return (
      <Provider store={ store }>
        <div>
          <Sidebar hidden={ hideMenu } />
          <div className="dashboard" style={{ left :`${ hideMenu ? '0px' : '200px' }` }}>
            <NavBar slideDash={ this._slideDash } />
            <div className="main-content">
              <Router className="router">
                <Route initial={ true } name="rides" component={ Rides } props={{}} />
                <Route name="users" component={ Users } props={{}} />
                <Route name="add user" component={ UserForm } props={{}} />
              </Router>
            </div>
          </div>
        </div>
      </Provider>
    )
  }
}

export default Dashboard