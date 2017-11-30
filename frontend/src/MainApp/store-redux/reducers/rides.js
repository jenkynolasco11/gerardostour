const defaultState = {
  rides : []
}

export const rides = (state = defaultState, action) => {
  switch (action.type) {
    case 'ADD_RIDES' :
      return { ...state, rides : [].concat(action.payload) }
    case 'CLEAR_RIDES' :
      return { ...state, rides : [] }
    default :
      return state
  }
}
