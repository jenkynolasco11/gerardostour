import Auth from './auth'
import App from './app'
import Ride from './ride'

export const {
  requestLogin,
  requestLogout,
  disableLoginButton,
  logUserIn,
  logUserOut,
  setActiveStatusTo
} = Auth

export const {
  // showMessage,
  showSpinner
} = App

export const {
  // addRide,
  addRides,
  removeRide,
  removeRides,
  requestRides,
  addDispatchedRides,
} = Ride

export default {
  ...Auth,
  ...App,
  ...Ride
}
// import { Actions, ActionConst } from 'react-native-router-flux'
// import { BASEURL, TIMEOUT } from '../../../config'
// //////////////////// ACTIONS //////////////////////

// // Payload : { user : String, id : Number }
// export const login = payload => ({ type: 'LOGIN', payload })

// // Payload : {}
// export const logout = payload => ({ type: 'LOGOUT', payload })

// // Payload : { to : String, from : String }
// export const nextTrip = payload => ({ type: 'NEXT_TRIP', payload })

// // Payload : { confirmed : boolean}
// export const confirmTrip = payload => ({ type: 'CONFIRM_TRIP', payload })

// // Payload : { cantAuth : boolean }
// export const cantAuthenticate = payload => ({ type: 'CANT_AUTH_META', payload })

// // Payload : { badAuth : boolean }
// export const badAuthentication = payload => ({ type: 'BAD_AUTH_META', payload })

// // Payload : {}
// export const clearMeta = payload => ({ type: 'CLEAR_META', payload })

// // // Payload : { id : Number }
// // export const isAvailable = payload => ({ type: 'IS_AVAILABLE', payload })

// // // Payload : { id : Number }
// // export const cancelAvailable = payload => ({ type: 'CANCEL_AVAILABLE', payload })

// // Payload : { isAvailable : boolean }
// export const makeAvailable = payload => ({ type: 'MAKE_AVAILABLE', payload })

// ////////////////////// THUNKS ///////////////////

// // Thunk => userInfo : { user: String, pass: String }


// // Thunk => { id : Number }
// export const requestLogout = id => {
//   return async dispatch => {
//     try {
//       if(checkAuth(id)) {
//         const options = { method : 'GET'}
//         const res = await fetch(`${BASEURL}/auth/logout/${id}`, options)
//         const data = await res.json()

//         if(data.ok) {
//           // TODO : Fix this later
//           dispatch(logout())
//           Actions.reset('auth')
//         }
//       }
//     } catch (e) {
//       //
//     }
//     dispatch(clearMeta())
//   }
// }

// // Thunk => { id : Number, action : String }
// export const setAvailability = (id, action) => {
//   const route = (action === 'cancel')
//             ? 'no-'
//             : ''

//   return async dispatch => {
//     try {
//       if(checkAuth(id)) {
//         const options = { method : 'GET' }
//         const res = await fetch(`${BASEURL}/user/${route}available`, options)
//         const data = await res.json()

//         return dispatch(makeAvailable({ isAvailable : data.ok }))
//       }
//     } catch(e) {
//       console.log(e)

//       // TODO : Check this out later
//       return dispatch(makeAvailable({ isAvailable : false }))
//     }
//   }
// }

// // Checks if user is authenticated in server
// const checkAuth = async id => {
//   try {
//     let res = await fetch(`${BASEURL}/auth/${id}`)
//     let data = await res.json()

//     return data.ok || false
//   } catch (e) {
//     // console.log(e)

//     return false
//   }
// }

// const timeout = time => {
//   return new Promise((_, rej) => {
//     setTimeout(() => {
//       return rej('timed out')
//     }, time)
//   })
// }
