import React, { Component } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
// import { BrowserRouter as Router } from 'react-router-dom'
// import { routerReducer, routerMiddleware, push } from 'react-router-redux'
// import browserHistory from 'history/createBrowserHistory'
import thunk from 'redux-thunk'
import { compose, applyMiddleware, createStore } from 'redux'

import reducers from '../../store-redux'

import Sidebar from './Sidebar'
import NavBar from './NavTop'

import { Router, Route } from '../Router'

import Rides from '../RideS'
import Users from '../Users'
import UserForm from '../Users/UserForm'

// const history = browserHistory()
// const historyMid = routerMiddleware(history)

const middlewares = [ thunk/*, historyMid*/ ]
const store = createStore(
  reducers,
  compose(applyMiddleware(...middlewares)),
)

const main = document.getElementById('main')

class Dashboard extends Component{
  constructor(props) {
    super(props)

    this.state = { hideMenu : true }

    this._slideDash = this._slideDash.bind(this)
  }

  _slideDash(willHide) {
    // console.log(willHide)
    // e.preventDefault()

    // let { hideMenu } = this.state
    // hideMenu = !hideMenu

    this.setState({ hideMenu : willHide })
  }

  // componentDidMount() {
  //   const el = document.querySelector('.main-content')
  //   new SimpleBar(el)
  // }

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

render(<Dashboard />, main)