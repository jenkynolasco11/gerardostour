import axios from 'axios'

import { loginSuccess, loginFailed, showError, fetchingStatus } from './app'

// axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded, application/json' 
// axios.defaults.headers.common.crossDomain = true 
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = ''
// axios.defaults.headers.common['Accept'] = 'application/json, text/plain, *'

const SERVER = 'http://localhost:8000/api/v1'

// ///////////////////////
// Meta
// ///////////////////////
// export const login = payload => ({ type : 'LOGIN_USER', payload })
export const logUserIn = payload => ({ type : 'LOG_USER_IN', payload })

export const logUserOut = payload => ({ type : 'LOG_USER_OUT', payload })

export const errorMessage = payload => ({ type : 'ERROR_MESSAGE', payload })

// ///////////////////////
// Thunks
// ///////////////////////
export const tryLogin = ({ username, password }) => {
  return async dispatch => {
    const config = {
      // crossdomain : true,
      headers : { 
        'Content-Type': 'application/x-www-form-urlencoded'//, application/json',
        // 'Access-Control-Allow-Origin' : '',
        // 'Accept' : 'application/json'
        // 'Access-Control-Allow-Origin' : 'http://localhost:3000',
      }
    }

    if(!username || !password) {
      dispatch(errorMessage('Please, provide username and password.'))
      return dispatch(showError(true))
    }

    const body = { username, password }

    try {
      const url = SERVER + '/auth/login'
      const { data } = await axios.post(url, body, config.headers)

      console.log(data)
      if(data.ok) {
        
        const user = data.data

        dispatch(loginSuccess(true))
        return dispatch(logUserIn(user))
      }
    } catch (e) {
      console.log(e)

      dispatch(errorMessage('Error with the network. Please, try again later or contact an admin.'))
      dispatch(showError(true))
    }

    return dispatch(loginFailed(false))
  }
}

export const checkAuthentication = () => {
  return async dispatch => {
    // dispatch(fetchingStatus(true))
    try {
      const url = SERVER + '/auth/check-auth'
      const { data } = await axios.get(url)

      console.log(data)
      // dispatch(fetchingStatus(false))
     
      if( data.ok ) {
        const user = data.data
        
        dispatch(loginSuccess(true))
        return dispatch(logUserIn(user))
      }
      console.log('here')
      dispatch(loginFailed())
      return dispatch(logUserOut())
    } catch (e) {
      console.log(e)
      // dispatch(loginFailed())
    }
    // dispatch(fetchingStatus(false))
  }
}

export default {
  tryLogin,
  loginSuccess,
  loginFailed,
  errorMessage,
  checkAuthentication,
}