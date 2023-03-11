<template>
    <div class="q-ma-md">
        <q-card class="my-card">
            <q-card-section class="card-title-gestionar">
                <div class="row justify-between">
                    <div class="col-9">
                        <div class="col q-table__title" inline><b>Historial de informes</b></div>
                    </div>
                </div>
            </q-card-section>
            <q-card-section class="bg-blue-1">
                <q-table :columns="header" :rows="dataInformes" row-key="name"
                    :no-data-label="'No posee un historial de informes'" :key="'tablePeriodo'"
                    :pagination="{ rowsPerPage: 10 }" rows-per-page-label="Resultados por página">
                    <template v-slot:top>
                        <div class="col q-table__title"><b>Lista de Informes</b></div>
                    </template>


                    <template v-slot:header="props">
                        <q-tr :props="props">
                            <q-th v-for="col in props.cols" :key="col.name" :props="props">
                                {{ col.label }}
                            </q-th>
                            <q-th auto-width>Acciones</q-th>
                        </q-tr>
                    </template>

                    <template v-slot:body="props">
                        <q-tr :props="props">
                            <q-td v-for="col in props.cols" :key="col.name" :props="props">
                                {{ col.value }}
                            </q-td>
                            <q-td align="center" auto-width class="q-pa-md q-gutter-xs">
                                <q-btn size="sm" color="positive" round dense icon="mdi-download"
                                    @click="desacargarPDF(props.row)" />
                            </q-td>
                        </q-tr>
                    </template>

                </q-table>
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup>

import informeController from 'src/controller/informe-controller';
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import especificaController from 'src/controller/especifica-controller';
import generarPdf from 'src/utils/generar-pdf';

const router = useRouter()

const $q = useQuasar()
const header = [
    { name: 'periodo', label: 'Periodo', sortable: true, field: 'periodo', align: 'left' },
    { name: 'informe', label: 'Informe', sortable: true, field: 'informe', align: 'left', style: 'max-width: 400px; white-space: break-spaces;' },
    { name: 'fechaInicio', label: 'Fecha Inicial', sortable: false, field: 'fechaInicio', align: 'center' },
    { name: 'fechaFin', label: 'Fecha Final', sortable: false, field: 'fechaFin', align: 'center' },
]
const dataInformes = ref([])

const obtenerHistorialInformes = async () => {
    await informeController.obtenerTodosInformes((res) => {
        if (res.status != 200) return errorRequest()
        const informes = res.data.informes
        dataInformes.value = []
        for (let i = 0; i < informes.length; i++) {
            if (!informes[i].periodoAcademico.estado) {
                dataInformes.value.push({
                    periodo: informes[i].periodoAcademico.nombre,
                    fechaInicio: new Date(informes[i].periodoAcademico.fechaInicio).toLocaleDateString(),
                    fechaFin: new Date(informes[i].periodoAcademico.fechaFin).toLocaleDateString(),
                    informe: informes[i].formato.nombreFormato,
                    id: informes[i]._id,
                    idformato: informes[i].formato._id
                })
            }
        }
    })
}

async function desacargarPDF(informe) {
    const actividadesEspecificas = await obtenerActividadesInforme(informe.id)
    generarPdf.generarPDF(informe.id, actividadesEspecificas, informe.periodo, informe.idformato)
}

const obtenerActividadesInforme = async (idInforme) => {
    let fs = []
    await especificaController.obtenerActividadesPorInforme(idInforme, (res) => {
        if (res.status != 200) return errorRequest(res)
        const actsEsp = res.data.actividadesEspecificas
        for (let i = 0; i < actsEsp.length; i++) {
            let igual = false
            if (i == 0 || !igual) fs.push({ nombre: actsEsp[i].actividadDistributivo.funcionSustantiva.nombre, actividadesEspecificas: [] })
            for (let j = 0; j < fs.length; j++) {
                if (fs[j].nombre == actsEsp[i].actividadDistributivo.funcionSustantiva.nombre) igual = true
            }

        }
        for (let i = 0; i < actsEsp.length; i++) {
            for (let j = 0; j < fs.length; j++) {
                if (actsEsp[i].actividadDistributivo.funcionSustantiva.nombre
                    == fs[j].nombre) fs[j].actividadesEspecificas.push(actsEsp[i])
            }
        }
    })
    function SortArray(x, y) {
        if (x.nombre < y.nombre) { return -1; }
        if (x.nombre > y.nombre) { return 1; }
        return 0;
    }
    return fs.sort(SortArray)
}

obtenerHistorialInformes()

const errorRequest = (res) => {
    if (res.status == 401) { generateMessage('NO OK', res.message); return router.re('/login') }
    if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
    if (res.status != 200) generateMessage('NO OK', res.message)
}

const generateMessage = (tipo, message) => {
    if (tipo == 'OK') {
        $q.notify({
            color: 'green-5',
            textColor: 'white',
            icon: 'mdi-check-bold',
            message: message
        })
    } else {
        $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: message
        })
    }
}

</script>

<style lang="scss">
.card-title-gestionar {
    background-color: $primary;
    color: white;
}
</style>