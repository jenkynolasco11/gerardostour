import React, { PureComponent as Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, Container, Text } from 'native-base'
import { StatusBar } from 'react-native'

import { requestLogin } from '../../store/actions'

import styles from './styles'
import Inputs from './Inputs'

class Auth extends Component{
  state = {
    user : 'nolasco',
    pass : 'nolasco',
  }

  constructor(props) {
    super(props)

    this._onSubmit = this._onSubmit.bind(this)
    this._onChange = this._onChange.bind(this)
  }

  _onChange(val, name) {
    return this.setState({ [ name ] : val })
  }

  _onSubmit() {
    const { user, pass } = this.state

    return this.props.login(user, pass)
  }

  render() {
    const { user, pass } = this.state
    const { disabled, isAuth } = this.props

    console.log('isAuth has been set to -> ' + isAuth + '.... Auth/index.js')
    
    return (
      <Container style={ styles.login }>
        { !isAuth && <StatusBar hidden /> }
        <View style={ styles.content }>
          <Inputs
            {...{
              user,
              pass,
              disabled,
              onSubmit : this._onSubmit,
              onChange : this._onChange
            }}
          />
          <Text style={ styles.createdBy }>
            Created by Jenky Nolasco
          </Text>
        </View>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  const { auth } = state

  return {
    disabled : auth.disableLoginBtn,
    isAuth : auth.isAuth
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  login: (user, pass) => requestLogin({ user, pass })
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Auth)