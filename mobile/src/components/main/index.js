import React, { PureComponent as Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { BackHandler, AsyncStorage } from 'react-native'

import MainScreen from './MainScreen'
import styles from './styles'

import { requestRides, requestLogout, setActiveStatusTo, addRides } from '../../store/actions'

class MainComponent extends Component {
  handleBackBtn = () => true

  async componentDidMount() {
    try {
      // await AsyncStorage.clear()
      const rides = await AsyncStorage.getItem('rides')

      this.props.addRides(JSON.parse(rides))
    } catch(e) {
      console.log(e)
    }

    BackHandler.addEventListener('hardwareBackPress', this.handleBackBtn)

  }

  componentWillUnmount() {
    this.props.addRides([])

    BackHandler.removeEventListener('hardwareBackPress', this.handleBackBtn)
  }

  render() {
    return <MainScreen { ...this.props } />
    // return (
    //   <MainScreen { ...this.props } />
    //   // <Stack initial hideNavBar>
    //   //   <Scene key="main" initial component={ MainScreen }/>
    //   // </Stack>
    // )
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
  addRides : (rides = []) => addRides(rides)
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MainComponent)
