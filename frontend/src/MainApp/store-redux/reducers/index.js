import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import { ride } from './ride'
import { app } from './app'
import { auth } from './auth'
import { ticket } from './ticket'

const reducers = combineReducers({
  routing : routerReducer, // React-Router
  ticket,
  ride,
  auth,
  app,
})

export default reducers