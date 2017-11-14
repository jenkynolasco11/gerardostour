import React, { Component } from 'react'
import { View } from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {
  requestLogout,
  // requestAppInfo,
  setAvailability
} from '../../store/actions'

import Header from './Header'
import Body from './Body'

import styles from './styles'

class MainScreen extends Component {
  constructor(props){
    super(props)
    // this.state = {
    //   id : 1024053,
    //   name : 'Mark Ronzon',
    //   from : 'NYC',
    //   to : 'PENN'
    // }
    this._setAvailability = this._setAvailability.bind(this)
  }

  _setAvailability() {
    return this.props.setAvailability(this.props.id, 
      this.props.isAvailable ? 'cancel' : 'set'
    )
  }

  render() {
    const {
      id,
      name,
      from,
      to
    } = this.props

    return (
      <View style={ [ styles.container ] }>
        <Header {...{
          id, 
          name, 
          from, 
          to,
          makeAvailable : this._setAvailability,
          logout : this.props.requestLogout,
        }}/>
        <Body />
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
  setAvailability,
}, dispatch)

export default connect( mapStateToProps, mapDispatchToProps )(MainScreen)