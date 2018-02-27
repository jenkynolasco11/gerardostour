import io from 'socket.io-client'
import { Actions } from 'react-native-router-flux'

import { BASEURL } from '../../config'
import store from '../store'
import { requestLogout, logUserOut, requestRides, addDispatchedRides } from '../store/actions'
import { showMessage } from '../utils'

export default data => {
  const socket = io(BASEURL, { transports: ['websocket'] })

  socket.on('connect', () => {
    const { auth } = store.getState()

    socket.emit('new connection', { ...data, active : auth.isActive })
  })

  socket.on('added', msg => {
    // console.log(msg)
  })

  socket.on('error', console.log)

  socket.on('new ride', data => {
    return store.dispatch(addDispatchedRides(data.ride))
  })

  return socket
}
