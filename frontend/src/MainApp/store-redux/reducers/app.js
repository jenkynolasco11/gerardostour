const defaultApp = {
  isUserLoggedIn : false,
  isFetching : false,
  isError : false,
  isDrawerOpen : false,
  isSaving : false,
}

export const app = (state = defaultApp, action) => {
  switch(action.type) {
    case 'LOGOUT' :
      return { ...state, isUserLoggedIn : false }
    case 'LOGIN_SUCCESS' :
      return { ...state, isUserLoggedIn : true }
    case 'TOGGLE_DRAWER' :
      return { ...state, isDrawerOpen : action.payload }
    default :
      return state
  }
}