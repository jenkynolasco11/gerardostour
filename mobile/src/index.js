import React, { PureComponent as Component } from 'react'
import { View, StatusBar } from 'react-native'
import { Container, Root, Toast } from 'native-base'

import { Router, Scene } from 'react-native-router-flux'
import { connect, Provider } from 'react-redux'

import Landing from './components/landing'

import store from './store'

class App extends Component {
  componentWillUnmount() {
    // TODO : Check this out! 
    // Supposedly bug fix for toast
    // Toast.toastInstance = null
  }

  render() {
    return (
      <Provider store={ store }>
        <Root>
          <StatusBar barStyle="light-content"/>
          <Landing />
        </Root>
      </Provider>
    )
  }
}

export default App