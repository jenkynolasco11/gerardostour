const defaultState = {
  isFetching : false,
  error : { isError : false, errorMsg : '' },
  config : { listLimit : 10 },
  user : { firstname : '', lastname : '' },
  isMenuOpen : false,
  isSaving : true,
}

export const meta = (state = defaultState, action) => {
  switch(action.type) {
    case 'TOGGLE_MENU' :
      // console.log(action.payload)
      return { ...state, isMenuOpen : action.payload }
    case 'SAVING': 
      return { ...state, isSaving : action.payload }
    case 'FETCHING':
      return { ...state, isFetching : action.payload }
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