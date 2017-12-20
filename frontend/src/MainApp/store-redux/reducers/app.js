const defaultApp = {
  isUserLoggedIn : false, // change this later to false
  isLoading : false,
  isDrawerOpen : false,
  isSaving : false,

  // Snackbar
  showSnackbar : false,
  snackbarMessage : '',
}

export const app = (state = defaultApp, { type, payload }) => {
  switch(type) {
    case 'SHOW_LOADER' :
      return { ...state, isLoading : payload }
    case 'SHOW_SNACKBAR' :
      return { ...state, ...payload }
    case 'TOGGLE_DRAWER' :
      return { ...state, isDrawerOpen : payload }
    default :
      return state
  }
}