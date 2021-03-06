import { ADD_TICKETS, ADD_TICKETS_COUNT, /*SET_TICKETS_OPTION,*/ CLEAR_TICKETS } from '../constants'

const defaultState = {
  tickets : [],
  count : 0,
  selectedTickets : [],
  // searchOptions : {
    // unassigned : true,
    // status : {
    //   redeemed : true,
    //   new : true,

    // },
    // type : {
      
    // }
    // redeemed : true,
    // deleted : false,
    // tnull : false,
    // used : false,
    // tnew : true,
  //   // isPackage : false,
  // }
}
// [ 'USED', 'REDEEMED', 'NULL', 'NEW', 'DELETED' ]
export const ticket = (state = defaultState, { type, payload }) => {
  switch (type) {
    // case SET_TICKETS_OPTION :
    //   // console.log(payload)
    //   return { ...state, searchOptions : { ...state.searchOptions, ...payload }}
    // case 'SELECTED_TICKETS' :
    //   return { ...state, selectedTickets : [].concat(payload) }
    case ADD_TICKETS_COUNT :
      return { ...state, count : payload }
    case ADD_TICKETS :
      return { ...state, tickets : [].concat(payload) }
    case CLEAR_TICKETS :
      return { ...state, tickets : [], count : 0 }
    default :
      return state
  }
}
