<template>
    <div class="q-ma-md">
        <q-card class="my-card">
            <q-card-section class="card-title-gestionar">
                <div class="row justify-between">
                    <div class="col-9">
                        <div class="col q-table__title" inline><b>Administrar Informe Final</b></div>
                    </div>
                </div>
            </q-card-section>
            <q-tabs indicator-color="white" v-model="tab" dense class="bg-primary text-white shadow-2" inline-label
                outside-arrows mobile-arrows>
                <q-tab name="periodoAcademico">Periodos Académicos</q-tab>
                <q-tab name="formatoInforme">Formatos Informe</q-tab>
            </q-tabs>
            <q-tab-panels class="bg-blue-1" v-model="tab" animated>
                <q-tab-panel name="periodoAcademico">

                    <q-table :columns="headerPeriodo" :rows="dataPeriodo" row-key="name"
                        :no-data-label="'No existen periodos académicos'" :key="'tablePeriodo'"
                        :pagination="{ rowsPerPage: 10 }" rows-per-page-label="Resultados por página"
                        :rows-per-page-options="[5, 10, 0]">
                        <template v-slot:top>
                            <div class="col q-table__title"><b>Lista de Periodos Académicos</b></div>
                            <q-btn size="sm" class="col-2 bton-lista-docente" color="blue-7" style="color:white"
                                @click="formularioPeriodo">Nuevo
                                Periodo</q-btn>
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
                                    <q-badge v-if="col.name == 'estado'" :color="col.value ? 'positive' : 'negative'">
                                        {{ col.value ? 'ACTUAL' : 'CULMINADO' }}
                                    </q-badge>
                                    <template v-else>{{ col.value }}</template>
                                </q-td>

                                <q-td align="center" auto-width class="q-pa-md q-gutter-xs">
                                    <div style="display: inline;" v-if="props.row.estado">
                                        <q-btn size="sm" color="warning" round dense
                                            @click="formularioEditarPeriodo(props.row)" icon="mdi-file-document-edit" />
                                        <q-tooltip :offset="[10, 10]" class="bg-indigo">
                                            Editar periodo
                                        </q-tooltip>
                                    </div>
                                    <div style="display: inline;">
                                        <q-btn size="sm" color="negative" round dense
                                            @click="confirmacionEliminarPeriodo(props.row)" icon="mdi-delete"
                                            :disabled="!props.row.editable" />
                                        <q-tooltip v-if="!props.row.editable" class="bg-indigo" :offset="[10, 10]">
                                            Existen informes en este periodo
                                        </q-tooltip>
                                    </div>
                                </q-td>


                            </q-tr>
                        </template>

                    </q-table>
                </q-tab-panel>
                <q-tab-panel name="formatoInforme">

                    <q-table :columns="headerFormato" :rows="dataFormato" row-key="name"
                        :no-data-label="'No existen formatos del informe final'" :key="'tablePeriodo'"
                        :pagination="{ rowsPerPage: 10 }" rows-per-page-label="Resultados por página"
                        :rows-per-page-options="[5, 10, 0]">
                        <template v-slot:top>
                            <div class="col q-table__title"><b>Lista de Formatos del Informe Final</b></div>
                            <q-btn size="sm" class="col-2 bton-lista-docente" color="blue-7" style="color:white"
                                @click="formularioFormato()">Nuevo
                                Formato</q-btn>
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
                                <q-td v-for="col in  props.cols " :key="col.name" :props="props">
                                    <template v-if="col.name == 'estado'">
                                        <q-badge v-if="col.value" color="positive">
                                            ACTIVO
                                        </q-badge>
                                        <div v-else>
                                            <q-btn size="sm" color="negative" dense label="INACTIVO"
                                                @click="dialogUsarFormato = true; formatoUsar = props.row" />
                                            <q-tooltip class="bg-indigo" :offset=" [10, 10] ">
                                                Usar este formato
                                            </q-tooltip>
                                        </div>
                                    </template>
                                    <template v-else>{{ col.value }}</template>
                                </q-td>

                                <q-td align="center" auto-width class="q-pa-md q-gutter-xs">
                                    <div style="display: inline;">
                                        <q-btn size="sm" color="positive" round dense icon="mdi-eye-outline"
                                            @click=" verFormato(props.row) " />
                                    </div>
                                    <div style="display: inline;">
                                        <q-btn size="sm" color="warning" round dense @click=" editarFormatoForm(props) "
                                            icon="mdi-file-document-edit" :disabled=" !props.row.editable " />
                                        <q-tooltip v-if=" !props.row.editable " :offset=" [10, 10] ">
                                            Este formato está siendo usado
                                        </q-tooltip>
                                    </div>

                                    <div style="display: inline;">
                                        <q-btn size="sm" color="negative" round dense
                                            @click=" confirmacionEliminarFormato(props.row) " icon="mdi-delete"
                                            :disabled=" !props.row.editable || props.row.estado ">
                                        </q-btn>
                                        <q-tooltip v-if=" props.row.estado " :offset=" [10, 10] ">
                                            No puede eliminar un formato activo
                                        </q-tooltip>
                                        <q-tooltip v-if=" !props.row.editable && !props.row.estado " :offset=" [10, 10] ">
                                            Este formato está siendo usado
                                        </q-tooltip>
                                    </div>

                                </q-td>
                            </q-tr>
                        </template>

                    </q-table>

                </q-tab-panel>
            </q-tab-panels>

            <q-dialog v-model=" formPeriodo.draw " persistent>
                <q-card style="max-width: 400px">
                    <q-card-section class="card-title-gestionar">
                        <div class="text-h6">{{ formPeriodo.titulo }}</div>
                    </q-card-section>

                    <q-separator />

                    <q-card-section>

                        <div class="text-caption q-mb-sm" v-if=" !formPeriodo.editar ">
                            Recuerde que al crear un nuevo perido académico, este no podrá ser <b>ELIMINADO</b> y
                            automáticamente
                            se habilitaría un nuevo informe final para todos los docentes

                        </div>

                        <q-separator />

                        <q-form @submit=" guardarFormPeriodo " class="q-gutter-md">

                            <q-input filled v-model=" formPeriodo.nombre " label="Nombre del periodo académico" lazy-rules
                                :rules=" [val => val && val.length > 0 || 'Ingrese el nombre del periodo'] " />
                            <div class="row">
                                <div class="col-6">
                                    <q-input v-model=" formPeriodo.fechaInicio " filled type="date" hint="Fecha inicio"
                                        class="q-mr-sm" lazy-rules
                                        :rules=" [val => val && val.length > 0 || 'Ingrese una fecha inicial'] " />
                                </div>
                                <div class="col-6">
                                    <q-input v-model=" formPeriodo.fechaFinal " filled type="date"
                                        hint="Fecha final ('indefinido' dejar vacío)" lazy-rules
                                        :rules=" [val => isMayorFechaInicial() || 'Debe ser una fecha mayor o igual a la inicial'] " />
                                </div>


                            </div>
                            <q-separator />
                            <div>
                                <q-btn class="q-mr-sm" label="Cancelar" @click=" resetForm " flat color="negative" />
                                <q-btn label="Guardar" type="submit" color="positive" />
                            </div>
                        </q-form>
                    </q-card-section>
                </q-card>
            </q-dialog>

            <q-dialog v-model=" formFormato.draw " persistent>
                <q-card style="max-width: 550px">
                    <q-card-section class="card-title-gestionar">
                        <div class="text-h6">{{ formFormato.titulo }}</div>
                    </q-card-section>
                    <q-tabs indicator-color="white" v-model=" tabFormato " dense class="bg-primary text-white shadow-2"
                        outside-arrows mobile-arrows inline-label>
                        <q-tab name="informacionGeneral">Información General</q-tab>
                        <q-tab name="encabezadoTabla">Datos de la Tabla</q-tab>
                    </q-tabs>
                    <q-card-section class="q-mb-none q-pb-none" v-if=" !formFormato.isEditar ">
                        <q-banner dense class="bg-blue-3 q-py-none" style="font-size: 10px !important;">
                            <div class="row">
                                <div class="col-1 self-center">
                                    <q-icon name="warning" class="q-ml-xs" />
                                </div>
                                <div class="col-11">
                                    <h1 class="text-caption no-margin no-padding">
                                        Los información de los campos actuales del formulario
                                        pertecen al formato que actualmente se encuentra activo
                                    </h1>
                                </div>
                            </div>


                        </q-banner>
                        <q-banner dense class="bg-blue-3 q-py-none q-mt-xs" style="font-size: 10px !important;">
                            <div class="row">
                                <div class="col-1 self-center">
                                    <q-icon name="warning" class="q-ml-xs" />
                                </div>
                                <div class="col-11">
                                    <h1 class="text-caption no-margin no-padding">
                                        Al crear un formato, éste automáticamente quedará activo para generar el informe
                                        final
                                    </h1>
                                </div>
                            </div>
                        </q-banner>
                    </q-card-section>
                    <q-form @submit=" guardarFormFormato ">
                        <q-card-section style="max-height:53vh" class="scroll q-pb-none">
                            <q-separator class="q-mb-lg" />
                            <q-tab-panels v-model=" tabFormato ">
                                <q-tab-panel name="informacionGeneral" class="q-ma-none q-pa-none">
                                    <q-input class="q-px-sm q-mb-sm" filled v-model=" formFormato.nombreFormato "
                                        label="Nombre del formato" lazy-rules autogrow
                                        :rules=" [val => val && val.length > 0 || 'Ingrese un nombre del periodo'] " />

                                    <div class="row justify-between q-my-none">
                                        <q-input class="col-6 col-sm-6 q-px-sm q-mb-md" filled
                                            v-model=" formFormato.facultad " label="Campo Facultad" lazy-rules
                                            :rules=" [val => val && val.length > 0 || 'Ingrese un nombre para \'Facultad\''] " />

                                        <q-input class="col-6 col-sm-6 q-px-sm q-mb-md" filled v-model=" formFormato.carrera "
                                            label="Campo Carrera" lazy-rules
                                            :rules=" [val => val && val.length > 0 || ' Ingrese un nombre para \'Carrera\''] " />

                                        <q-input class="col-6 col-sm-6 q-px-sm q-mb-md" filled v-model=" formFormato.docente "
                                            label="Campo Docente" lazy-rules
                                            :rules=" [val => val && val.length > 0 || 'Ingrese un nombre para \'Docente\''] " />

                                        <q-input class="col-6 col-sm-6 q-px-sm q-mb-md" filled
                                            v-model=" formFormato.dedicacion " label="Campo Dedicación" lazy-rules
                                            :rules=" [val => val && val.length > 0 || 'Ingrese un nombre para \'Dedicación\''] " />

                                        <q-input class="col-6 col-sm-6 q-px-sm q-mb-md" filled
                                            v-model=" formFormato.periodoAcademico " label="Campo Periodo Académico" autogrow
                                            lazy-rules
                                            :rules=" [val => val && val.length > 0 || 'Ingrese un nombre para \'Periodo Académico\''] " />

                                        <q-input class="col-6 col-sm-6 q-px-sm q-mb-md" filled
                                            v-model=" formFormato.totalHoras " label="Campo Total Horas" lazy-rules autogrow
                                            :rules=" [val => val && val.length > 0 || 'Ingrese un nombre para \'Horas PAO\''] " />

                                    </div>
                                </q-tab-panel>
                                <q-tab-panel name="encabezadoTabla" class="q-ma-none q-pa-none">

                                    <div class="row justify-between q-my-none">
                                        <q-input class="col-6 col-sm-6 q-px-sm q-mb-md" filled
                                            v-model=" formFormato.funcionesSustantivas " label="Campo Funciones Sustantivas"
                                            :rules=" [val => val && val.length > 0 || 'Ingrese un nombre para \'Funciones Sustantivas\''] " />

                                        <q-input class="col-6 col-sm-6 q-px-sm q-mb-md" filled
                                            v-model=" formFormato.actividadesDistributivo "
                                            label="Campo Actividades del distributivo" lazy-rulesç
                                            :rules=" [val => val && val.length > 0 || ' Ingrese un nombre para \'Actividades del distributivo\''] " />

                                        <q-input class="col-6 col-sm-6 q-px-sm q-mb-md" filled
                                            v-model=" formFormato.horasPAO " label="Campo Horas del PAO" lazy-rules
                                            :rules=" [val => val && val.length > 0 || 'Ingrese un nombre para \'Horas del PAO\''] " />

                                        <q-input class="col-6 col-sm-6 q-px-sm q-mb-md" filled
                                            v-model=" formFormato.actividadesDesarrolladas "
                                            label="Campo Actividades desarrolladas" lazy-rules
                                            :rules=" [val => val && val.length > 0 || 'Ingrese un nombre para \'Actividades desarrolladas\''] " />

                                        <q-input class="col-6 col-sm-6 q-px-sm q-mb-md" filled
                                            v-model=" formFormato.evidencias " label="Campo Evidencias" lazy-rules
                                            :rules=" [val => val && val.length > 0 || 'Ingrese un nombre para \'Evidencias\''] " />

                                        <q-input class="col-6 col-sm-6 q-px-sm q-mb-md" filled
                                            v-model=" formFormato.observaciones " label="Campo Observaciones" lazy-rules
                                            :rules=" [val => val && val.length > 0 || 'Ingrese un nombre para \'Observaciones\''] " />

                                    </div>
                                    <q-input class="q-px-sm q-mb-sm" filled v-model=" formFormato.conclusiones "
                                        label="Campo Conclusiones y/o Recomendaciones" lazy-rules autogrow
                                        :rules=" [val => val && val.length > 0 || 'Ingrese un nombre para \'Conclusiones y/o Recomendaciones\''] " />
                                </q-tab-panel>
                            </q-tab-panels>

                        </q-card-section>

                        <q-separator />
                        <q-card-section>
                            <div class="q-my-none q-mx-sm" align="right">
                                <q-btn class="q-mr-sm" label="Cancelar" @click=" resetFormFormato() " flat color="negative" />
                                <q-btn label="Guardar" type="submit" color="positive" />
                            </div>
                        </q-card-section>
                    </q-form>


                </q-card>
            </q-dialog>

            <q-dialog v-model=" dialogEliminarPeriodo " persistent>
                <q-card>
                    <q-card-section class="row items-center">
                        <q-avatar icon="warning" color="warning" text-color="white" />
                        <span class="q-ml-sm">¿Está seguro que desea eliminar el Periodo Academico?</span>
                    </q-card-section>

                    <q-card-actions align="right">
                        <q-btn flat label="Cancel" color="negative" v-close-popup />
                        <q-btn flat label="Aceptar" color="primary" @click=" eliminarPeriodo() " />
                    </q-card-actions>
                </q-card>
            </q-dialog>


            <q-dialog v-model=" dialogEliminarFormato " persistent>
                <q-card>
                    <q-card-section class="row items-center">
                        <q-avatar icon="warning" color="warning" text-color="white" />
                        <span class="q-ml-sm">¿Está seguro que desea eliminar el Formato <b>{{ formatoEliminar.nombreFormato
                                ?
                                formatoEliminar.nombreFormato : '' }}</b>? </span>
                    </q-card-section>

                    <q-card-actions align="right">
                        <q-btn flat label="Cancel" color="negative" v-close-popup />
                        <q-btn flat label="Aceptar" color="primary" @click=" eliminarFormato() " />
                    </q-card-actions>
                </q-card>
            </q-dialog>

            <q-dialog v-model=" dialogUsarFormato " persistent>
                <q-card style="max-width: 420px">
                    <q-card-section class="row items-center">
                        <q-avatar icon="warning" color="warning" text-color="white" />
                        <span class="q-ml-sm">¿Está seguro que desea usar el Formato <b>{{ formatoUsar.nombreFormato
                                ?
                                formatoUsar.nombreFormato : '' }}</b> para generar el informe final? </span>
                    </q-card-section>

                    <q-card-actions align="right">
                        <q-btn flat label="Cancel" color="negative" v-close-popup />
                        <q-btn flat label="Aceptar" color="primary" @click=" usarFormato() " />
                    </q-card-actions>
                </q-card>
            </q-dialog>

        </q-card>

    </div>
