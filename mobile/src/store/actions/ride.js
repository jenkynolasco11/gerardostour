import axios from 'axios'
import { AsyncStorage } from 'react-native'
import { showSpinner } from './app'
// import axios from 'axios'

import { APIURL, TIMEOUT } from '../../../config'
import { showMessage } from '../../utils/index';

export const addRides = payload => ({ type : 'ADD_RIDES', payload })

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

      // const rds = rides.map(obj => ({ ...obj, added : new Date() }))

      await AsyncStorage.setItem('rides', JSON.stringify(rides))

      console.log(rides.length)
      dispatch(addRides(rides))
      showMessage('Rides downloaded!')
    }
  } catch (e) {
    console.log(e)
  }

  return dispatch(showSpinner(false))
}

export default {
  addRides,
  removeRides,
  requestRides
}