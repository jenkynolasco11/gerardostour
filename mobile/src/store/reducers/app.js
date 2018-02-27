const appDefault = {
  showSpinner : false,
  // socket : null
  // message : '',
  // showToast : false,
  // messageType : 'success' //danger,success,warning
}

export const app = (state=appDefault, { type, payload }) => {
  switch(type) {
    case 'SHOW_SPINNER' :
      return { ...state, showSpinner : payload }
    // case 'SET_SOCKET' :
    //   console.log('About to set socket')
    //   return { ...state, socket : payload }
    // case 'SHOW_MESSAGEBAR':
    //   const { message, showToast, messageType = 'success' } = payload

    //   // danger,success,warning
    //   return { ...state, message, showToast, messageType }
    default:
      return state
  }
}
