const userDefault = {
  user : '',
  bus : -1,
  disableLoginBtn : false,
  isAuth : false,
  isActive : false
}

export const auth = (state=userDefault, { type, payload }) => {
  switch(type) {
    case 'SET_ACTIVE_STATUS' :
      return { ...state, isActive : payload }
    case 'DISABLE_LOGIN_BUTTON' :
      return { ...state, disableLoginBtn : payload }
    case 'LOG_USER_IN' :
      // { user : String, isAuth : boolean, bus : Number }
      return {...state, ...payload }
    case 'LOG_USER_OUT' :
      return userDefault
    default:
      return state
  }
}
