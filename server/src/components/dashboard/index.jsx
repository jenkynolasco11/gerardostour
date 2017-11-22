// import 'babel-polyfill'
// import '../../public/assets/styles/scss/styles.scss'

import React, { Component } from 'react'
import { render } from 'react-dom'
// import axios from 'axios'

import Sidebar from './Sidebar'
import NavBar from './NavTop'
import Router from './Router'

const main = document.getElementById('main')

class Dashboard extends Component {
  state = {
    hideMenu : true,
  }

  constructor(props) {
    super(props)

    this._toggleMenu = this._toggleMenu.bind(this)
    this._switchComponent = this._switchComponent.bind(this)
  }

  _toggleMenu(e) {
    e.preventDefault()

    let { hideMenu } = this.state
    hideMenu = !hideMenu

    this.setState({ hideMenu })
  }

  _switchComponent(e, which) {
    e.preventDefault()

    console.log(which)
  }

  render() {
    const { hideMenu } = this.state

    return (
      [
        <Sidebar switchComp={ this._switchComponent } hidden={ hideMenu } />,
        <div className="dashboard" style={{ left :`${ hideMenu ? '0px' : '200px' }` }}>
          <NavBar closed={ hideMenu } toggle={ this._toggleMenu } />
          <Router />
        </div>
      ]
    )
  }
}

render(<Dashboard />, main)

// if(module.hot) {
//   module.hot.accept('')
// }