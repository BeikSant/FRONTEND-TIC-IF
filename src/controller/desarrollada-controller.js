import configHeader from "src/utils/configHeader"
import centralErrors from "src/utils/centralErrors"
import { api } from "src/boot/axios"

const PATH = '/desarrollada'

export default {

    async obtenerDesarrolladas(especifica, callback) {
        try {
            let res = await api.get(PATH + `/${especifica}`, configHeader.headers())
            if (callback) return callback(res)
            return res
        } catch (e) {
            if (callback) return callback(centralErrors.obtenerMensajeError(e))
            return centralErrors.obtenerMensajeError(e)
        }
    },

    async eliminarDesarrollada(desarrollada, callback) {
        try {
            let res = await api.delete(PATH + `/${desarrollada}`, configHeader.headers())
            if (callback) return callback(res)
            return res
        } catch (e) {
            if (callback) return callback(centralErrors.obtenerMensajeError(e))
            return centralErrors.obtenerMensajeError(e)
        }
    },

    async editarDesarrollada(desarrollada, actividadDesarrollada, callback) {
        try {
            let res = await api.put(PATH + `/${desarrollada}`, { actividadDesarrollada }, configHeader.headers())
            if (callback) return callback(res)
            return res
        } catch (e) {
            if (callback) return callback(centralErrors.obtenerMensajeError(e))
            return centralErrors.obtenerMensajeError(e)
        }
    },

    async crearDesarrollada(actividadDesarrollada, callback) {
        try {
            let res = await api.post(PATH, { actividadDesarrollada }, configHeader.headers())
            if (callback) return callback(res)
            return res
        } catch (e) {
            if (callback) return callback(centralErrors.obtenerMensajeError(e))
            return centralErrors.obtenerMensajeError(e)
        }
    }

}