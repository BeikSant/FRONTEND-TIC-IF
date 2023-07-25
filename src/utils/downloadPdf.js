import pdfMake from "pdfmake/build/pdfmake";


export default {
  async formatoPdf(formato, bodyTable = null, datosDocente = null) {
    let docente = []
    if (datosDocente != null) {
      docente = [
        { text: datosDocente.carrera.facultad.nombre + '\n', style: 'dataBodyInformation' },
        { text: datosDocente.carrera.nombre + '\n', style: 'dataBodyInformation' },
        {
          text: `${datosDocente.primerNombre} ${datosDocente.segundoNombre} ${datosDocente.primerApellido} ${datosDocente.segundoApellido}\n`,
          style: 'dataBodyInformation'
        },
        { text: datosDocente.dedicacion + '\n', style: 'dataBodyInformation' },
        { text: datosDocente.periodo + '\n', style: 'dataBodyInformation' },
        { text: datosDocente.horas + '\n', style: 'dataBodyInformation' }

      ]
    }
    if (bodyTable == null) {
      bodyTable =
        [
          [{ texto: 'DOCENCIA', estilo: 'bodyTable' }, '', '', '', '', ''],
          [{ texto: 'INVESTIGACIÓN', estilo: 'bodyTable' }, '', '', '', '', ''],
          [{ texto: 'VINCULACIÓN CON LA SOCIEDAD', estilo: 'bodyTable' }, '', '', '', '', ''],
          [{ texto: 'GESTIÓN EDUCATIVA', estilo: 'bodyTable' }, '', '', '', '', ''],
          [{ colSpan: 3, texto: formato.conclusiones, estilo: ['headerTable', { color: 'black' }] }, '', '', { colSpan: 3, text: '' }, '', ''],
        ]
    }

    bodyTable.unshift([
      { texto: formato.funcionesSustantivas, estilo: 'headerTable' },
      { texto: formato.actividadesDistributivo, estilo: 'headerTable' },
      { texto: formato.horasPAO, estilo: 'headerTable' },
      { texto: formato.actividadesDesarrolladas, estilo: 'headerTable' },
      { texto: formato.evidencias, estilo: 'headerTable' },
      { texto: formato.observaciones, estilo: 'headerTable' }
    ])

    pdfMake.fonts = {
      CenturyGothic: {
        normal: process.env.BASEURL + '/fonts/century_gothic/GOTHIC.TTF',
        bold: process.env.BASEURL + '/fonts/century_gothic/GOTHICB.TTF',
        italics: process.env.BASEURL + '/fonts/century_gothic/GOTHICI.TTF',
        bolditalic: process.env.BASEURL + '/fonts/century_gothic/GOTHICBI.TTF',
      }
    }



    /* tabla.push([
         { colSpan: 3, texto: 'CONCLUSIÓN Y/O RECOMENDACIÓN', estilo: ['headerTable', { color: 'black' }] }, '', '', { colSpan: 3, text: '' }, '', ''
     ]) */


    const fecha = new Date()
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    const fechaFormateada = `${dia}/${mes}/${anio}`;

    function getBase64ImageFromURL(url) {
      return new Promise((resolve, reject) => {
        var img = new Image();
        img.setAttribute("crossOrigin", "anonymous");
        img.onload = () => {
          var canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          var dataURL = canvas.toDataURL("image/png");
          resolve(dataURL);
        };
        img.onerror = error => {
          reject(error);
        };
        img.src = url;
      });
    }

    let docDefinition = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      fontSize: 12,
      font: 'CenturyGothic',
      content: [

        {
          alignment: 'center',
          columns: [
            {
              image: await getBase64ImageFromURL(process.env.BASEURL + '/imgs/logoUNL.png'),
              width: 170,
              height: 60,
              margin: [-20, 0, 0, 0]
            },
            {
              text: [
                { text: 'UNIVERISIDAD NACIONAL DE LOJA\n', style: 'headerInformation' },
                { text: 'COMISIÓN DE ARTICULACIÓN DE LAS FUNCIONES SUSTANTIVAS\n', style: 'headerInformation' },
                { text: formato.nombreFormato + '\n', style: ['headerInformation'] }]
            }
          ]
        },
        ' ',
        ' ',
        {
          columns: [
            {
              width: 220,
              text: [
                { text: formato.facultad + ':\n', style: 'bodyInformation' },
                { text: formato.carrera + ':\n', style: 'bodyInformation' },
                { text: formato.docente + ':\n', style: 'bodyInformation' },
                { text: formato.dedicacion + ':\n', style: 'bodyInformation' },
                { text: formato.periodoAcademico + ':\n', style: 'bodyInformation' },
                { text: formato.totalHoras + ':', style: ['bodyInformation', { lineHeight: 1 }] }]
            },
            {
              text: docente
            }
          ]
        },
        ' ',
        {


          table: {

            widths: [100, 130, 50, 150, '*', '*'],
            body: bodyTable.map(items => {
              return items.map(item => {
                let data = {
                  text: item.texto,
                  style: item.estilo
                }
                if (item.colSpan) data.colSpan = item.colSpan
                if (item.enlace) data.link = item.enlace
                if (item.rowSpan) data.rowSpan = item.rowSpan
                return data

              })
            })
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return (rowIndex == 0) ? '#2c5484' : null
            }
          },
          header: {
            repeat: 0
          }
        },
        ' ',
        { text: 'Fecha de presentación: ' + fechaFormateada, style: 'footerInformation' },
        ' ',
        ' ',
        ' ',
        {
          columns: [
            {
              text: '____________________________________________\n'
                + 'Firma del docente',
              style: ['footerInformation', { alignment: 'center' }]
            },
            {
              text: ' '
            },
            {
              text: '____________________________________________\n'
                + 'Firma del Director/a y/o Encargado de la Gestión Académica de la Carrera',
              style: ['footerInformation', { alignment: 'center' }]
            },

          ]
        }
      ],
      defaultStyle: {
        font: 'CenturyGothic',
      },
      styles: {
        headerInformation: {
          bold: true,
          fontSize: 12,
          alignment: 'center',
          lineHeight: 1.7
        },
        bodyInformation: {
          fontSize: 11,
          bold: true,
          lineHeight: 1.5,
        },
        dataBodyInformation: {
          fontSize: 11,
          lineHeight: 1.5,
        },
        footerInformation: {
          fontSize: 11
        },
        bodyTable: {
          fontSize: 10,
          alignment: 'center',
        },
        headerTable: {
          bold: true,
          fontSize: 10,
          alignment: 'center',
          color: 'white'
        }
      }
    }

    let options = {

    }

    pdfMake.createPdf(docDefinition).open()
  }
}
