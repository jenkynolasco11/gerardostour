import axios from 'axios'

import { filterTicket } from '../../utils'
import { ADD_TICKETS, ADD_TICKETS_COUNT, SET_TICKETS_OPTION, CLEAR_TICKETS } from '../constants'
import { showLoader, showSnackBarWithMessage } from './app'
// import { showSnackBarWithMessage } from './app'
import { url } from '../../config/config-values.json'

// ///////////////////////
// Rides
// ///////////////////////
/*export */ const addTickets = payload => ({ type : ADD_TICKETS, payload })

/*export */ const addCount = payload => ({ type : ADD_TICKETS_COUNT, payload })

// /*export */ const setSelectedTickets = payload => ({ type : 'SELECTED_TICKETS', payload })

// /*export */ const setTicketQueryOption = payload => ({ type : SET_TICKETS_OPTION, payload })

export const clearTickets = payload => ({ type : CLEAR_TICKETS, payload })


// ///////////////////////
// Thunks
// ///////////////////////
export const retrieveTickets = query => async dispatch => {
  const { skip, limit, sort, unassigned, search, searchCriteria, type, status } = query

  try {
    dispatch(showLoader(true))

    const URL =
      `${ url }/ticket/all?` +
      `skip=${ skip }&limit=${ limit }&sort=${ sort }&unassigned=${ unassigned }` +
      `&search=${ search }&searchCriteria=${ searchCriteria }` +
      `${ status ? `&status=${ status }` : '' }` +
      `${ type ? `&type=${ type }` : '' }`

    const { data } = await axios.get(URL)

    if(data.ok) {
      const { count, tickets } = data.data

      dispatch(addCount(count))
      dispatch(addTickets(tickets))
    } else {
      dispatch(addCount(0))
      dispatch(addTickets([]))
    }
  } catch (e) {
    // console.log(e)
    return setTimeout(() => dispatch(retrieveTickets(query)), 100)
  }

  return dispatch(showLoader(false))
}

export const submitTicketData = body => async dispatch => {
    try {
      const postdata = filterTicket(body)

      const { data } = await axios.post(`${ url }/ticket/save`, postdata)

      if(data.ok) dispatch(showSnackBarWithMessage('Saved successfully!'))
      else dispatch(showSnackBarWithMessage(`Couldn't save your ticket... => ${ data.message }`))
    } catch (e) {
      console.log(e)
    }
}

export const assignTicketsToRide = (tickets, ride) => async dispatch => {
  try {
    dispatch(showLoader(true))

    const { data } = await axios.put(`${ url }/ticket/assign/ride`, { tickets, ride })

    if(data.ok) dispatch(showSnackBarWithMessage('Saved successfuly!'))
    else dispatch(showSnackBarWithMessage(`Couldn't modify the tickets... => ${ data.message }`))
  } catch (e) {
    console.log(e)
  }

  return dispatch(showLoader(false))
}

// export const assignBusToRides = (bus, rides = [], query) => async dispatch => {
//   // try {
//   //   if(!bus) return dispatch(showSnackBarWithMessage('There is no bus assigned. Check what happened...'))
//   //   dispatch(showLoader(true))

//   //   const { data } = await axios.put(`${ url }/ride/assign-bus`, { bus, rides })

//   //   if(data.ok) dispatch(showSnackBarWithMessage(`Bus assignement successful! ${ data.message }`))
//   //   else dispatch(showSnackBarWithMessage(`Error while assigning bus data => ${ data.message }`))
//   // } catch (e) {
//   //   console.log(e)
//   // }

//   // return dispatch(retrieveRides(query))
//   // return dispatch(showLoader(true))
// }

///////////////////////////
// EXPORT
///////////////////////////
export default {
  retrieveTickets,
  submitTicketData,
  // setTicketQueryOption,
  assignTicketsToRide,
  clearTickets
  // retrieveRides,
  // submitRideData,
  // setSelectedRides,
  // setQueryOption,
  // assignBusToRides
}
