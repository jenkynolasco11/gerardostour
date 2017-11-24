const defaultState = {
  rides : [],
  count : 0
}

export const rides = (state = defaultState, action) => {
  switch(action.type) {
    case 'ADD_RIDES':
      return { 
        ...state, 
        rides : [].concat(action.payload.rides),
        count : action.payload.count
      }
    default :
      return state
  }
}