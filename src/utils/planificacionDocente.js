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
                    const funcionesSustantivas = await obtenerActividadesDistributivo()
                    res = compararActividades(funcionesSustantivas, actividadesCompletas, actividadesObligatorias)
                    console.log(funcionesSustantivas)
                    console.log(actividadesCompletas, actividadesObligatorias)
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
    for (let i = 0; i < actividadesCompletas.length; i++) {
        for (let j = 0; j < funcionesSustantivas.length; j++) {
            if (funcionesSustantivas[j].actividadesDistributivo.some(item => item.sigla == actividadesCompletas[i].siglas)) {
                res.push({
                    nombre: actividadesCompletas[i].siglas + ' - ' + actividadesCompletas[i].descripcion,
                    horas: 0,
                    actividadDistributivo: funcionesSustantivas[j].actividadesDistributivo.filter(item => item.sigla == actividadesCompletas[i].siglas)[0]._id
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
                        horas: 0,
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
    //console.log(items);
    return items;
}

async function obtenerInformacion(data) {
    const datafilter = data.filter(item => item != '' && item != ' ' ? true : false)
    const patron = /^A[A-Za-z]{1}\s*\d+/
    let actividadesCompletas = [];
    let actividadesObligatorias = [];
    let isActividades = false
    for (let i = 0; i < datafilter.length; i++) {
        if (datafilter[i] == 'ACTIVIDADES') isActividades = true
        if (isActividades) {
            if (patron.test(datafilter[i])) actividadesObligatorias.push({ siglas: datafilter[i], descripcion: datafilter[i + 1] })
        } else {
            if (patron.test(datafilter[i])) {
                let testHora = /^\d{2}:\d{2}$/
                let actividad = ''
                let isComplete = false
                let k = i
                while (!isComplete) {
                    if (patron.test(datafilter[k + 1]) || datafilter[k + 1] == 'ACTIVIDADES' || testHora.test(datafilter[k + 1])) {
                        if (actividad != '') {
                            if (!actividadesCompletas.some(item => item.descripcion == actividad)) {
                                actividadesCompletas.push({ siglas: datafilter[i], descripcion: actividad })
                            }
                        }

                        isComplete = true
                    } else {
                        const filterActividad = /^A[A-Z]{2}$/
                        if (!filterActividad.test(datafilter[k + 1].replace(/^\s*-\s*/, ''))) actividad += actividad === '' ? datafilter[k + 1] : ' ' + datafilter[k + 1]
                        k++
                    }
                }
            }
        }
    }
    return { actividadesCompletas, actividadesObligatorias }
}
