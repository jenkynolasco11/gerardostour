// ///////////////////////
// Router
// ///////////////////////
export const changeRoute = payload => ({ type : 'SWITCH', payload })

export const addSwitches = payload => ({ type : 'ADD_SWITCH', payload })

export const pushHistory = payload => ({ type : 'PUSH_HISTORY', payload })

export const popHistory = payload => ({ type : 'POP_HISTORY', payload })

export default {
  changeRoute, 
  addSwitches,
  pushHistory,
  popHistory
}