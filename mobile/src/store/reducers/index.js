import { combineReducers } from 'redux'

import { default as routes } from './routes'
import { user } from './auth'
import { appInfo } from './appInfo'
import { meta } from './appMeta'

const allReducers = combineReducers({
  routes,
  user,
  appInfo,
  meta,
})

export default allReducers