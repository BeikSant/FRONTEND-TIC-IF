<template>
    <div class="flex flex-center q-ma-none">
        <q-card class="my-card__distributivo-ver relative-position">

            <q-card-section class="card-title-actividades">
                <div class="row">

                    <div class="col-9 q-table__title" inline><b>Actividades del distributivo</b></div>
                    <div class="col-3" align="rigth">
                        <q-btn :disabled="visible" v-if="docente == 'director'" @click="fixed = true" size="sm"
                            class="col-1" color="green" style="color:white">Nuevo
                            Distributivo</q-btn>
                    </div>

                </div>


            </q-card-section>
            <q-card-section class="no-padding no-margin bg-blue-1" style="min-height: 300px;">
                <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                    <div v-show="isData" class="no-padding no-margin">
                        <template v-if="funSustantivaModel.length == 0">
                            <div align="center" class="q-pt-xl">
                                <b>NADA QUE MOSTRAR</b>
                            </div>
                        </template>
                        <template v-else>
                            <q-tabs indicator-color="white" v-model="funSustantivaModel" dense
                                class="bg-primary text-white shadow-2" inline-label outside-arrows mobile-arrows>
                                <q-tab v-for="(fs, index) in funcionesSustantivas" :key="index" :label=fs.nombre
                                    :name=fs.nombre />
                            </q-tabs>

                            <q-tab-panels animated v-model="funSustantivaModel" class="bg-blue-1">
                                <q-tab-panel v-for="(fs, index) in funcionesSustantivas" :key="index" :label=fs.nombre
                                    :name=fs.nombre>
                                    <div class="q-pa-md">
                                        <q-table :rows-per-page-options="[5, 10, 0]" class="q-table-table"
                                            :pagination="{ rowsPerPage: 10 }" rows-per-page-label="Resultados por página"
                                            :rows=fs.actividadesDistributivo :columns=columns dense row-key="name" />
                                    </div>
                                </q-tab-panel>
                            </q-tab-panels>

                        </template>
                    </div>
                </transition>
                <q-inner-loading :showing="visible" label="Cargando información..." label-class="text-teal"
                    label-style="font-size: 1.1em" />
            </q-card-section>
        </q-card>
    </div>

    <q-dialog v-model="fixed">
        <q-card style="width: 400px;">
            <q-card-section class="header-crear-docente card-title-actividades">
                <div class="row">
                    <div class="col-9 self-center"><b>Cargar Nuevo Distributivo Docente</b></div>
                    <div class="col-2 q-mr-ms">
                        <q-btn target="_blank" :href="baseURL + '/documents/Formatodistributivo.xlsx'" color="orange"
                            size="sm">Descargar
                            Formato</q-btn>
                    </div>
                </div>
            </q-card-section>

            <q-card-section style="max-height: 70vh" class="body-crear-docente">
                <div style="text-align: justify;">
                    Para cargar todo el distributivo de docentes, debe usar el formato que se puede obtener al dar click
                    en el <b>Botón Naranja</b>; y la <b>CODIFICACIÓN</b> debe ser igual al de la
                    planificación de carga horaria docente del <b>SIAAF</b> (por ejemplo: '<b>AD 1</b>').
                </div>
                <div class="q-pa-md">
                    <div class="q-gutter2-sm row items-start">
                        <q-uploader accept=".xlsx" class="shadow-8" id="archivoExcel" label="Archivos subidos"
                            style="max-width: 400px" @input="subirExcel" />
                    </div>
                </div>

            </q-card-section>

            <q-separator></q-separator>

            <q-card-actions class="q-mt-md">
                <q-btn @click="fixed = false" color="negative">Cerrar</q-btn>
                <q-btn @click="guardarActividades" color="positive">Aceptar</q-btn>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { ref } from 'vue';
import readXlsxFile from 'read-excel-file';
import docenteController from 'src/controller/docente';
import distributivo from 'src/controller/distributivo';
import { useQuasar } from 'quasar';

const $q = useQuasar()
const docente = ref('docente')
const baseURL = process.env.BASEURL
const fixed = ref(false);
const visible = ref(true)
const isData = ref(false)
const actividadesSubir = [];
const funSustantivaModel = ref([])  // Es para los q-tabs
const funcionesSustantivas = ref([])   // Funcines sustantivas con sus actividades del distributivo
const columns = [
    { name: 'sigla', align: 'center', label: 'Codificación', field: 'sigla' },
    //{ name: 'nombre', align: 'center', label: 'Nombre', field: 'nombre' },
    { name: 'descripcion', align: 'left', label: 'Descripcion', field: 'descripcion', style: 'max-width: 500px; white-space: break-spaces;' },
]

const obtenerDocente = async () => {
    const res = await docenteController.obtenerPerfilDocente()
    if (res.status == 200) docente.value = res.data.docente.usuario.rol.nombre
}

const obtenerActividades = async () => {
    await distributivo.obtenerTodasActividades(async (res) => {
        if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/login' }) }
        if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
        if (res.status != 200) return generateMessage('NO OK', res.message)
        funcionesSustantivas.value = res.data.actividades.funcionesSustantivas
        if (funcionesSustantivas.value.length != 0) funSustantivaModel.value = funcionesSustantivas.value[0].nombre
    })
    isData.value = true
    visible.value = false
}

const guardarActividades = async () => {
    if (actividadesSubir.value.length == 0) { generateMessage('NO OK', 'No se ha podido obtener la información del archivo'); return fixed.value = false }
    await distributivo.guardarNuevoDistributivo(actividadesSubir.value, (res) => {
        if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/login' }) }
        if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
        if (res.status != 200) return generateMessage('NO OK', 'Ocurrió un error al cargar las actividades del distributivo')
        generateMessage('OK', res.data.message)
        obtenerActividades()
        fixed.value = false
    })
}

async function subirExcel(event) {
    const file = event.target.files[0]
    actividadesSubir.value = []
    await readXlsxFile(file).then((rows) => {
        let row = {}
        for (let i = 1; i < rows.length; i++) {
            if (rows[i][0] != null && rows[i][0] != 'null') {
                if (i != 1) actividadesSubir.value.push(row)
                row = {}
                row.nombre = rows[i][0]
                row.actividadesDistributivo = []
            }
            row.actividadesDistributivo.push({
                sigla: rows[i][1],
                descripcion: rows[i][2]
            })
        }
        actividadesSubir.value.push(row)
    })
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

obtenerActividades()
obtenerDocente()


</script>

<style lang="scss">
.bton-lista-docente {
    background-color: $primary;
}

.my-custom-toggle {
    width: 100%;
}



.my-card__distributivo-ver {
    margin: 1rem;
    width: 100%;
    height: 100%;
}

.my-card__distributivo-ver h5 {
    margin: 10px;
}

.my-sticky-header-table tr:first-child th {
    background-color: rgba($color: $primary, $alpha: 0.9);
}

.card-title-actividades {
    background-color: $primary;
    color: white;
}
</style>