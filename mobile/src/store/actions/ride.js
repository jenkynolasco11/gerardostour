import axios from 'axios'
import { AsyncStorage } from 'react-native'
import store from '../index'
// import axios from 'axios'

import { showSpinner } from './app'
import { APIURL, TIMEOUT } from '../../../config'
import { showMessage } from '../../utils/index';

// export const addRide = payload => ({ type : 'ADD_RIDE', payload })

export const addRides = (payload = []) => ({ type : 'ADD_RIDES', payload })

export const removeRide = payload => ({ type : 'REMOVE_RIDE', payload })

export const removeRides = payload => ({ type : 'REMOVE_RIDES', payload : [] })

export const requestRides = bus => async dispatch => {
  const url = `${ APIURL }/ride/all/${ bus }`

  dispatch(showSpinner(true))

  try {
    await AsyncStorage.removeItem('rides')

    const { data } = await axios.get(url)

    if(data.ok) {
      const { rides } = data.data

      await AsyncStorage.setItem('rides', JSON.stringify(rides))

      dispatch(addRides(rides))
      showMessage('Rides downloaded!')
    }
  } catch (e) {
    console.log(e)
  }

  return dispatch(showSpinner(false))
}

export const addDispatchedRides = rides => async dispatch => {
  try {
    const state = store.getState()

    const ridesToAdd = []

    rides.forEach(newRide => {
      const rds = state.ride.rides.map(rid => {
        let rideToReturn = { ...rid }
        if(rid.datekey === newRide.datekey) rideToReturn = { ...rideToReturn, results : [].concat(new Set(rid.results, newRide.results)) }

        // console.log(rideToReturn)
        return rideToReturn
      })

      ridesToAdd.push(rds)
    })

    // console.log(ridesToAdd)

    await AsyncStorage.setItem('rides', JSON.stringify(...ridesToAdd))

    showMessage('New ride dispatched')

    dispatch(addRides(...ridesToAdd))
  } catch (e) {
    console.log(e)
  }
}

export default {
  // addRide,
  addRides,
  removeRide,
  removeRides,
  requestRides,
  addDispatchedRides,
}