</template>

<script setup>
import { ref } from 'vue';
import periodoController from 'src/controller/periodo-controller';
import { useQuasar } from 'quasar';
import formatoController from 'src/controller/formato-controller';
import downloadPdf from 'src/utils/downloadPdf';

const $q = useQuasar()
const tab = ref('periodoAcademico');
const tabFormato = ref('informacionGeneral')

const formatoActivo = ref(null)

const formPeriodo = ref({
    draw: false,
    editar: false,
    titulo: '',
    nombre: '',
    fechaInicio: '',
    fechaFinal: '',
})

const formFormato = ref({
    draw: false,
    titulo: ''
})

const headerPeriodo = [
    { name: 'nombre', label: 'Nombre', sortable: true, field: 'nombre', align: 'left', style: 'max-width: 120px; white-space: break-spaces;' },
    { name: 'fechaInicio', label: 'Fecha de inicio', sortable: false, field: 'fechaInicio', align: 'center' },
    { name: 'fechaFin', label: 'Fecha Final', sortable: false, field: 'fechaFin', align: 'center' },
    { name: 'estado', label: 'Estado', sortable: false, field: 'estado', align: 'center' },
]
const dataPeriodo = ref([])

const headerFormato = [
    { name: 'nombreFormato', label: 'Nombre', sortable: true, field: 'nombreFormato', align: 'left', style: 'max-width: 200px; white-space: break-spaces;' },
    { name: 'estado', label: 'Estado', sortable: false, field: 'estado', align: 'center' },
    { name: 'tipo', label: 'Tipo', sortable: false, field: 'tipo', align: 'center', style: 'max-width: 80px; white-space: break-spaces;' },
]
const dataFormato = ref([])

