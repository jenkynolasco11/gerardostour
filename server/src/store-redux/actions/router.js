// ///////////////////////
// Router
// ///////////////////////
export const changeRoute = payload => ({ type : 'SWITCH', payload })

export const addSwitches = payload => ({ type : 'ADD_SWITCH', payload })

export default {
  changeRoute, 
  addSwitches
}