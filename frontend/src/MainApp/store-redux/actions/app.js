import { SHOW_LOADER, SHOW_SNACKBAR, TOGGLE_DRAWER, SET_HEADER  } from '../constants'
// ///////////////////////
// App
// ///////////////////////
export const toggleDrawer = payload => ({ type : TOGGLE_DRAWER, payload })

// export const loginSuccess = payload => ({ type : 'LOGIN_SUCCESS', payload })

// export const loginFailed = payload => ({ type : 'LOGIN_FAIL', payload })

// export const showError = payload => ({ type : 'SHOW_ERROR', payload })

// export const fetchingStatus = payload => ({ type : 'FETCHING_DATA', payload })

// export const savingStatus = payload => ({ type : 'SAVING_DATA', payload })

export const showSnackBar = payload => ({ type : SHOW_SNACKBAR, payload })

export const showLoader = payload => ({ type : SHOW_LOADER, payload })

export const setHeader = payload => ({ type : SET_HEADER, payload })


// ///////////////////////
// Thunks
// ///////////////////////
export const showSnackBarWithMessage = message => dispatch => {
  dispatch(showSnackBar({ snackbarMessage : message, showSnackbar : true }))
  setTimeout(() => dispatch(showSnackBar({ snackbarMessage : '', showSnackbar : false })), 4000)
}


export default {
  showLoader,
  showSnackBar,
  showSnackBarWithMessage,
  setHeader,
  // savingStatus,
  // fetchingStatus,
  toggleDrawer,
  // loginFailed,
  // loginSuccess,
  // showError,
}
