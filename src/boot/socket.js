import { boot } from 'quasar/wrappers'
import io from 'socket.io-client'

const socket = io(process.env.API_URL, {
  transports: ["polling", "websocket"],
  path: process.env.PATH_AXIOS,
  forceNew: true
})

export default boot(({ app }) => {
  app.config.globalProperties.$socket = socket
})
