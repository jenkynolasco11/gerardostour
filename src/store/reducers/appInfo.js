const appInfoDefault = {
  isAvailable : false,
  to: '',
  from : ''
}

export const appInfo = (state=appInfoDefault, action) => {
  switch(action.type) {
    // case 'REQUEST_TRIP':
    // //   return state
    case 'MAKE_AVAILABLE':
      return Object.assign({}, state, action.payload)
    default:
      return state
  }
}