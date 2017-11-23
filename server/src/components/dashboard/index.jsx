import React, { Component } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { compose, applyMiddleware, createStore } from 'redux'

import reducers from '../../store-redux'

import Sidebar from './Sidebar'
import NavBar from './NavTop'

import { Router, Route } from '../Router'

import Ride from '../Ride'

const middlewares = [ thunk, ]
const store = createStore(
  reducers,
  compose(applyMiddleware(...middlewares)),
)

const main = document.getElementById('main')

class Dashboard extends Component {
  state = {
    hideMenu : true,
  }

  constructor(props) {
    super(props)

    this._toggleMenu = this._toggleMenu.bind(this)
    // this._switchComponent = this._switchComponent.bind(this)
  }

  _toggleMenu(e) {
    e.preventDefault()

    let { hideMenu } = this.state
    hideMenu = !hideMenu

    this.setState({ hideMenu })
  }

  // _switchComponent(e, which) {
  //   e.preventDefault()

  //   console.log(which)
  // }

  render() {
    const { hideMenu } = this.state

    return (
      <Provider store={ store }>
        <div>
          <Sidebar hidden={ hideMenu } />
          <div className="dashboard" style={{ left :`${ hideMenu ? '0px' : '200px' }` }}>
            <NavBar closed={ hideMenu } toggle={ this._toggleMenu } />
            <Router className="router">            
              <Route initial={ true } name="ride" component={ Ride } props={{}}/>
            </Router>
          </div>
        </div>
      </Provider>
    )
  }
}

render(<Dashboard />, main)