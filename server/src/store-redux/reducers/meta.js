const defaultState = {
  error : '',
  user : {}
}

export const meta = (state = defaultState, action) => {
  switch(action.type) {
    case 'ERROR' :
      return { ...state, error : action.payload }
    case 'USER' :
      return { ...state, user : action.payload }
    case 'CLEAR' :
    case 'LOGOUT' :
      return defaultState
    default :
      return state
  }
}