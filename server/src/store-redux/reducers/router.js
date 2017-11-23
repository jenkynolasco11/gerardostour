const defaultState = {
  switches : [],
  which : null
}

export const router = (state = defaultState, action) => {
  switch(action.type) {
    case 'ADD_SWITCH' : 
      return { ...state, switches : [].concat(action.payload) }
    case 'ANOTHER' :
      return { ...state }
    case 'SWITCH' :
      // const which = action.payload
      return { ...state, ...action.payload }
    default :
      return state
  }
}