import { combineReducers } from 'redux'

import { ride } from './ride'
import { auth } from './auth'
import { app } from './app'
import { settings } from './settings'
// import { meta } from './appMeta'

const allReducers = combineReducers({
  settings,
  ride,
  // routes,
  auth,
  app,
  // meta,
})

export default allReducers