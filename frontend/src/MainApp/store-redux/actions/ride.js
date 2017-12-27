import axios from 'axios'

import { showLoader } from './app'
import { showSnackBarWithMessage } from './app'
import { url } from '../../config/config-values.json'

// ///////////////////////
// Rides
// ///////////////////////
/*export */ const addRides = payload => ({ type : 'ADD_RIDES', payload })

/*export */ const addCount = payload => ({ type : 'ADD_COUNT', payload })

/*export */ const setSelectedRides = payload => ({ type : 'SELECTED_RIDES', payload })

/*export */ const setRideQueryOption = payload => ({ type : 'SET_OPTION_RIDES', payload })

// /*export */ const clearRides = payload => ({ type : 'CLEAR_RIDES', payload })


// ///////////////////////
// Thunks
// ///////////////////////
export const retrieveRides = query => async dispatch => {
  const { skip, limit, sort, status, future } = query

  try {
    dispatch(showLoader(true))

    const { data } = await axios.get(`${ url }/ride/all?skip=${ skip }&limit=${ limit }&sort=${ sort }&status=${ status }&future=${ future }`)
    
    if(data.ok) {
      const { rides, count } = data.data

      dispatch(addCount(count))
      dispatch(addRides(rides))
    }
  } catch (e) {
    console.log(e)
    return dispatch(retrieveRides(query))
  }

  return dispatch(showLoader(false))
}

export const submitRideData = data => async dispatch => {

  const { id, bus, routeTo, routeFrom, time, date, status } = data

  try {
    dispatch(showLoader(true))

    const body = { bus, routeTo, routeFrom, time, date, status : status !== 'PENDING' ? status : 'ASSIGNED' }

    let data = null
    
    if(id) data = await axios.put(`${ url }/ride/${ id }/modify`, body)
    else data = await axios.post(`${ url }/ride/save`, body)


    if(data.data.ok) dispatch(showSnackBarWithMessage('Saved successfuly!'))
    else dispatch(showSnackBarWithMessage(`Couldn't save your ride... => ${ data.data.message }`))
  } catch (e) {
    console.error(e)
  }

  return dispatch(showLoader(false))
}

export const assignBusToRides = (bus, rides = [], query) => async dispatch => {
  try {
    if(!bus) return dispatch(showSnackBarWithMessage('There is no bus assigned. Check what happened...'))
    dispatch(showLoader(true))

    const { data } = await axios.put(`${ url }/ride/assign-bus`, { bus, rides })

    if(data.ok) dispatch(showSnackBarWithMessage(`Bus assignement successful! ${ data.message }`))
    else dispatch(showSnackBarWithMessage(`Error while assigning bus data => ${ data.message }`))
  } catch (e) {
    console.log(e)
  }

  return dispatch(retrieveRides(query))
  // return dispatch(showLoader(true))
}

///////////////////////////
// EXPORT
///////////////////////////
export default {
  retrieveRides,
  submitRideData,
  setSelectedRides,
  setRideQueryOption,
  assignBusToRides
}