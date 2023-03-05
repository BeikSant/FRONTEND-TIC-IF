import configHeader from "src/utils/configHeader"
import centralErrors from "src/utils/centralErrors"
import { api } from "src/boot/axios"

const PATH = '/especifica'

export default {

    async obtenerActividadesPorInforme(informe, callback) {
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

    async eliminarActividad(actividad, callback) {
        try {
            let res = await api.delete(PATH + `/${actividad}`, configHeader.headers())
            if (callback) return callback(res)
            return res
        } catch (error) {
            console.log(error)
            if (callback) return callback(centralErrors.obtenerMensajeError(error))
            return centralErrors.obtenerMensajeError(error)
        }
    },

    async crearActividad(informe, distributivo, actividad, callback) {
        try {
            let res = await api.post(PATH + `/${informe}/${distributivo}`, { actividad }, configHeader.headers())
            if (callback) return callback(res)
            return res
        } catch (error) {
            console.log(error)
            if (callback) return callback(centralErrors.obtenerMensajeError(error))
            return centralErrors.obtenerMensajeError(error)
        }
    },

    async editarActividad(id, actividad, callback) {
        try {
            let res = await api.patch(PATH + `/${id}`, { actividad }, configHeader.headers())
            if (callback) return callback(res)
            return res
        } catch (error) {
            console.log(error)
            if (callback) return callback(centralErrors.obtenerMensajeError(error))
            return centralErrors.obtenerMensajeError(error)
        }
    }
}
