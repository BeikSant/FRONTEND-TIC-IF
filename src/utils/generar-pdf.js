import { api } from 'src/boot/axios';
import desarrolladaController from "src/controller/desarrollada-controller";
import evidenciaController from "src/controller/evidencia-controller";
import formatoController from "src/controller/formato-controller";
import observacionController from "src/controller/observacion-controller";
import { useAuthStore } from "src/stores/auth-stores";
import informeController from "src/controller/informe-controller";
import downloadPdf from "./downloadPdf";
import conclusionRecomendacionController from 'src/controller/conclusionRecomendacion.controller';


export default {

    async generarPDF(informe = null, actividadesEspecificas, periodo, idFormato = null) {

        async function obtenerCamposActividad(id) {
            try {
                const evidencias = await evidenciaController.obtenerEvidencias(id)
                const desarrolladas = await desarrolladaController.obtenerDesarrolladas(id)
                const observaciones = await observacionController.obtenerObservaciones(id)
                const campos = {
                    evidencias: evidencias.data.evidencias,
                    observaciones: observaciones.data.observaciones,
                    desarrolladas: desarrolladas.data.actividadesDesarrolladas
                }
                return campos
            } catch (error) {
                console.log(error)
            }
        }

        async function obtenerFormatoActivo() {
            try {
                const formato = await formatoController.obtenerInformeActivo()
                return formato.data
            } catch (error) {
                console.log(error)
            }
        }

        async function obtenerFormato(idFormato) {
            try {
                const formato = await formatoController.obtenerPorId(idFormato)
                return formato.data
            } catch (error) {
                console.log(error)
            }
        }

        async function obtenerDocente() {
            try {
                const authStore = useAuthStore()
                const headers = { Authorization: `Bearer ${authStore.token}` }
                const res = await api.get('docente/one', { headers })
                return res.data.docente
            } catch (error) {
                console.log(error)
            }
        }

        async function obtenerBody(actividadesEspecificas, informe) {
            let body = []
            let horas = 0
            for (let i = 0; i < actividadesEspecificas.length; i++) {
                for (let j = 0; j < actividadesEspecificas[i].actividadesEspecificas.length; j++) {
                    const ae = actividadesEspecificas[i].actividadesEspecificas[j]
                    const datos = await obtenerCamposActividad(ae._id)
                    let evidencias = ''
                    let desarrolladas = []
                    let observaciones = []
                    for (let k = 0; k < datos.evidencias.length; k++) {
                        if (k != 0) evidencias += '\n\n'
                        evidencias += '\u2022 ' + datos.evidencias[k].nombre
                    };
                    for (let k = 0; k < datos.desarrolladas.length; k++) {
                        if (k != 0) desarrolladas += '\n\n'
                        desarrolladas += '\u2022 ' + datos.desarrolladas[k].nombre
                    };
                    for (let k = 0; k < datos.observaciones.length; k++) {
                        if (datos.observaciones[k].enlace) {
                            observaciones.push({ text: datos.observaciones[k].nombre + '\n\n', link: datos.observaciones[k].enlace })
                        } else {
                            observaciones.push({ text: datos.observaciones[k].nombre + '\n\n' })
                        }
                    };
                    body.push([
                        { texto: actividadesEspecificas[i].nombre, estilo: 'bodyTable', rowSpan: actividadesEspecificas[i].actividadesEspecificas.length },
                        { texto: ae.nombre, estilo: 'bodyTable' },
                        { texto: ae.horas.toString(), estilo: 'bodyTable' },
                        { texto: desarrolladas, estilo: ['bodyTable', { alignment: 'left' }] },
                        { texto: evidencias, estilo: ['bodyTable', { alignment: 'left' }] },
                        { texto: observaciones, estilo: ['bodyTable', { alignment: 'left' }] }
                    ])
                    horas += ae.horas
                }
            }
            const conclusiones = await conclusionRecomendacionController.obtenerPorInforme(informe)
            let textConclusion = ''
            for (let i = 0; i < conclusiones.data.length; i++) {
                if (i != 0) textConclusion += '\n\n'
                textConclusion += `\u2022 ${conclusiones.data[i].nombre}`
            }
            console.log(textConclusion)
            return { body, horas, textConclusion }
        }

        let formato = null
        if (idFormato == null) {
            console.log("No tiene formato o esta generando un nuevo")
            formato = await obtenerFormatoActivo()
            await informeController.asignarFormato(informe, formato._id)
        } else {
            console.log("En un informe de un periodo pasado")
            formato = await obtenerFormato(idFormato)
        }
        let docente = await obtenerDocente()
        let { body, horas, textConclusion } = await obtenerBody(actividadesEspecificas, informe)
        body.push(
            [{ colSpan: 3, texto: formato.conclusiones, estilo: ['headerTable', { color: 'black' }] }, '', '', { colSpan: 3, texto: textConclusion, estilo: ['bodyTable', { alignment: 'justify' }] }, '', ''],
        )
        docente.horas = horas
        docente.periodo = periodo
        downloadPdf.formatoPdf(formato, body, docente)


    },
}