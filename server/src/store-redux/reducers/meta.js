const defaultState = {
  error : '',
  
}

export const meta = (state = defaultState, action) => {
  switch(action.type) {
    case 'ERROR' :
      return { ...state, error : action.payload }
    case 'CLEAR' :
      return defaultState
    default :
      return state
  }
}