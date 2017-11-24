import axios from 'axios'

import { clearMeta } from './meta'

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
      const res = await axios.get('/api/user/all', { params : { limit, skip, type }})
      if(res.data.data) return dispatch(addUsers(res.data.data))

      return dispatch(addUsers([]))
    } catch (e) {
      dispatch(clearMeta(/**/))
    }
  }
}

export default {
  retrieveUsers,
  addUsers
}