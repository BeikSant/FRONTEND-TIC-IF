import configHeader from "src/utils/configHeader"
import centralErrors from "src/utils/centralErrors"
import { api } from "src/boot/axios"

const PATH = '/informe'

export default {
  async obtenerInformePeriodo(periodo, callback) {
    try {
      let res = await api.get(PATH + `/${periodo}`, configHeader.headers())
      if (callback) return callback(res)
      return res
    } catch (e) {
      if (callback) return callback(centralErrors.obtenerMensajeError(e))
      return centralErrors.obtenerMensajeError(e)
    }
  },

  async obtenerTodosInformes(callback) {
    try {
      let res = await api.get(PATH, configHeader.headers())
      if (callback) return callback(res)
      return res
    } catch (e) {
      if (callback) return callback(centralErrors.obtenerMensajeError(e))
      return centralErrors.obtenerMensajeError(e)
    }
  },

  async guardarInforme(data, callback) {
    try {
      let res = await api.post(PATH + `/upload`, data, configHeader.headers())
      if (callback) return callback(res)
      return res
    } catch (e) {
      if (callback) return callback(centralErrors.obtenerMensajeError(e))
      return centralErrors.obtenerMensajeError(e)
    }
  },

  async obtenerTodosPorPeriodo(periodo, callback) {
    try {
      let res = await api.get(PATH + '/all/' + periodo, configHeader.headers())
      if (callback) return callback(res)
      return res
    } catch (e) {
      if (callback) return callback(centralErrors.obtenerMensajeError(e))
      return centralErrors.obtenerMensajeError(e)
    }
  },

  async cambiarEstado(id, estado, callback) {
    try {
      let res = await api.post(PATH + '/estado/' + id, { estado }, configHeader.headers())
      if (callback) return callback(res)
      return res
    } catch (e) {
      if (callback) return callback(centralErrors.obtenerMensajeError(e))
      return centralErrors.obtenerMensajeError(e)
    }
  },
}
