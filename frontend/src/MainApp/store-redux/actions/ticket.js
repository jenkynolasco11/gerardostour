import axios from 'axios'

import { showLoader, showSnackBarWithMessage } from './app'
// import { showSnackBarWithMessage } from './app'
import { url } from '../../config/config-values.json'

// ///////////////////////
// Rides
// ///////////////////////
/*export */ const addTickets = payload => ({ type : 'ADD_TICKETS', payload })

/*export */ const addCount = payload => ({ type : 'ADD_COUNT', payload })

// /*export */ const setSelectedTickets = payload => ({ type : 'SELECTED_TICKETS', payload })

/*export */ const setTicketQueryOption = payload => ({ type : 'SET_OPTION_TICKETS', payload })

// /*export */ const clearTickets = payload => ({ type : 'CLEATICKETS', payload })


// ///////////////////////
// Thunks
// ///////////////////////
export const retrieveTickets = query => async dispatch => {
  const { skip, limit, sort, status, unassigned } = query

  try {
    dispatch(showLoader(true))

    const { data } = await axios.get(`${ url }/ticket/all?skip=${ skip }&limit=${ limit }&sort=${ sort }&status=${ status }&unassigned=${ unassigned }`)

    if(data.ok) {
      const { count, tickets } = data.data

      dispatch(addCount(count))
      dispatch(addTickets(tickets))
    }
  } catch (e) {
    // console.log(e)
    return dispatch(retrieveTickets(query))
  }

  return dispatch(showLoader(false))
}

export const submitTicketData = body => async dispatch => {
    // console.log(body)
  //   
    try {
      dispatch(showLoader(true))

      const { person, payment, time, date, ...rest } = body
      const { type, ...restPayment } = payment
      
      const postdata = {
        ...rest,
        ...person,
        ...restPayment,
        paymentType : type
      }

      const { data } = await axios.post(`${ url }/ticket/save`, postdata)

      if(data.ok) dispatch(showSnackBarWithMessage('Saved successfuly!'))
      else dispatch(showSnackBarWithMessage(`Couldn't save your ticket... => ${ data.message }`))
    } catch (e) {
      console.log(e)
    }

    return dispatch(showLoader(false))

  // const { id, bus, routeTo, routeFrom, time, date, status } = data

  // try {
  //   dispatch(showLoader(true))

  //   const body = { bus, routeTo, routeFrom, time, date, status : status !== 'PENDING' ? status : 'ASSIGNED' }

  //   let data = null
    
  //   if(id) data = await axios.put(`${ url }/ride/${ id }/modify`, body)
  //   else data = await axios.post(`${ url }/ride/save`, body)


  //   if(data.data.ok) dispatch(showSnackBarWithMessage('Saved successfuly!'))
  //   else dispatch(showSnackBarWithMessage(`Couldn't save your ride... => ${ data.data.message }`))
  // } catch (e) {
  //   console.error(e)
  // }

  // return dispatch(showLoader(false))
}

export const assignTicketsToRide = (tickets, ride) => async dispatch => {
  try {
    dispatch(showLoader(true))

    const { data } = await axios.put(`${ url }/ticket/modify/ride`, { tickets, ride })

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
  setTicketQueryOption,
  assignTicketsToRide
  // retrieveRides,
  // submitRideData,
  // setSelectedRides,
  // setQueryOption,
  // assignBusToRides
}