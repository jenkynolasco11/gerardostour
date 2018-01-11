import React, { PureComponent as Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { BackHandler } from 'react-native'

import socketConnect from '../../utils/socket'
import MainScreen from './MainScreen'
import styles from './styles'

import { requestRides, requestLogout, setActiveStatusTo } from '../../store/actions'

class MainComponent extends Component {
  socket = null
  handleBackBtn = () => true

  componentWillMount() {
    const { bus, user } = this.props

    this.socket = socketConnect({ bus, user })

    BackHandler.addEventListener('hardwareBackPress', this.handleBackBtn)
  }

  componentWillUnmount() {
    if(this.socket) this.socket.destroy()

    BackHandler.removeEventListener('hardwareBackPress', this.handleBackBtn)
  }

  render() {
    return (
      <MainScreen { ...this.props } />
      // <Stack initial hideNavBar>
      //   <Scene key="main" initial component={ MainScreen }/>
      // </Stack>
    )
  }
}

const mapStateToProps = state => {
  const { auth, ride } = state

  return {
    bus : auth.bus,
    user : auth.user,
    rides : ride.rides,
    active : auth.isActive,
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  logout : () => requestLogout(),
  setActive : (bus, status) => setActiveStatusTo(bus, status),
  fetchRides : bus => requestRides(bus),
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MainComponent)