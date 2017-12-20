const defaultState = {
  user : null,
  isAuth : false,
}

export const auth = (state = defaultState, { type, payload }) => {
  switch(type) {
    case 'AUTH_SUCCESS' :
      return { ...state, ...payload }
    case 'LOG_USER_OUT' :
      return { ...state, user : null, isAuth : false }
    default:
      return state
  }
}