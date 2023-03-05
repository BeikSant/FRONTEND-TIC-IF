import configHeader from "src/utils/configHeader"
import centralErrors from "src/utils/centralErrors"
import { api } from "src/boot/axios"

const PATH = '/formato'

export default {

    async obtenerInformeActivo(callback) {
        try {
            let res = await api.get(PATH + '/active', configHeader.headers())
            if (callback) return callback(res)
            return res
        } catch (e) {
            console.log(e)
            if (callback) return callback(centralErrors.obtenerMensajeError(e))
            return centralErrors.obtenerMensajeError(e)
        }
    },

    async obtenerTodosFormato(callback) {
        try {
            let res = await api.get(PATH, configHeader.headers())
            if (callback) return callback(res)
            return res
        } catch (e) {
            console.log(e)
            if (callback) return callback(centralErrors.obtenerMensajeError(e))
            return centralErrors.obtenerMensajeError(e)
        }
    },

    async obtenerPorId(formato, callback) {
        try {
            let res = await api.get(PATH + `/${formato}`, configHeader.headers())
            if (callback) return callback(res)
            return res
        } catch (e) {
            console.log(e)
            if (callback) return callback(centralErrors.obtenerMensajeError(e))
            return centralErrors.obtenerMensajeError(e)
        }
    }
}