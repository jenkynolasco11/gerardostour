const defaultApp = {
  isUserLoggedIn : false, // change this later to false
  isFetching : false,
  isError : false,
  isDrawerOpen : false,
  isSaving : false,
}

export const app = (state = defaultApp, action) => {
  switch(action.type) {
    case 'FETCHING_DATA' :
      return { ...state, isFetching : action.payload }
    case 'SAVING_DATA' : 
      return { ...state, isSaving : action.payload }
    case 'SHOW_ERROR' :
      return { ...state, isError : action.payload }
    case 'LOGIN_FAILED' :
      return { ...state, isUserLoggedIn : false }
    case 'LOGIN_SUCCESS' :
      return { ...state, isUserLoggedIn : true }
    case 'TOGGLE_DRAWER' :
      return { ...state, isDrawerOpen : action.payload }
    default :
      return state
  }
}