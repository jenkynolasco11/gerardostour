const defaultState = {
  rides : []
}

export const rides = (state = defaultState, action) => {
  switch(action.type) {
    case 'ADD_RIDES':
      return { ...state, rides : [].concat(action.payload) }
    default :
      return state
  }
}