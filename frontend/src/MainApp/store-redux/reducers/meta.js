const defaultState = {
  user : { firstname : '', lastname : '' },
  errorMsg : ''
}

export const meta = (state = defaultState, { type, payload }) => {
  switch (type) {
    case 'LOG_USER_OUT' :
      return {
        ...state,
        user : {
          firstname : '',
          lastname : ''
        },
        errorMsg : payload
      }
    case 'LOG_USER_IN' :
      return { ...state, user : payload }
    case 'ERROR_MESSAGE' : 
      return { ...state, errorMsg : payload }
    default :
      return state
  }
}
