import Meta from './meta'
import Rides from './rides'
import Router from './router'

export const { 
  addSwitches,
  changeRoute
} = Router

export const {
  addRides,
  retrieveRides
} = Rides

export const {
  //
  clearMeta
} = Meta

export default {
  ...Router,
  ...Rides,
  ...Meta
}