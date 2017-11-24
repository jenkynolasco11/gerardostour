import axios from 'axios'

import { clearMeta } from './meta'

// ///////////////////////
// Rides
// ///////////////////////
export const addRides = payload => ({ type : 'ADD_RIDES', payload })

// ///////////////////////
// Thunks
// ///////////////////////
export const retrieveRides = ({ limit = 10, skip = 0 }) => {
  return async dispatch => {
    try {
      const res = await axios.get('/api/ride/all', { params : { limit, skip }})
      if(res.data.data) return dispatch(addRides(res.data.data))

      return dispatch(addRides([]))
    } catch (e) {
      console.log(e)
      return dispatch(clearMeta(/*  */))
    }
  }
}

export default {
  retrieveRides,
  addRides
}