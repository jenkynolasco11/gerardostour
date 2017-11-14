import React from 'react'

import { Router, Scene } from 'react-native-router-flux'
import { connect } from 'react-redux'

import Main from './Main'
import Ride from '../rideinfo'
import Passenger from '../passenger'

const RouterWithRedux = connect()(Router)

const MainScreen = props => (
  <RouterWithRedux>
    <Scene key='root'>
      <Scene key='main' hideNavBar init component={ Main }>
        <Scene key='ride' navTransparent direction='vertical' component={ Ride } />
        <Scene key='passenger' navTransparent component={ Passenger } />
      </Scene>
    </Scene>
  </RouterWithRedux>
)

export default MainScreen