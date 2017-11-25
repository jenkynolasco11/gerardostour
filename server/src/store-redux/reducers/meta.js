const defaultState = {
  error : '',
  fetching : true,
  user : {}
}

export const meta = (state = defaultState, action) => {
  switch(action.type) {
    case 'FETCHING':
      return { ...state, fetching : action.payload }
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