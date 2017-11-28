import App from './app'
// import Meta from './meta'
// import Rides from './rides'
// import Router from './router'
// import Users from './users'

// export const {
//   addUsers,
//   retrieveUsers,
// } = Users

// export const { 
//   addSwitches,
//   changeRoute,
//   popHistory,
//   pushHistory
// } = Router

export const {
  toggleDrawer,
  successLogin,
} = App

// export const {
//   addRides,
//   retrieveRides,
// } = Rides

// export const {
//   // toggleDrawer
// } = Meta

export default {
  ...App
  // ...Router,
  // ...Rides,
  // ...Meta,
  // ...Users
}