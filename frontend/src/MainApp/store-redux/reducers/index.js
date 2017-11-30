import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import { meta } from './meta'
import { app } from './app'
import { rides } from './rides'

const reducers = combineReducers({
  routing : routerReducer,
  rides,
  meta,
  app,
})

export default reducers