import App from './app'
import Meta from './meta'
import Rides from './rides'

export const {
  tryLogin,
  logUserIn,
  logUserOut,
  errorMessage,
  checkAuthentication,
} = Meta

export const {
  fetchingStatus,
  savingStatus,
  loginFailed,
  loginSuccess,
  toggleDrawer,
  showError,
} = App

export const { 
  addRides,
  getAllRides
} = Rides

export default {
  ...Meta,
  ...App,
  ...Rides
}