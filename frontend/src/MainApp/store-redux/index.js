import reducers from './reducers'
import thunk from 'redux-thunk'
import { compose, applyMiddleware, createStore } from 'redux'

const middlewares = [ thunk ]
const reduxDevtoolExt = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__

const composeEnhancers = // compose
  reduxDevtoolExt
    ? reduxDevtoolExt({})
    : compose

const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(...middlewares)),
)

export default store