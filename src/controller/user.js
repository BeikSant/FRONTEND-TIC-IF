import { api } from "src/boot/axios"
import centralErrors from "src/utils/centralErrors"
import configHeader from "src/utils/configHeader"

const PATH = '/user'

export default {
    async cambiarEstado(cedula, callback) {
        try {
            let res = await api.patch(PATH + '/estado/' + cedula, {}, configHeader.headers())
            if (callback) return callback(res)
            return res
        } catch (e) {
            if (callback) return callback(centralErrors.obtenerMensajeError(e))
            return centralErrors.obtenerMensajeError(e)
        }
    },

    async cambiarRol(docente, newrol, callback) {
        try {
            let res = await api.post(PATH + '/rol/' + docente, { newrol }, configHeader.headers())
            if (callback) return callback(res)
            return res
        } catch (e) {
            if (callback) return callback(centralErrors.obtenerMensajeError(e))
            return centralErrors.obtenerMensajeError(e)
        }
    },

    async cambiarContrasennia(data, callback) {
        try {
            let res = await api.put(PATH + '/changepassword', data, configHeader.headers())
            if (callback) return callback(res)
            return res
        } catch (e) {
            if (callback) return callback(centralErrors.obtenerMensajeError(e))
            return centralErrors.obtenerMensajeError(e)
        }
    },

    async generarTokenRecuperacion(email, callback) {
        try {
            let baseURL = process.env.BASEURL
            let enlace = baseURL + '/recuperar/cuenta'
            let res = await api.post(PATH + '/tokenrecuperacion/' + email, { enlace })
            if (callback) return callback(res)
            return res
        } catch (e) {
            if (callback) return callback(centralErrors.obtenerMensajeError(e))
            return centralErrors.obtenerMensajeError(e)
        }
    },

    async verificarToken(token, callback) {
        try {
            let res = await api.get(PATH + '/tokenverify/' + token)
            if (callback) return callback(res)
            return res
        } catch (e) {
            if (callback) return callback(centralErrors.obtenerMensajeError(e))
            return centralErrors.obtenerMensajeError(e)
        }
    },

    async recuperarPassword(token, password, callback) {
        try {
            let res = await api.post(PATH + '/recuperarpassword/' + token, { password })
            if (callback) return callback(res)
            return res
        } catch (e) {
            if (callback) return callback(centralErrors.obtenerMensajeError(e))
            return centralErrors.obtenerMensajeError(e)
        }
    }
}