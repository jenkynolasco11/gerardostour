const defaultState = {
  rides : []
}

export const ride = (state=defaultState, { type, payload }) => {
  switch(type) {
    case 'ADD_RIDES':
      return { ...state, rides : [].concat(payload) }
    case 'REMOVE_RIDE':
      const oldRides = state.rides

      const newRides = [].concat(oldRides.filter(rid => rid.id !== payload ))

      return { ...state, rides }
    case 'REMOVE_RIDES':
      return { ...state, rides : {} }
    default:
      return state
  }
}