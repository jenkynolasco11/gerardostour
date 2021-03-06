import App from './app'
import Auth from './auth'
// import Meta from './meta'
import Ride from './ride'
import Ticket from './ticket'

export const {
  logUserIn,
  logUserOut,
  checkAuth,
} = Auth

export const {
  retrieveTickets,
  submitTicketData,
  setTicketQueryOption,
  assignTicketsToRide,
  clearTickets
} = Ticket

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
  setHeader
} = App

export const {
  retrieveRides,
  setSelectedRides,
  setRideQueryOption,
  submitRideData,
  assignBusToRides,
  dispatchToBus,
  clearRides
} = Ride

export default {
  // ...Meta,
  ...App,
  ...Ride,
  ...Auth,
  ...Ticket,
}
