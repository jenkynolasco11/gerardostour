// import axios from 'axios'

// // import { clearMeta, fetchingMeta, savingMeta, errorMeta } from './meta'
// // import { changeRoute } from './router'

// const HOST = 'http://localhost:8000'

// // ///////////////////////
// // Users
// // ///////////////////////
// export const addUsers = payload => ({ type : 'ADD_USERS', payload })

// // ///////////////////////
// // Thunks
// // ///////////////////////
// export const retrieveUsers = ({ limit = 10, skip = 0, type = 'ADMIN' }) => {
//   return async dispatch => {
//     try {
//       // dispatch(fetchingMeta(true))

//       const res = await axios.get(HOST + '/api/user/all', { params : { limit, skip, type }})
//       // console.log`alsdjaosjdlaksfhasldkjaslfkjsaldajslfkj`
//       // dispatch(fetchingMeta(false))
      
//       if(res.data.data) return dispatch(addUsers(res.data.data))

//       return dispatch(addUsers([]))
//     } catch (e) {
//       // dispatch(fetchingMeta(false))
//       // dispatch(clearMeta(/**/))
//     }
//   }
// }

// export const saveUser = ({ username, firstname, lastname, password, phoneNumber }) => {
//   return async dispatch => {
//     try {
//       // dispatch(savingMeta(true))

//       const res = await axios.post(HOST + '/api/user/insert', { username, firstname, lastname, password, phoneNumber })

//       if(res.data.data) {
//         // dispatch(savingMeta(false))
//         // No error
//       }
//       // return dispatch(errorMeta(true))
//     } catch (e) {
//       // dispatch(savingMeta(false))
//       // dispatch(errorMeta(true))
//     }

//     // dispatch(changeRoute({ which : 'users', props : {}}))
//   }
// }

// export default {
//   retrieveUsers,
//   addUsers,
//   saveUser
// }