// ///////////////////////
// App
// ///////////////////////
export const toggleDrawer = payload => ({ type : 'TOGGLE_DRAWER', payload })

export const loginSuccess = payload => ({ type : 'LOGIN_SUCCESS', payload })

export const loginFailed = payload => ({ type : 'LOGIN_FAIL', payload })

export const showError = payload => ({ type : 'SHOW_ERROR', payload })

export const fetchingStatus = payload => ({ type : 'FETCHING_DATA', payload })

export const savingStatus = payload => ({ type : 'SAVING_DATA', payload })


// ///////////////////////
// Thunks
// ///////////////////////

export default {
  savingStatus,
  fetchingStatus,
  toggleDrawer,
  loginFailed,
  loginSuccess,
  showError,
}