import desarrolladaController from "src/controller/desarrollada-controller";
import evidenciaController from "src/controller/evidencia-controller";
import formatoController from "src/controller/formato-controller";
import observacionController from "src/controller/observacion-controller";
import informeController from "src/controller/informe-controller";
import docenteCotroller from 'src/controller/docente';
import downloadPdf from "./downloadPdf";
import htmlToObject from './htmlToObject';
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
      }
    }

    async function obtenerFormatoActivo() {
      try {
        const formato = await formatoController.obtenerInformeActivo()
        return formato.data
      } catch (error) {
      }
    }

    async function obtenerFormato(idFormato) {
      try {
        const formato = await formatoController.obtenerPorId(idFormato)
        return formato.data
      } catch (error) {
      }
    }

    async function obtenerDocente() {
      try {
        const res = await docenteCotroller.obtenerPerfilDocente()
        return res.data.docente
      } catch (error) {
      }
    }

    async function obtenerBody(actividadesEspecificas, informe) {
      let body = []
      let horas = 0
      for (let i = 0; i < actividadesEspecificas.length; i++) {
        for (let j = 0; j < actividadesEspecificas[i].actividadesEspecificas.length; j++) {
          const ae = actividadesEspecificas[i].actividadesEspecificas[j]
          const datos = await obtenerCamposActividad(ae._id)
          let evidencias = []
          let desarrolladas = []
          let observaciones = []
          for (let k = 0; k < datos.evidencias.length; k++) {
            if (k != 0) evidencias.push('\n\n')
            evidencias = evidencias.concat(htmlToObject(datos.evidencias[k].nombre))
          };
          for (let k = 0; k < datos.desarrolladas.length; k++) {
            if (k != 0) desarrolladas.push('\n\n')
            desarrolladas = desarrolladas.concat(htmlToObject(datos.desarrolladas[k].nombre))
          };
          for (let k = 0; k < datos.observaciones.length; k++) {
            if (k != 0) observaciones.push('\n\n')
            observaciones = observaciones.concat(htmlToObject(datos.observaciones[k].nombre))

          };
          body.push([
            { texto: actividadesEspecificas[i].nombre, estilo: 'bodyTable', rowSpan: actividadesEspecificas[i].actividadesEspecificas.length },
            { texto: ae.nombre, estilo: 'bodyTable' },
            { texto: ae.horas.toString(), estilo: 'bodyTable' },
            { texto: desarrolladas, estilo: ['bodyTable', { alignment: 'left', alignment: 'justify' }] },
            { texto: evidencias, estilo: ['bodyTable', { alignment: 'left', alignment: 'justify' }] },
            { texto: observaciones, estilo: ['bodyTable', { alignment: 'left', alignment: 'justify' }] }
          ])
          horas += ae.horas
        }
      }
      const conclusiones = await conclusionRecomendacionController.obtenerPorInforme(informe)
      let textConclusion = []
      for (let i = 0; i < conclusiones.data.length; i++) {
        if (i != 0) textConclusion.push('\n\n')
        textConclusion = textConclusion.concat(htmlToObject(conclusiones.data[i].nombre))
      }
      return { body, horas, textConclusion }
    }

    let formato = await obtenerFormatoActivo()

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
