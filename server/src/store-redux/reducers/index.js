import { combineReducers } from 'redux'

import { router } from './router'
import { meta } from './meta'
import { rides } from './rides'
import { users } from './users'

const reducers = combineReducers({
  router,
  meta,
  rides,
  users
})

export default reducers