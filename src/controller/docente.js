import configHeader from "src/utils/configHeader"
import centralErrors from "src/utils/centralErrors"
import { api } from "src/boot/axios"

const PATH = '/docente'

export default {
    async obtenerDocentes(callback) {
        try {
            let res = await api.get(PATH, configHeader.headers())
            if (callback) return callback(res)
            return res
        } catch (e) {
            if (callback) return callback(centralErrors.obtenerMensajeError(e))
            return centralErrors.obtenerMensajeError(e)
        }
    },

    async obtenerPerfilDocente(callback) {
        try {
            let res = await api.get(PATH + '/one', configHeader.headers())
            if (callback) return callback(res)
            return res
        } catch (e) {
            if (callback) return callback(centralErrors.obtenerMensajeError(e))
            return centralErrors.obtenerMensajeError(e)
        }
    },

    async crearDocente(data, callback) {
        try {
            let res = await api.post(PATH, data, configHeader.headers())
            if (callback) return callback(res)
            return res
        } catch (e) {
            if (callback) return callback(centralErrors.obtenerMensajeError(error.message))
            return centralErrors.obtenerMensajeError(e)
        }
    },

    async editarDocente(id, data, callback) {
        try {
            let res = await api.patch(PATH + `/${id}`, data, configHeader.headers())
            if (callback) return callback(res)
            return res
        } catch (e) {
            if (callback) return callback(centralErrors.obtenerMensajeError(error.message))
            return centralErrors.obtenerMensajeError(e)
        }
    }

} 