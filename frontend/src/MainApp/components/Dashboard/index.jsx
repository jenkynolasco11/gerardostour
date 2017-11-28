import React, { Component } from 'react'

// import { Layout } from 'react-toolbox/lib/layout'

import Header from './Header'
import Drawer from './Drawer'

// Import styles
import '../../styles/css/dashboard.css'

class Dashboard extends Component{
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="Dashboard">
        <Header />
        <Drawer />
      </div>
    )
  }
}

export default Dashboard