import configHeader from "src/utils/configHeader"
import centralErrors from "src/utils/centralErrors"
import { api } from "src/boot/axios"

const PATH = '/notificacion'

export default {
  async obtenerNoLeidos(callback) {
    try {
      let res = await api.get(PATH + '/noleidos', configHeader.headers())
      if (callback) return callback(res)
      return res
    } catch (e) {
      if (callback) return callback(centralErrors.obtenerMensajeError(e))
      return centralErrors.obtenerMensajeError(e)
    }
  },
  async leerNotificacion(id, callback) {
    try {
      let res = await api.put(PATH + '/' + id, {}, configHeader.headers())
      if (callback) return callback(res)
      return res
    } catch (e) {
      if (callback) return callback(centralErrors.obtenerMensajeError(e))
      return centralErrors.obtenerMensajeError(e)
    }
  },
  async guardarNotificacion(data, callback) {
    try {
      let res = await api.post(PATH + '/', data, configHeader.headers())
      if (callback) return callback(res)
      return res
    } catch (e) {
      if (callback) return callback(centralErrors.obtenerMensajeError(e))
      return centralErrors.obtenerMensajeError(e)
    }
  },

  async obtenerTodasDocente(page, perPage, callback) {
    try {
      let res = await api.get(PATH + `/${page}/${perPage}`, configHeader.headers())
      if (callback) return callback(res)
      return res
    } catch (error) {
      if (callback) return callback(centralErrors.obtenerMensajeError(e))
      return centralErrors.obtenerMensajeError(e)
    }
  }
}
