import React, { PureComponent as Component } from 'react'
import { connect } from 'react-redux'
import { Router, Scene, Stack, ActionConst } from 'react-native-router-flux'

import Socket from '../../utils/socket'
import Main from '../main'
import Auth from '../auth'
import Ride from '../ride'

const { REPLACE, PUSH } = ActionConst
const RouterWithRedux = connect(null)(Router)

class Landing extends Component {
  // socket = null

  render() {
    return (
      <RouterWithRedux>
        <Stack key="root" hideNavBar>
          <Scene key="login" type={ REPLACE } component={ Auth } initial/>
          <Scene key="app" type={ REPLACE } panHandlers={ null } hideNavBar>
            <Scene key="main" component={ Main } initial/>
            <Scene key="ride" component={ Ride } type={ PUSH }/>
          </Scene>
        </Stack>
      </RouterWithRedux>
    )
  }
}

export default Landing

// const mapStateToProps = state => {
//   const { auth } = state
//   const { bus, user } = auth

//   return { bus, user }
// }

// export default connect(mapStateToProps)(Landing)
