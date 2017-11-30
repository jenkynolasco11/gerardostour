import React, { Component } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import Layout from 'react-toolbox/lib/layout/Layout'

import Header from './Header'
import Drawer from './Drawer'
import Body from './Body'

// Import styles
import './style.scss'

class Dashboard extends Component{
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Layout className="dashboard">
        <Header />
        <Body />
        <Drawer />
      </Layout>
    )
  }
}

export default Dashboard