const dialogEliminarPeriodo = ref(false)
const idEliminarPeriodo = ref(null)

const dialogEliminarFormato = ref(false)
const formatoEliminar = ref(null)

const dialogUsarFormato = ref(false)
const formatoUsar = ref(null)

async function obtenerTodosPeriodos() {
    await periodoController.obtenerTodosPeriodos((res) => {
        if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/login' }) }
        if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
        if (res.status != 200) return generateMessage('NO OK', res.message)
        let periodos = res.data.periodos
        for (let i = 0; i < periodos.length; i++) {
            periodos[i].fechaInicio = new Date(periodos[i].fechaInicio).toLocaleDateString()
            periodos[i].fechaFin && periodos.fechaFin != '' ?
                periodos[i].fechaFin = new Date(periodos[i].fechaFin).toLocaleDateString() :
                periodos[i].fechaFin = 'NO DEFINIDO'

        }
        dataPeriodo.value = periodos
    })
}

async function obtenerTodosFormatos() {
    await formatoController.obtenerTodosFormato((res) => {
        if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/login' }) }
        if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
        if (res.status != 200) return generateMessage('NO OK', res.message)
        dataFormato.value = res.data.formatos
        for (let i = 0; i < dataFormato.value.length; i++) {
            if (dataFormato.value[i].estado) formatoActivo.value = dataFormato.value[i]
        }
    })
}

