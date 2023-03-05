import configHeader from "src/utils/configHeader"
import centralErrors from "src/utils/centralErrors"
import { api } from "src/boot/axios"

const PATH = '/conclusionrecomendacion'

export default {

    async obtenerPorInforme(informe, callback) {
        try {
            let res = await api.get(PATH + `/${informe}`, configHeader.headers())
            if (callback) return callback(res)
            return res
        } catch (e) {
            console.log(e)
            if (callback) return callback(centralErrors.obtenerMensajeError(e))
            return centralErrors.obtenerMensajeError(e)
        }
    },

    async crear(conclusion, callback) {
        try {
            let res = await api.post(PATH, conclusion, configHeader.headers())
            if (callback) return callback(res)
            return res
        } catch (e) {
            console.log(e)
            if (callback) return callback(centralErrors.obtenerMensajeError(e))
            return centralErrors.obtenerMensajeError(e)
        }
    },

    async eliminar(id, callback) {
        try {
            let res = await api.delete(PATH + `/${id}`, configHeader.headers())
            if (callback) return callback(res)
            return res
        } catch (e) {
            console.log(e)
            if (callback) return callback(centralErrors.obtenerMensajeError(e))
            return centralErrors.obtenerMensajeError(e)
        }
    },

    async editar(id, data, callback) {
        try {
            let res = await api.put(PATH + `/${id}`, data, configHeader.headers())
            if (callback) return callback(res)
            return res
        } catch (e) {
            console.log(e)
            if (callback) return callback(centralErrors.obtenerMensajeError(e))
            return centralErrors.obtenerMensajeError(e)
        }
    }


}