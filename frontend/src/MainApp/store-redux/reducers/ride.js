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
    case 'SET_OPTION_RIDES' :
      return { ...state, searchOptions : { ...state.searchOptions, ...payload }}
    case 'SELECTED_RIDES' :
      return { ...state, selectedRides : [].concat(payload) }
    case 'ADD_COUNT' :
      return { ...state, count : payload }
    case 'ADD_RIDES' :
      return { ...state, rides : [].concat(payload) }
    case 'CLEAR_RIDES' :
      return { ...state, rides : [] }
    default :
      return state
  }
}
