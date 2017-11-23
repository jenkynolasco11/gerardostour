import { combineReducers } from 'redux'

import { router } from './router'
import { meta } from './meta'
import { rides } from './rides'

const reducers = combineReducers({
  router,
  meta,
  rides,
})

export default reducers