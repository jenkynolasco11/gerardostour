import React, { Component } from 'react'
import { View, BackHandler } from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {
  requestLogout,
  // requestAppInfo,
  // setAvailability
} from '../../store/actions'
import { Actions } from 'react-native-router-flux'

import Header from './Header'
import Body from './Body'

import styles from './styles'

class MainScreen extends Component {
  constructor(props){
    super(props)
  }

  componentDidMount() {
    // BackHandler.addEventListener('hardwareBackPress', () => true)
  }

  render() {
    const {
      id,
      name,
      requestLogout
    } = this.props

    const headProps = {
      id, name, logOut : requestLogout
    }

    const bodyProps = {
      onPress : (id, passengers) => {
        console.log(id, passengers)
        Actions.push('ride', { id, passengers })
        // console.log(id, name)
      }
    }

    return (
      <View style={ [ styles.container ] }>
        <Header {...headProps} />
        <Body {...bodyProps} />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  available : state.appInfo.isAvailable,
  auth : state.user.isAuth,
  id : state.user.id,
  name : state.user.user,
  from : state.appInfo.from,
  to : state.appInfo.to
})

const mapDispatchToProps = dispatch => bindActionCreators({
  requestLogout,
  // requestAppInfo,
  // setAvailability,
}, dispatch)

export default connect( mapStateToProps, mapDispatchToProps )(MainScreen)