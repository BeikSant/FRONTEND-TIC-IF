import { useQuasar } from 'quasar';

export default {
    obtenerMensajeError(e) {
        if (e.response && e.response.status) {
            console.log(e.response)
            if (e.response.status == 404) {
                if (e.response.data.message) return { status: e.response.status, message: e.response.data.message };
                return { status: 500, message: "Error interno del servidor" };
            } else if (e.response.status == 500) {
                return { status: e.response.status, message: "Error interno del servidor" }
            }
            if (e.response.status == 401) {
                return { status: 401, message: "No Autorizado" }
            }
        } else {
            return { status: 500, message: "Error interno del servidor" }
        }
    }
}