function formularioFormato() {
    formFormato.value = formatoActivo.value
    formFormato.value.titulo = 'Crear Nuevo Formato'
    formFormato.value.draw = true
}

function editarFormatoForm(props) {
    formFormato.value = props.row
    formFormato.value.isEditar = true
    formFormato.value.titulo = 'Editar Formato'
    formFormato.value.draw = true
}

function formularioPeriodo() {
    formPeriodo.value.draw = true
    formPeriodo.value.titulo = 'Crear Nuevo Periodo'
    formPeriodo.value.editar = false
}

function formularioEditarPeriodo(periodo) {
    console.log(periodo)
    formPeriodo.value.draw = true
    formPeriodo.value.editar = true
    formPeriodo.value.titulo = 'Editar Periodo Académico'
    formPeriodo.value.id = periodo._id
    formPeriodo.value.nombre = periodo.nombre
    const fechaInicioOriginal = periodo.fechaInicio;
    const partesFecha = fechaInicioOriginal.split('/');
    const fechaInicioFormateada = partesFecha[2] + '-' + (partesFecha[1] < 10 ? '0' + partesFecha[1] : partesFecha[1]) + '-' + (
        partesFecha[0] < 10 ? '0' + partesFecha[0] : partesFecha[0]
    );
    formPeriodo.value.fechaInicio = fechaInicioFormateada
    if (periodo.fechaFin != 'NO DEFINIDO') {
        const fechaFinOriginal = periodo.fechaFin;
        const partesFechaFin = fechaFinOriginal.split('/');
        const fechaFinFormateada = partesFechaFin[2] + '-' + (partesFechaFin[1] < 10 ? '0' + partesFechaFin[1] : partesFechaFin[1]) + '-' + (
            partesFechaFin[0] < 10 ? '0' + partesFechaFin[0] : partesFechaFin[0]
        );
        formPeriodo.value.fechaFinal = fechaFinFormateada
    } else {
        formPeriodo.value.fechaFinal = ''
    }

}

