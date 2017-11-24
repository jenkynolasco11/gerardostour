import axios from 'axios'

// ///////////////////////
// Meta
// ///////////////////////
export const clearMeta = payload => ({ type : 'CLEAR_META', payload : '' })

export const assignLoggedUser = payload => ({ type : 'USER', payload })

export const logout = payload => ({ type : 'LOGOUT', payload })

export const errorMeta = payload => ({ type : 'ERROR', payload })

// ///////////////////////
// Thunks
// ///////////////////////
export const retrieveCurrentUser = () => {
  return async dispatch => {
    try {
      const user = await axios.get('/api/user/current')

      return dispatch(assignLoggedUser(user.data.data))
    } catch (e) {
      return dispatch(assignLoggedUser({}))
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
    return dispatch(errorMeta('Error logging out...'))
  }
}

export default {
  clearMeta,
  assignLoggedUser,
  retrieveCurrentUser,
  logout,
  logUserOut,
}