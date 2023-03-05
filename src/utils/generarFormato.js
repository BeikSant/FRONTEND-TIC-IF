import { jsPDF } from "jspdf"
import 'jspdf-autotable'
import formatoController from "src/controller/formato-controller";
import Autolinker from 'autolinker';


export default {
    async generarFormatoPDF(idFormato) {
        const formato = await this.obtenerFormato(idFormato)
        const doc = new jsPDF({
            orientation: "landscape",
            format: "a4",
            putOnlyUsedFonts: true,
        });

        const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        const alignCenter = (doc.internal.pageSize.width || doc.internal.pageSize.getWidth()) / 2;
        const pageInicio = 30;
        const spaceInfo = 20;
        doc.setFont(undefined, 'bold');
        doc.setFontSize(14);
        doc.addImage("https://unl.edu.ec/sites/default/files/inline-images/unl_0.png", "PNG", 20, pageInicio - 10, 60, 35, "UNL");
        doc.text("UNIVERSIDAD NACIONAL DE LOJA", alignCenter + 30, pageInicio, { align: 'center' });
        doc.text("COMISIÓN DE ARTICULACIÓN DE LAS FUNCIONES SUSTANTIVAS", alignCenter + 30, pageInicio + 10, { align: 'center' });
        doc.text(formato.nombreFormato, alignCenter + 30, pageInicio + 20, { align: 'center' });
        doc.setFontSize(13);
        doc.text(formato.facultad + ':', spaceInfo, pageInicio + 40);
        doc.text(formato.carrera + ':', spaceInfo, pageInicio + 50);
        doc.text(formato.docente + ':', spaceInfo, pageInicio + 60);
        doc.text(formato.dedicacion + ':', spaceInfo, pageInicio + 70,);
        doc.text(formato.periodoAcademico + ':', spaceInfo, pageInicio + 80);
        doc.text(formato.totalHoras.split(', ')[0], spaceInfo, pageInicio + 90);
        doc.text(formato.totalHoras.split(', ')[1] + ':', spaceInfo, pageInicio + 95);
        doc.setFont(undefined, 'normal');

        doc.autoTable({
            styles: { fontSize: 12 },
            theme: "plain",
            headStyles: {
                halign: "center",
                valign: "middle",
                lineColor: 0,
                fillColor: [48, 102, 156],
                textColor: 255,
                lineWidth: 0.1,
                fontStyle: 'bold'
            },
            bodyStyles: {
                valign: "middle",
                textColor: 0,
                lineColor: 0,
                lineWidth: 0.1,
                fontSize: 10,
            },
            columnStyles: {
                0: { cellWidth: 'auto', halign: "center", },
                1: { cellWidth: 50, halign: "center", },
                2: { cellWidth: 'auto', halign: "center", },
                3: { cellWidth: 60, halign: "left" },
                4: { cellWidth: 60, halign: "left" },
                5: { cellWidth: 40, halign: "left" },
            },
            showHead: 'firstPage',
            head: [[formato.funcionesSustantivas,
            formato.actividadesDistributivo,
            formato.horasPAO,
            formato.actividadesDesarrolladas,
            formato.evidencias,
            formato.observaciones]],
            body: [['', '', '', '', '']],
            didParseCell: async (cell) => {

                // Check if the data for this cell is a string that starts with "<a href="
                if (typeof cell.cell.raw === 'string' && cell.column.raw.dataKey == 5) {
                    console.log(cell)
                    if (cell.cell.raw.startsWith('<a href=')) {
                        const linkStart = cell.cell.raw.indexOf('"') + 1;
                        const linkEnd = cell.cell.raw.indexOf('"', linkStart);
                        const link = cell.cell.raw.substring(linkStart, linkEnd);
                        const text = cell.cell.raw.substring(cell.cell.raw.indexOf('>') + 1, cell.cell.raw.lastIndexOf('<'))

                        const linkedText = Autolinker.link(link);
                        cell.cell.text = linkedText;

                        console.log(text)
                        console.log(link)
                        // Set the link for the cell using doc.autoTableSetLink
                    }
                }
            },
            startY: pageInicio + 105,
            margin: 20,
        })
        let str2 = "Your footer text";
        doc.setTextColor(100);
        doc.setFontSize(10);
        doc.text(str2, alignCenter / 2, pageHeight - 10, { align: 'center' });
        doc.output('dataurlnewwindow');
    },

    async obtenerFormato(idFormato) {
        try {
            const formato = await formatoController.obtenerPorId(idFormato)
            return formato.data
        } catch (error) {
            console.log(error)
        }
    },

}