async function guardarFormFormato() {
    const idformato = formFormato.value._id
    delete formFormato.value.created_at
    delete formFormato.value.updated_at
    delete formFormato.value._id
    if (formFormato.value.isEditar) {
        await formatoController.actualizar(idformato, formFormato.value, res => {
            if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/login' }) }
            if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
            if (res.status != 200) return generateMessage('NO OK', res.message)
            generateMessage('OK', res.data.message)
            resetFormFormato()
            obtenerTodosFormatos()
        })
    } else {
        delete formFormato.value.estado
        delete formFormato.value.tipo
        await formatoController.crearFormato(formFormato.value, res => {
            if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/login' }) }
            if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
            if (res.status != 200) return generateMessage('NO OK', res.message)
            generateMessage('OK', res.data.message)
            resetFormFormato()
            obtenerTodosFormatos()
        })
    }

    resetFormFormato()
}

async function eliminarFormato() {
    await formatoController.eliminar(formatoEliminar.value._id, res => {
        if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/login' }) }
        if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
        if (res.status != 200) return generateMessage('NO OK', res.message)
        dialogEliminarFormato.value = false
        generateMessage('OK', res.data.message)
        obtenerTodosFormatos()
    })
}

async function usarFormato() {
    await formatoController.cambiarEstado(formatoUsar.value._id, res => {
        if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/login' }) }
        if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
        if (res.status != 200) return generateMessage('NO OK', res.message)
        dialogUsarFormato.value = false
        generateMessage('OK', res.data.message)
        obtenerTodosFormatos()
    })
}

