import { createStore, applyMiddleware, compose } from 'redux'
import promise from 'redux-promise'
import logger from 'redux-logger'
import thunk from 'redux-thunk'

import reducers from './reducers'

const middlewares = [ thunk,/*, promise, /* logger has to be last*//* logger*/ ]

const store = createStore(
  reducers,
  compose(
    applyMiddleware( ...middlewares ),
    // devTools({
    //   name : Platform.OS,
    //   hostname : 'localhost',
    //   port : 5678
    // })
  )
)

// console.log(store.getState())

export default store