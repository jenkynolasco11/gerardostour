import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import { ride } from './ride'
import { app } from './app'
import { auth } from './auth'

const reducers = combineReducers({
  routing : routerReducer, // React-Router
  ride,
  app,
  auth,
})

export default reducers