import App from './app'
import Auth from './auth'
// import Meta from './meta'
import Ride from './ride'

export const {
  logUserIn,
  logUserOut,
  checkAuth,
} = Auth

// export const {
//   snackBarMessage
//   // tryLogin,
//   // logUserIn,
//   // logUserOut,
//   // errorMessage,
//   // checkAuthentication,
// } = Meta

export const {
  toggleDrawer,
  showLoader,
  showSnackBar,
  showSnackBarWithMessage,
} = App

export const {
  retrieveRides,
  setSelectedRides,
  setQueryOption,
  submitRideData,
  assignBusToRides
} = Ride

export default {
  // ...Meta,
  ...App,
  ...Ride
}