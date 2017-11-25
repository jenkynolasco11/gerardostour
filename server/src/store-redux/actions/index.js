import Meta from './meta'
import Rides from './rides'
import Router from './router'
import Users from './users'

export const {
  addUsers,
  retrieveUsers,
} = Users

export const { 
  addSwitches,
  changeRoute,
  popHistory,
  pushHistory
} = Router

export const {
  addRides,
  retrieveRides,
} = Rides

export const {
  clearMeta,
  assignLoggedUser,
  retrieveCurrentUser,
  logout,
  logUserOut,
  toggleMenu,
  savingMeta,
  fetchingMeta,
  errorMeta
} = Meta

export default {
  ...Router,
  ...Rides,
  ...Meta,
  ...Users
}