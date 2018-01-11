import Socket from 'socket.io-client'
import { Actions } from 'react-native-router-flux'

import { BASEURL } from '../../config'
import store from '../store'
import { requestLogout, logUserOut } from '../store/actions'
import { showMessage } from '../utils'

export default data => {
  const socket = Socket(BASEURL)
  let interval = null

  const errorMessage = () => showMessage('No server connection', 'success')

  socket.on('connect', () => {
    if(interval) {
      clearInterval(interval)
      showMessage('Server connection on!')
    }

    socket.emit('new connection', data)
  })
  socket.on('added', console.log)
  socket.on('new ride', msg => console.log(JSON.stringify(msg, null, 3)))
  socket.on('disconnect', () => console.log('Disconnected...'))
  socket.on('error', () => {
    errorMessage()
    setInterval(() => errorMessage, 10 * 1000 )
  })

  return socket
}