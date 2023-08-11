import { boot } from 'quasar/wrappers'
import io from 'socket.io-client'

const socket = io(process.env.API_URL, {
  transports: ["polling"],
  path: '/informefinal-backend/socket.io/',
  forceNew: true
})

export default boot(({ app }) => {
  app.config.globalProperties.$socket = socket
})
