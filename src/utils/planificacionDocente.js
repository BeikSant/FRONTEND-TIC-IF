import * as pdfjs from 'pdfjs-dist/legacy/build/pdf'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'
import distributivo from 'src/controller/distributivo'

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker


export default {
  async obtenerActividadPdf(pdf) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsArrayBuffer(pdf)
      let res = []
      reader.onload = async function () {
        try {
          const dataPDF = new Uint8Array(reader.result)
          const data = await getItems(dataPDF)
          const { actividadesCompletas, actividadesObligatorias } = await obtenerInformacion(data)
          console.log(actividadesCompletas, actividadesObligatorias)
          const funcionesSustantivas = await obtenerActividadesDistributivo()
          res = compararActividades(funcionesSustantivas, actividadesCompletas, actividadesObligatorias)
          resolve(res)
        } catch (error) {
          reject([])
        }
      }
    })
  }
}

const compararActividades = (funcionesSustantivas, actividadesCompletas, actividadesObligatorias) => {
  let res = []

  for (const ac of actividadesCompletas) {
    for (const fs of funcionesSustantivas) {
      if (fs.actividadesDistributivo.some(item => item.sigla == ac.siglas)) {
        res.push({
          nombre: ac.siglas + ' - ' + ac.descripcion,
          horas: ac.horas * 16,
          actividadDistributivo: fs.actividadesDistributivo.filter(item => item.sigla == ac.siglas)[0]._id
        })
      }
    }
  }

  for (let i = 0; i < actividadesObligatorias.length; i++) {
    for (let j = 0; j < funcionesSustantivas.length; j++) {
      if (funcionesSustantivas[j].actividadesDistributivo.some(item => item.sigla == actividadesObligatorias[i].siglas)) {
        if (!res.some(item => item.actividadDistributivo == funcionesSustantivas[j].actividadesDistributivo.filter(item => item.sigla == actividadesObligatorias[i].siglas)[0]._id)) {
          res.push({
            nombre: actividadesObligatorias[i].siglas + ' - ' + actividadesObligatorias[i].descripcion,
            horas: actividadesObligatorias[i].horas * 16,
            actividadDistributivo: funcionesSustantivas[j].actividadesDistributivo.filter(item => item.sigla == actividadesObligatorias[i].siglas)[0]._id
          })
        }
      }
    }

  }
  return res
}

const obtenerActividadesDistributivo = async () => {  //Obtienes las actividades del distributivo con sus respectivas funciones sustantivas
  return await distributivo.obtenerTodasActividades(async (res) => {
    if (res.status != 200) return []
    const funcionesSustantivas = res.data.actividades.funcionesSustantivas
    return funcionesSustantivas
  })
}


async function getContent(src, page) {
  const doc = await pdfjs.getDocument(src).promise;;
  const dataPerPage = await doc.getPage(page);
  return await dataPerPage.getTextContent()
}

async function getItems(src) {
  const doc = await pdfjs.getDocument(src).promise;
  const pages = doc.numPages
  let items = [];
  for (let i = 0; i < pages; i++) {
    const content = await getContent(src, i + 1);
    content.items.map(item => {
      items.push(item.str);
    })
  }
  return items;
}

async function obtenerInformacion(data) {
  const datafilter = data.filter(item => item != '' && item != ' ' ? true : false)
  const patron = /^A[A-Za-z]{1}\s*\d+/
  let actividadesCompletas = [];
  let actividadesObligatorias = [];
  for (let i = 0; i < datafilter.length; i++) {
    if (datafilter[i] == 'ACTIVIDADES') { //Nos encontramos en el apartado de ACTIVIDADES
      if (patron.test(datafilter[i]))
        actividadesObligatorias.push({
          siglas: datafilter[i],
          descripcion: datafilter[i + 1],
          horas: datafilter[i + 2]
        })
    } else { // NOS ENCONTRAMOS EN EL APARTADO DE CARGA HORARIA
      if (patron.test(datafilter[i])) { // VERIFICA SI PERTENECE SI ES UN AD AG IA etc
        let testHora = /^\d{2}:\d{2}$/
        let actividad = ''
        let isComplete = false
        let k = i
        while (!isComplete) {
          if (patron.test(datafilter[k + 1]) || datafilter[k + 1] == 'ACTIVIDADES' || testHora.test(datafilter[k + 1])) {
            if (actividad != '') {
              if (!actividadesCompletas.some(item => item.descripcion == actividad)) {
                actividadesCompletas.push({ siglas: datafilter[i], descripcion: actividad, horas: 1 })
              } else {
                const actividadFind = actividadesCompletas.find(item => item.descripcion == actividad)
                actividadFind.horas++
              }
            }
            isComplete = true
          } else {
            const filterActividad = /^A[A-Z]{2}$/
            if (!filterActividad.test(datafilter[k + 1].replace(/^\s*-\s*/, '')))
              actividad += actividad === '' ? datafilter[k + 1] : ' ' + datafilter[k + 1]
            k++
          }
        }
      }
    }
  }
  return { actividadesCompletas, actividadesObligatorias }
}
