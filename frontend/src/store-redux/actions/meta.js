import axios from 'axios'

axios.defaults.headers[ 'Access-Control-Allow-Origin' ] = 'http://localhost:8000'

const ERROR_TIMEOUT = 5000
const ERROR_CLEAR = { error : false, errorMsg : '' }
const HOST = 'http://localhost:8000'


// ///////////////////////
// Meta
// ///////////////////////
export const toggleMenu = payload => ({ type : 'TOGGLE_MENU', payload })

export const clearMeta = payload => ({ type : 'CLEAR_META', payload })

export const assignLoggedUser = payload => ({ type : 'USER', payload })

export const logout = payload => ({ type : 'LOGOUT', payload })

export const errorMeta = payload => ({ type : 'ERROR', payload })

export const fetchingMeta = payload => ({ type : 'FETCHING', payload })

export const savingMeta = payload => ({ type : 'SAVING', payload })

// ///////////////////////
// Thunks
// ///////////////////////
export const retrieveCurrentUser = () => {
  return async dispatch => {
    try {
      const user = await axios.get(HOST + '/api/user/current')

      return dispatch(assignLoggedUser(user.data.data))
    } catch (e) {
      return dispatch(assignLoggedUser({}))
      // Not sure about this part
      // return dispatch(errorMeta({ 
      //   error : true, 
      //   errorMsg : 'Error retrieving current logged user...' 
      // }))
      // return setTimeout(() => dispatch(errorMeta(ERROR_CLEAR)), ERROR_TIMEOUT)
    }
  }
}

export const logUserOut = () => {
  return async dispatch => {
    const res = await axios.get('/admin/auth/logout')

    if(res.data.data.ok) {
      dispatch(logout())
      return window.location.href = '/admin/auth'
    }
    return dispatch(errorMeta({ error : true, errorMsg : 'Error logging out...' }))
    // Not sure about this part
    // return setTimeout(() => dispatch(errorMeta(ERROR_CLEAR)), ERROR_TIMEOUT)
  }
}

export default {
  clearMeta,
  assignLoggedUser,
  retrieveCurrentUser,
  logout,
  logUserOut,
  fetchingMeta,
  errorMeta,
  toggleMenu,
  savingMeta
}