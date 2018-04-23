import axios from 'axios'

import { showSnackBarWithMessage } from './app'
import { clearRides } from './ride'
import { clearTickets } from './ticket'
import { AUTH_SUCCESS, LOG_USER_OUT } from '../constants'
import { url } from '../../config/config-values.json'

/*export */const authSuccess = payload => ({ type : AUTH_SUCCESS, payload })

/*export */const userLogOut = payload => ({ type : LOG_USER_OUT, payload })

// Thunks
export const logUserIn = (username, password) => async dispatch => {
  try {
    const body = { username, password }
    const URL = `${ url }/auth/login`

    // const res = await axios.post(URL, body, {
    //   headers : {
    //     'cache-control': 'no-cache',
    //     // 'with-credentials' : true
    //   }
    // })
    const res = await axios(URL, {
      method : 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      withCredentials : true,
      data : body,
    })

    // console.log(res)

    const { data } = res

    console.log(data)

    if(data.ok) {
      const { userInfo } = data.data

      // TODO : store the username in LocalStorage
      window.sessionStorage.setItem('session:user', userInfo.username)

      // checkAuth()

      return dispatch(authSuccess({ user : userInfo.username, isAuth : true }))
    }
  } catch (e) {
    console.log('indeed, an error...')
    console.log(e)
  }
}

export const checkAuth = () => async dispatch => {

  // ////////////////////////////////
  // TODO: Remove this after finding out what's happening with the passport/session module
  // ////////////////////////////////
  return dispatch(authSuccess({ user : 'JENKY-TEST; SESSION IS BROKEN', isAuth : true }))
  // const username = window.sessionStorage.getItem('session:user')

  // try {
  //   const { data } = await axios.get(`${ url }/auth/check-auth`)

  //   if(data.ok) {
  //     const { userInfo } = data.data

  //     return dispatch(authSuccess({ user : userInfo.username, isAuth : true }))
  //   }
    
  // } catch (e) {
  //   console.log('checkAuth thunk at /actions/auth.js')
  //   console.log(e)
  // }

  // window.sessionStorage.removeItem('session:user')
  // return setTimeout(checkAuth(username), 2000)
  // return
}

export const logUserOut = (username = '') => async dispatch => {
  try {
    const { data } = await axios.get(`${ url }/auth/logout`)
    
    dispatch(showSnackBarWithMessage('Logged out!'))
    dispatch(clearTickets())
    dispatch(clearRides())
    dispatch(checkAuth())
    // console.log(data)
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
