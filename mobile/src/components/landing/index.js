import React, { Component } from 'react'

import { connect } from 'react-redux'
import { Modal, Router, Scene, ActionConst } from 'react-native-router-flux'

import Main from '../main'
import Auth from '../auth'
import Passenger from '../passenger'
import Ride from '../rideinfo'

const RouterWithRedux = connect()(Router)

const MainScreen = props => (
  <RouterWithRedux>
    {/*<Scene key='modal' component={ Modal }>*/}
    <Scene key='root' hideNavBar>
      <Scene 
        key='auth' 
        initial
        type={ ActionConst.REPLACE } 
        component={ Auth }
      />
      <Scene 
        // initial
        key='app'
        type={ ActionConst.REPLACE }
        hideNavBar
      > 
        <Scene 
          key='main'
          panHandlers={null}
          // hideNavBar
          init
          component={ Main }
        />
        <Scene 
          key='ride'
          // navigationBarStyle={{ backgroundColor : '#accecd' }}
          // navTransparent
          component={ Ride }
          direction='vertical'
        />
        <Scene
          key='passenger'
          component={ Passenger }
        />
      </Scene>
    </Scene>
    {/*</Scene>*/}
  </RouterWithRedux>
)

export default MainScreen