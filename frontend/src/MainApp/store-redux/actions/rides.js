import axios from 'axios'

import { fetchingStatus, showError } from './app'
import { errorMessage } from './meta'

const SERVER = 'http://localhost:8000/api/v1'

// ///////////////////////
// Rides
// ///////////////////////
export const addRides = payload => ({ type : 'ADD_RIDES', payload })

export const clearRides = payload => ({ type : 'CLEAR_RIDES', payload })

// ///////////////////////
// Thunks
// ///////////////////////
export const getAllRides = () => {
  return async dispatch => {
    try {
      const url = SERVER + '/ride/all'
      dispatch(fetchingStatus(true))
      const { data } = await axios.get(url)
      dispatch(fetchingStatus(false))
      
      if(data.ok) {
        dispatch(addRides(data.data))
      }
      
    } catch (e) {
      dispatch(showError(true))
      dispatch(errorMessage('Error while retrieving the rides.'))
    }

    return dispatch(fetchingStatus(false))
  }
}

///////////////////////////
// EXPORT
///////////////////////////
export default {
  addRides,
  getAllRides,
}