const defaultState = {
  user : { firstname : '', lastname : '' },
  errorMsg : ''
}

export const meta = (state = defaultState, action) => {
  switch (action.type) {
    case 'LOG_USER_OUT' :
      return {
        ...state,
        user : {
          firstname : '',
          lastname : ''
        },
        errorMsg : action.payload
      }
    case 'LOG_USER_IN' :
      return { ...state, user : action.payload }
    case 'ERROR_MESSAGE' : 
      return { ...state, errorMsg : action.payload }
    default :
      return state
  }
}
