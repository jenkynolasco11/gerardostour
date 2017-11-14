import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  View,
  Text,
  Keyboard,
  Animated,
  Easing,
  Modal,
} from 'react-native'

import { requestLogin, clearMeta } from '../../store/actions'

import styles from './styles'
import Inputs from './Inputs'

class Auth extends Component{
  user = 'jenky'
  pass = 'lllll'

  constructor(props) {
    super(props)

    this.state = {
      opacity : new Animated.Value(0)
    }

    this._onUsernameChange = this._onUsernameChange.bind(this)
    this._onPasswordChange = this._onPasswordChange.bind(this)
    this._checkInputs = this._checkInputs.bind(this)
    this._clearMessage = this._clearMessage.bind(this)
  }

  _clearMessage() {
    if(this.props.cantAuth)  this.props.cantAuthenticate({ cantAuth : false })
  }

  _onUsernameChange(user) {
    this.user = user
    this._clearMessage()
  }

  _onPasswordChange(pass) {
    this.pass = pass
    this._clearMessage()
  }

  _checkInputs() {
    const userdata = {
      user : this.user,
      pass : this.pass
    }

    this.props.requestLogin(userdata)
    Keyboard.dismiss()
  }

  componentDidMount() {
    const { opacity } = this.state

    Animated.timing(opacity, {
      toValue : 1,
      delay : 200,
      duration : 500,
      easing : Easing.linear
    }).start()

    // Keyboard.addListener('keyboardWillShow', this._extraHeight)
    // Keyboard.addListener('keyboardWillHide', this._remomveExtraHeight)

    // const { scale } = this.state

    // scale.addListener(({value}) => this._value = value)

    // const scaleIn = () => {
    // Animated.timing(scale, {
    //   easing : Easing.in,
    //   duration : 1000,
    //   toValue : 2
    // }).start()
      // }).start(() => {
      //   console.log`it shrinks`
      //   return Animated.timing(scale, {
      //     easing : Easing.in,
      //     duration : 1000,
      //     toValue : 1
      //   }).start(() => scaleIn())
      // })
    // }

    // scaleIn()
  }

  render() {
    // if(this.props.auth) console.log('it works')
    // console.log(this.props)
    return (
      <View style={ [styles.login ] }>
        <Inputs
          onUsernameChange={this._onUsernameChange}
          onPasswordChange={this._onPasswordChange}
          shouldDisable={false}
          checkInputs={this._checkInputs}
          opacity={this.state.opacity}
        />
        <Text style={ styles.trademark }>{`Created by Jenky Nolasco @ ${ new Date().getFullYear() }`}</Text>
        {
          this.props.cantAuth
           ? <Text style={styles.error}> Can't Authenticate. Please, try later. </Text>
           : this.props.badAuth
           ? <Text style={styles.error}> Bad username or Password. Try Again. </Text>
           : <View/>
        }
      </View>
    )
  }
}

const mapStateToProps = state => ({
  user : state.user,
  cantAuth : state.meta.cantAuth,
  badAuth : state.meta.badAuth,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  requestLogin,
  clearMeta
}, dispatch)

export default connect( mapStateToProps, mapDispatchToProps )(Auth)
// export default Auth