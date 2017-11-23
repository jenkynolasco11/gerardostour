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
      const res = await axios.get('http://localhost:8000/api/ride/all', { limit, skip })

      return dispatch(addRides(res.data.data))

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