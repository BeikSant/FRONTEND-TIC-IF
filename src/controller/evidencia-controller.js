import configHeader from "src/utils/configHeader"
import centralErrors from "src/utils/centralErrors"
import { api } from "src/boot/axios"

const PATH = '/evidencia'

export default {

    async obtenerEvidencias(especifica, callback) {
        try {
            let res = await api.get(PATH + `/${especifica}`, configHeader.headers())
            if (callback) return callback(res)
            return res
        } catch (e) {
            console.log(e)
            if (callback) return callback(centralErrors.obtenerMensajeError(e))
            return centralErrors.obtenerMensajeError(e)
        }
    },

    async eliminarEvidencia(evidencia, callback) {
        try {
            let res = await api.delete(PATH + `/${evidencia}`, configHeader.headers())
            if (callback) return callback(res)
            return res
        } catch (e) {
            console.log(e)
            if (callback) return callback(centralErrors.obtenerMensajeError(e))
            return centralErrors.obtenerMensajeError(e)
        }
    },

    async editarEvidencia(idevidencia, evidencia, callback) {
        try {
            let res = await api.put(PATH + `/${idevidencia}`, { evidencia }, configHeader.headers())
            if (callback) return callback(res)
            return res
        } catch (e) {
            console.log(e)
            if (callback) return callback(centralErrors.obtenerMensajeError(e))
            return centralErrors.obtenerMensajeError(e)
        }
    },

    async crearEvidencia(evidencia, callback) {
        try {
            let res = await api.post(PATH, { evidencia }, configHeader.headers())
            if (callback) return callback(res)
            return res
        } catch (e) {
            console.log(e)
            if (callback) return callback(centralErrors.obtenerMensajeError(e))
            return centralErrors.obtenerMensajeError(e)
        }
    }


}