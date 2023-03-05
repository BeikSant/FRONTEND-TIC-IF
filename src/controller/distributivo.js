import configHeader from "src/utils/configHeader"
import centralErrors from "src/utils/centralErrors"
import { api } from "src/boot/axios"

const PATH = '/distributivo'

export default {
    async obtenerTodasActividades(callback) {
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

    async guardarNuevoDistributivo(actividades, callback) {
        try {
            let res = await api.post(PATH, { actividades }, configHeader.headers())
            if (callback) return callback(res)
            return res
        } catch (e) {
            if (callback) return callback(centralErrors.obtenerMensajeError(e))
            return centralErrors.obtenerMensajeError(e)
        }
    },
}