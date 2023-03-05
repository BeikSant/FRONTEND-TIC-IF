//import xl from 'excel4node'
//import readXlsxFile from 'read-excel-file'
import * as XLSX from 'xlsx'

export default {
    async descargarInformeExcel() {
        //const original = new xl.Workbook()
        const fileName = 'distributivo.xlsx';
        const fileUrl = 'http://localhost:9000/public/documents/' + fileName;
        XLSX.readFile(fileUrl, { type: 'array' }, (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonResult = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            console.log(jsonResult);
        });
    }
}


