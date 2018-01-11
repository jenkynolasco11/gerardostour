import { Actions, ActionConst } from 'react-native-router-flux'
import { AsyncStorage } from 'react-native'
import { Toast } from 'native-base'
import axios from 'axios'

import { showSpinner } from './app'
import { showMessage } from '../../utils'
import { APIURL, TIMEOUT } from '../../../config'

const { REPLACE } = ActionConst
let timeoutPromise = null
// Actions
export const logUserIn = payload => ({ type : 'LOG_USER_IN', payload })

export const logUserOut = payload => ({ type : 'LOG_USER_OUT', payload })

export const disableLoginButton = payload => ({ type : 'DISABLE_LOGIN_BUTTON', payload })

export const setActive = payload => ({ type : 'SET_ACTIVE_STATUS', payload })
// export const unsetActive = payload => ({ type : 'SET_ACTIVE_STATUS', payload : false })

// thunks
// userInfo => { user : String, pass : String }
export const requestLogin = userInfo => async dispatch => {
  const method = 'POST'
  
  clearTimeout(timeoutPromise)

  const timeout = t => {
    return new Promise((_, rej) => {
      setTimeout(() => {
        return rej('timed out')
      }, t)
    })
  }

  // TODO : Add security here
  const { user, pass } = userInfo

  const body = { username : user, password : pass, driverToken : true }
  const url = `${ APIURL }/auth/login/`

  try{
    dispatch(showSpinner(true))
    dispatch(disableLoginButton(true))

    const conditions = [ timeout(TIMEOUT), axios.post(url, body) ]
    const { data } = await Promise.race(conditions)

    if(data.ok) {
      const { username, busId = -1 } = data.data.userInfo

      //   // There is no bus assigned to this user. Talk to management
      if(busId !== -1) {
        dispatch(logUserIn({ user : username, isAuth : true, bus : busId }))
        showMessage(`Welcome, ${ username }`)

        Actions.replace('app')

      } else {
        showMessage('No bus assigned to this user. Contact management.', 'warning')
        dispatch(logUserOut())
      }
    } else showMessage(data.message.split('.')[ 0 ], 'warning')
  } catch(e) {
    console.log(`Something happened while authenticating: ${e}`)

    showMessage('Error while authenticating.', 'danger')
    dispatch(logUserOut()) // Just in case
  }
  
  timeoutPromise = setTimeout(() => dispatch(disableLoginButton(false)), TIMEOUT)
  return dispatch(showSpinner(false))
}

export const requestLogout = () => async dispatch => {
  // const body = { username : user, password : pass }
  const url = `${ APIURL }/auth/logout`

  clearTimeout(timeoutPromise)

  try {
    dispatch(showSpinner(true))

    const { data } = await axios.get(url)

    if(data.ok) showMessage('Logged out successfully!')
    else console.log('Guess the sessions aren\'t getting saved...')

    console.log(data.ok)

    Actions.reset('login') //Actions.popTo('landing')
  } catch (e) {
    console.log(e)
  }

  dispatch(logUserOut())
  return dispatch(showSpinner(false))
}

export const setActiveStatusTo = (bus, active) => async dispatch => {
  // console.log('HERE, ACTIVE AS F')
  const status = active ? 'Active' : 'Unactive'

  clearTimeout(timeoutPromise)

  try {
    // const rids = await AsyncStorage.getItem('rides')
    // console.log(rids)
    dispatch(showSpinner(true))

    const { data } = await axios.get(`${ APIURL }/bus/set-status/${ bus }/${ status.toUpperCase() }`)

    if(data.ok) {
      dispatch(setActive(active))
      showMessage(`Set to ${ status }`)
    } else showMessage(`Error while setting to ${ status.toLowerCase() }.`, 'warning')

  } catch (e) {
    console.log(e)
  }

  return dispatch(showSpinner(false))
}

export default {
  requestLogin,
  requestLogout,
  disableLoginButton,
  logUserIn,
  logUserOut,
  setActiveStatusTo
}