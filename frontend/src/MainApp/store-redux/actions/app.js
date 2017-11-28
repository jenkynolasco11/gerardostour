// ///////////////////////
// App
// ///////////////////////
export const toggleDrawer = payload => ({ type : 'TOGGLE_DRAWER', payload })

export const successLogin = payload => ({ type : 'LOGIN_SUCCESS', payload })

// ///////////////////////
// Thunks
// ///////////////////////

export default {
  toggleDrawer,
  successLogin,
}