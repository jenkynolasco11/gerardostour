import React, { Component } from 'react'
import { BackHandler } from 'react-native'
// import { connect } from 'react-redux'
// import { Actions, Scene, Router } from 'react-native-router-flux'
// import { connect } from 'react-redux'
import { Container } from 'native-base'

import Header from './Header'
import Content from './Content'
import Footer from './Footer'

import { retrieveRide, retrieveTicketsByRide } from '../../utils'
// import CustomStatusBar from '../extras-components/CustomStatusBar'
// import Fab from './Fab'
// import Body from './Body'

import styles from './styles'

class RideComponent extends Component{
  state = { ride : null, tickets : [] }

  async componentWillMount() {
    const { rideId } = this.props

    retrieveRide(rideId).then(ride => {
      this.setState({ ride })
    }).catch(console.error)

    retrieveTicketsByRide(rideId).then(tickets => {
      // console.log(tickets)
      this.setState({ tickets })
    }).catch(console.error)

    // console.log(tickets)

    // return this.setState({ ride, tickets })
  }

  // componentWillUnmount() {
  //   // BackHandler.removeEventListener('hardwareBackPress', this.handleBackBtn)
  // }

  render() {
    const { ride, tickets } = this.state

    return (
      <Container style={[ styles.container, styles.color1 ]}>
        <Header { ...this.props } ride={ ride } />
        <Content { ...this.props } tickets={ tickets } />
        <Footer />
      </Container>
    )
  }
}

export default RideComponent
