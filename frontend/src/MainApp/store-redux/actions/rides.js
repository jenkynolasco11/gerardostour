// import axios from 'axios'

// // import { clearMeta, fetchingMeta } from './meta'

// const HOST = 'http://localhost:8000'

// // ///////////////////////
// // Rides
// // ///////////////////////
// export const addRides = payload => ({ type : 'ADD_RIDES', payload })

// // ///////////////////////
// // Thunks
// // ///////////////////////
// export const retrieveRides = ({ limit = 10, skip = 0 }) => {
//   return async dispatch => {
//     try {
//       // dispatch(fetchingMeta(true))
      
//       const res = await axios.get(HOST + '/api/ride/all', { params : { limit, skip }})

//       // dispatch(fetchingMeta(false))
      
//       if(res.data.data) return dispatch(addRides(res.data.data))

//       return dispatch(addRides([]))
//     } catch (e) {
//       console.log(e)
//       // dispatch(fetchingMeta(false))
//       // return dispatch(clearMeta(/*  */))
//     }
//   }
// }

// export default {
//   retrieveRides,
//   addRides
// }