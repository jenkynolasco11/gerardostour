import React from 'react'
import {
  View,
  StatusBar
} from 'react-native'

import { Router, Scene } from 'react-native-router-flux'
import { connect, Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import promise from 'redux-promise'

import Landing from './components/landing'

import reducer from './store'

const RouterWithRedux = connect()(Router)

const middlewares = [ thunk,/*, promise, /* logger has to be last*//* logger*/ ]

const store = createStore(
  reducer,
  compose(
    applyMiddleware(...middlewares),
    // devTools({
    //   name : Platform.OS,
    //   hostname : 'localhost',
    //   port : 5678
    // })
  )
)

const MainScene = () => (
  <View style={{ flex : 1 }}>
    <StatusBar barStyle={ 'light-content' }/>
    <Landing />
  </View> 
)

const App = () => (
  <Provider store={ store }>
    <MainScene />
  </Provider>
)

export default App