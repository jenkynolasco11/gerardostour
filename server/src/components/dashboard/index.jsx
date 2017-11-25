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

// const history = browserHistory()
// const historyMid = routerMiddleware(history)

const middlewares = [ thunk/*, historyMid*/ ]
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
            <NavBar closed={ hideMenu } toggle={ this._toggleMenu } />
            {/*<Router>
            </Router>*/}
            <div className="main-content">
              <Router className="router">
                <Route initial={ true } name="rides" component={ Rides } props={{}}/>
                <Route name="users" component={ Users } props={{}}/>
              </Router>
            </div>
          </div>
        </div>
      </Provider>
    )
  }
}

render(<Dashboard />, main)