import axios from 'axios'

import { clearMeta, fetchingMeta } from './meta'

// ///////////////////////
// Users
// ///////////////////////
export const addUsers = payload => ({ type : 'ADD_USERS', payload })

// ///////////////////////
// Thunks
// ///////////////////////
export const retrieveUsers = ({ limit = 10, skip = 0, type = 'ADMIN' }) => {
  console.log({limit, skip, type})
  return async dispatch => {
    try {
      dispatch(fetchingMeta(true))

      const res = await axios.get('/api/user/all', { params : { limit, skip, type }})
      
      dispatch(fetchingMeta(false))
      
      if(res.data.data) return dispatch(addUsers(res.data.data))

      return dispatch(addUsers([]))
    } catch (e) {
      dispatch(fetchingMeta(false))
      dispatch(clearMeta(/**/))
    }
  }
}

export default {
  retrieveUsers,
  addUsers
}