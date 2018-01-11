import SocketIo from 'socket.io'
import { Bus } from './models'

export const sockets = {}

export const socketServer = app => {
  const sckts = new SocketIo(app)

  sckts.on('connection', socket => {
    // socket.send('WELCOME!')

    socket.on('new connection', async msg => {
      const { bus, user } = msg

      console.log(`We received ${ JSON.stringify(msg) }`)

      // console.log(sockets, bus, sockets[ bus ])
      if(sockets[ bus ]) delete sockets[ bus ]

      try {    
        const bs = await Bus.findOne({ id : bus }, { _id : 1 })

        if(bs) sockets[ bus ] = { socket, user }

        else console.log(`Bus with ID ${ bus } does not exist...`)
      } catch(e) {
        console.log(e)
      }
      // sockets[ bus ].send('added', { this : 'works' })
    })

    socket.on('disconnect', () => {
      for(const key in sockets) {
        if(socket.id === sockets[ key ].socket.id) {
          console.log(`about to delete ${ key } socket`)
          delete sockets[ key ]
        }
      }
    })
  })
}