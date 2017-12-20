import axios from 'axios'

import { url } from '../../config/config-values.json'

/*export */const authSuccess = payload => ({ type : 'AUTH_SUCCESS', payload })

/*export */const userLogOut = payload => ({ type : 'LOG_USER_OUT', payload })

// Thunks
export const logUserIn = (username, password) => async dispatch => {
  try {
    const body = { username, password }

    const res = await axios.post(`${ url }/auth/login`, body, {
      headers : {
        'cache-control': 'no-cache',
      }
    })

    const { data } = res

    if(data.ok) {
      const { userInfo } = data.data

      // TODO : store the username in LocalStorage
      window.sessionStorage.setItem('session:user', userInfo.username)

      checkAuth()

      return dispatch(authSuccess({ user : userInfo.username, isAuth : true }))
    }
  } catch (e) {
    console.log('indeed, an error...')
    console.log(e)
  }
}

export const checkAuth = (username = '') => async dispatch => {

  // ////////////////////////////////
  // TODO: Remove this after finding out what's happening with the passport/session module
  // ////////////////////////////////
  return dispatch(authSuccess({ user : 'JENKY-TEST; SESSION IS BROKEN', isAuth : true }))

  // try {
  //   const { data } = await axios.get(`${ url }/auth/check-auth`)

  //   if(data.ok) return console.log(data)
    
  // } catch (e) {
  //   console.log('checkAuth thunk at /actions/auth.js')
  //   console.log(e)
  // }

  // window.sessionStorage.removeItem('session:user')
  // return setTimeout(checkAuth(), 2000)
}

export const logUserOut = (username = '') => async dispatch => {
  try {
    const { data } = await axios.get(`${ url }/auth/logout`)
    
    console.log('Login out')
    console.log(data)
  } catch (e) {
    console.log(e)
  }

  return dispatch(userLogOut())
}

export default {
  // authSuccess,
  checkAuth,
  logUserOut,
  logUserIn,

}