async function guardarFormPeriodo() {
    console.log(formPeriodo.value)
    const data = {
        nombre: formPeriodo.value.nombre,
        fechaInicio: new Date(formPeriodo.value.fechaInicio + ' 14:00:00'),
        fechaFin: ''
    }
    if (formPeriodo.value.fechaFinal != '') data.fechaFin = new Date(formPeriodo.value.fechaFinal + ' 14:00:00')
    console.log(data)
    let res = null
    if (formPeriodo.value.editar) {
        res = await periodoController.editar(formPeriodo.value.id, data)
    } else {
        res = await periodoController.crearPeriodo(data)
    }
    if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/login' }) }
    if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
    if (res.status != 200) return generateMessage('NO OK', res.message)
    obtenerTodosPeriodos()
    formPeriodo.value.draw = false
    generateMessage('OK', res.data.message)
}

function isMayorFechaInicial() {
    if (formPeriodo.value.fechaFinal == '') return true
    if (formPeriodo.value.fechaInicio != '') {
        const fechaInicio = new Date(formPeriodo.value.fechaInicio)
        const fechaFinal = new Date(formPeriodo.value.fechaFinal)
        if (fechaInicio > fechaFinal) return false
        return true
    }
    return true
}

function resetFormFormato() {
    formFormato.value = {
        draw: false,
        titulo: ''
    }
}

function resetForm() {
    formPeriodo.value = {
        draw: false,
        editable: false,
        titulo: '',
        nombre: '',
        fechaInicio: '',
        fechaFinal: '',
    }
}

function confirmacionEliminarPeriodo(data) {
    idEliminarPeriodo.value = data._id
    dialogEliminarPeriodo.value = true
}

function confirmacionEliminarFormato(formato) {
    formatoEliminar.value = formato
    dialogEliminarFormato.value = true
}

async function eliminarPeriodo() {
    await periodoController.eliminarPeriodo(idEliminarPeriodo.value, (res) => {
        if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/login' }) }
        if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
        if (res.status != 200) return generateMessage('NO OK', res.message)
        obtenerTodosPeriodos()
        return generateMessage('OK', res.data.message)
    })
    idEliminarPeriodo.value = null
    dialogEliminarPeriodo.value = false
}

function verFormato(formatoVer) {
    downloadPdf.formatoPdf(formatoVer, null)
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

obtenerTodosPeriodos()
obtenerTodosFormatos()

</script>

<style lang="scss">
.my-card {
    width: 100%;
}

.card-title-gestionar {
    background-color: $primary;
    color: white;
}
</style>