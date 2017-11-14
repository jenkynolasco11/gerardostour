const BASEURL = 'http://192.168.0.101:8000/api'

//////////////////// ACTIONS //////////////////////

// Payload : { user : String, id : Number }
export const login = payload => ({ type: 'LOGIN', payload })

// Payload : {}
export const logout = payload => ({ type: 'LOGOUT', payload })

// Payload : { to : String, from : String }
export const nextTrip = payload => ({ type: 'NEXT_TRIP', payload })

// Payload : { confirmed : boolean}
export const confirmTrip = payload => ({ type: 'CONFIRM_TRIP', payload })

// Payload : { cantAuth : boolean }
export const cantAuthenticate = payload => ({ type: 'CANT_AUTH_META', payload })

// Payload : { badAuth : boolean }
export const badAuthentication = payload => ({ type: 'BAD_AUTH_META', payload })

// Payload : {}
export const clearMeta = payload => ({ type: 'CLEAR_META', payload })

// // Payload : { id : Number }
// export const isAvailable = payload => ({ type: 'IS_AVAILABLE', payload })

// // Payload : { id : Number }
// export const cancelAvailable = payload => ({ type: 'CANCEL_AVAILABLE', payload })

// Payload : { isAvailable : boolean }
export const makeAvailable = payload => ({ type: 'MAKE_AVAILABLE', payload })

////////////////////// THUNKS ///////////////////

// Thunk => userInfo : { user: String, pass: String }
export const requestLogin = userInfo => {
  return async dispatch => {
    const method = 'POST'
    const TIMEOUT = 4000

    // TODO : Add security here
    const body = new FormData()
    body.append('user', userInfo.user)
    body.append('pass', userInfo.pass)

    const options = { method, body/*, headers */}
    const url = `${BASEURL}/auth/login`

    try{
      const conditions = [timeout(TIMEOUT), fetch(url, options)]
      const res = await Promise.race(conditions)
      // const res = await fetch(url, options)
      const data = await res.json()
      
      if(data.isAuth) {
        dispatch(clearMeta())
        return dispatch(login(data))
      }
      return dispatch(badAuthentication({ badAuth : true}))

    } catch(e) {
      dispatch(cantAuthenticate({ cantAuth : true }))
      return dispatch(logout())
    }
  }
}

// Thunk => { id : Number }
export const requestLogout = id => {
  return async dispatch => {
    try {
      if(checkAuth(id)) {
        const options = { method : 'GET'}
        const res = await fetch(`${BASEURL}/auth/logout/${id}`, options)
        const data = await res.json()

        if(data.ok) dispatch(logout())
      }
    } catch (e) {
      //
    }
    dispatch(clearMeta())
  }
}

// Thunk => { id : Number, action : String }
export const setAvailability = (id, action) => {
  const route = (action === 'cancel')
            ? 'no-'
            : ''

  return async dispatch => {
    try {
      if(checkAuth(id)) {
        const options = { method : 'GET' }
        const res = await fetch(`${BASEURL}/user/${route}available`, options)
        const data = await res.json()

        return dispatch(makeAvailable({ isAvailable : data.ok }))
      }
    } catch(e) {
      console.log(e)

      // TODO : Check this out later
      return dispatch(makeAvailable({ isAvailable : false }))
    }
  }
}

// Checks if user is authenticated in server
const checkAuth = async id => {
  try {
    let res = await fetch(`${BASEURL}/auth/${id}`)
    let data = await res.json()

    return data.ok || false
  } catch (e) {
    // console.log(e)

    return false
  }
}

const timeout = time => {
  return new Promise((_, rej) => {
    setTimeout(() => {
      return rej('timed out')
    }, time)
  })
}