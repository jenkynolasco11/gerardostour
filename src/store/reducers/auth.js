const userDefault = {
  user : '',
  id : 0,
  isAuth : false,
}

export const user = (state=userDefault, action) => {
  switch(action.type) {
    case 'LOGIN' : 
      return {...state, ...action.payload } 
    case 'LOGOUT' : 
      return userDefault
    default:
      return state
  }
}