import { ADD_RIDES_COUNT, ADD_RIDES, SELECTED_RIDES, SET_RIDES_OPTION } from '../constants'

const defaultState = {
  rides : [],
  count : 0,
  selectedRides : [],
  searchOptions : {
    pending : true,
    finished : false,
    assigned : false,
    onTheWay : false,
    future : true,
  }
}

export const ride = (state = defaultState, { type, payload }) => {
  // console.log(state)
  // console.log(action)
  switch (type) {
    case SET_RIDES_OPTION :
      return { ...state, searchOptions : { ...state.searchOptions, ...payload }}
    case SELECTED_RIDES :
      return { ...state, selectedRides : [].concat(payload) }
    case ADD_RIDES_COUNT :
      return { ...state, count : payload }
    case ADD_RIDES :
      return { ...state, rides : [].concat(payload) }
    case 'CLEAR_RIDES' :
      return { ...state, rides : [] }
    default :
      return state
  }
}
