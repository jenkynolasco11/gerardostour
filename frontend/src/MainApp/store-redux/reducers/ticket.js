const defaultState = {
  tickets : [],
  count : 0,
  selectedTickets : [],
  searchOptions : {
    unassigned : true,
    redeemed : true,
    deleted : false,
    tnull : false,
    used : false,
    tnew : true,
  }
}
// [ 'USED', 'REDEEMED', 'NULL', 'NEW', 'DELETED' ]
export const ticket = (state = defaultState, { type, payload }) => {
  switch (type) {
    case 'SET_OPTION_TICKET' :
      return { ...state, searchOptions : { ...state.searchOptions, ...payload }}
    case 'SELECTED_TICKETS' :
      return { ...state, selectedTickets : [].concat(payload) }
    case 'ADD_COUNT' :
      return { ...state, count : payload }
    case 'ADD_TICKETS' :
      return { ...state, tickets : [].concat(payload) }
    case 'CLEAR_TICKETS' :
      return { ...state, tickets : [] }
    default :
      return state
  }
}
