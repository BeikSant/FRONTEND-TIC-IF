<template>
    <div class="q-ma-md">
        <h6 v-if="!periodo.estado">No existe un periodo academico activo</h6>
        <q-card class="my-card" v-else>
            <q-card-section class="card-title-gestionar">
                <div class="row justify-between">
                    <div class="col-9">
                        <div class="col q-table__title" inline><b>Gestión del Informe Final</b></div>
                    </div>
                    <div class="col-3" align="right">
                        <q-btn :disabled="tab.length == 0 && conclusionesRecomendaciones.length == 0" size="sm"
                            color="positive" @click="descargarPDF()">Descargar Informe</q-btn>
                    </div>
                </div>
            </q-card-section>
            <q-card-section class="bg-blue-1 no-padding no-margin" style="min-height: 150px">
                <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                    <div v-show="isDataTable" class="no-padding no-margin">
                        <template v-if="tab.length == 0">
                            <div align="center" class="q-pt-xl">
                                <b>NADA QUE MOSTRAR</b>
                            </div>
                        </template>
                        <template v-else>
                            <q-tabs indicator-color="white" v-model="tab" dense class="bg-primary text-white shadow-2"
                                inline-label outside-arrows mobile-arrows>
                                <q-tab v-for="(fs, index) in actividadesEspecificas" :key="index" :label=fs.nombre
                                    :name=fs.nombre />
                            </q-tabs>
                            <q-tab-panels class="bg-blue-1" v-model="tab" animated>
                                <q-tab-panel v-for="funs, index in actividadesEspecificas" :key="index" :name="funs.nombre">

                                    <q-table dense :columns="headers" :rows="funs.actividadesEspecificas" row-key="name"
                                        :no-data-label="'No existen actividades específicas'" :key="'table-' + index"
                                        :pagination="{ rowsPerPage: 10 }" :rows-per-page-options="[5, 10, 0]"
                                        rows-per-page-label="Resultados por página">
                                        <template v-slot:top>
                                            <div class="col q-table__title"><b>Actividades de: {{ tab }}</b></div>
                                            <q-btn @click="nuevaActividadForm" size="sm" class="col-2 bton-lista-docente"
                                                color="blue-7" style="color:white">Nueva Actividad</q-btn>
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
                                                    <div style="display: inline;">
                                                        <q-btn size="sm" color="positive" round dense icon="mdi-folder-edit"
                                                            @click="mostrarCamposActividad(props.row._id, props.row.nombre)" />
                                                        <q-tooltip :offset="[10, 10]" class="bg-indigo">
                                                            Gestionar campos actividad
                                                        </q-tooltip>
                                                    </div>
                                                    <div style="display: inline;">
                                                        <q-btn size="sm" color="warning" round dense
                                                            @click="editarActividadForm(props)"
                                                            icon="mdi-file-document-edit" />
                                                        <q-tooltip :offset="[10, 10]" class="bg-indigo">
                                                            Editar información actividad
                                                        </q-tooltip>
                                                    </div>
                                                    <div style="display: inline;">
                                                        <q-btn size="sm" color="negative" round dense
                                                            @click="confirmacionEliminarActividad(props.row)"
                                                            icon="mdi-delete" />
                                                        <q-tooltip :offset="[10, 10]" class="bg-indigo">
                                                            Eliminar actividad
                                                        </q-tooltip>
                                                    </div>

                                                </q-td>
                                            </q-tr>
                                        </template>

                                    </q-table>

                                </q-tab-panel>
                            </q-tab-panels>

                        </template>
                    </div>

                </transition>
                <q-inner-loading :showing="visible" label="Cargando información..." label-class="text-teal"
                    label-style="font-size: 1.1em" />
            </q-card-section>

            <!-- CONCLUSIONES Y O RECOMENDACIONES-->
            <div class="card-title-gestionar q-pa-md">
                <b>{{ formatoInforme.conclusiones ? formatoInforme.conclusiones : "" }}</b>
            </div>
            <q-card-section class="q-px-lg bg-blue-1" style="min-height: 150px">
                <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                    <div v-show="isRecomendaciones" class="no-padding no-margin">
                        <template v-if="conclusionesRecomendaciones.length == 0">
                            <div align="center" class="q-pt-xl">
                                <b>NADA QUE MOSTRAR</b>
                            </div>
                        </template>
                        <template v-else>
                            <q-list bordered separator dense class="bg-white">
                                <q-item>
                                    <q-item-section caption>
                                        <q-item-label>
                                            <q-input bottom-slots v-model="textconclusionesRecomendaciones"
                                                :label="`Agregar ${formatoInforme.conclusiones ? formatoInforme.conclusiones : ''}`"
                                                dense type="text" autogrow
                                                :rules="[val => val && val.length > 0 || val == null || 'Complete este campo']">
                                                <template v-slot:append>
                                                    <q-icon
                                                        v-if="textconclusionesRecomendaciones !== '' && textconclusionesRecomendaciones != null"
                                                        name="close" @click="textconclusionesRecomendaciones = null"
                                                        class="cursor-pointer" />
                                                    <q-btn round dense flat icon="add"
                                                        @click="guardarConclusionRecomendacion" />
                                                </template>
                                            </q-input>
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-item v-for="item, index in conclusionesRecomendaciones" :key="index">
                                    <q-item-section>
                                        <q-item-label>
                                            <div class="row justify-between items-center">
                                                <div class="col-1" v-if="indexEditConclusion != index">
                                                    <q-btn flat icon="mdi-chevron-up" color="grey-7" size="xs" round
                                                        :disable="index != 0 ? false : true"
                                                        @click="cambiarPosicionConclusion(item._id, (index + 1) - 1)"></q-btn>
                                                    <q-btn flat icon="mdi-chevron-down" color="grey-7" size="xs" round
                                                        :disable="index != (conclusionesRecomendaciones.length - 1) ? false : true"
                                                        @click="cambiarPosicionConclusion(item._id, (index + 1) + 1)"></q-btn>
                                                </div>
                                                <div class="col-1" v-if="indexEditConclusion != index">
                                                    <b>{{ (index + 1) + '. ' }}</b>
                                                </div>
                                                <template v-if="indexEditConclusion != index">
                                                    <div class="col-9">{{ item.nombre }}</div>
                                                    <div class="col-1">
                                                        <q-btn color="amber" flat round size="sm"
                                                            icon="mdi-file-edit-outline"
                                                            @click="indexEditConclusion = index; textEditConclusion = item.nombre" />
                                                        <q-btn color="red" flat round size="sm" icon="mdi-trash-can-outline"
                                                            @click="eliminarConclusionRecomendacion(item._id)" />
                                                    </div>
                                                </template>
                                                <template v-else>
                                                    <div class="col-9">
                                                        <q-input bottom-slots v-model="textEditConclusion" :label="`Editar`"
                                                            dense autogrow
                                                            :rules="[val => val && val.length > 0 || val == null || 'Este campo no puede estar vacío']" />
                                                    </div>
                                                    <div class="col-1">
                                                        <q-btn color="positive" flat round size="sm" icon="mdi-check-bold"
                                                            @click="editarConclusionRecomendacion(item._id)" />
                                                        <q-btn color="red" flat round size="sm" icon="close"
                                                            @click="indexEditConclusion = null" />
                                                    </div>
                                                </template>
                                            </div>
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>

                            </q-list>
                        </template>
                    </div>
                </transition>
                <q-inner-loading :showing="visibleConclusiones" label="Cargando información..." label-class="text-teal"
                    label-style="font-size: 1.1em" />

            </q-card-section>

            <!-- DIALOG DE CAMPOS ACTIVIDAD ESPECIFICA-->

            <q-dialog v-model="modalVerActividadEspecifica" persistent>
                <q-card style="max-width: 700px">
                    <q-card-section class="card-title-gestionar">
                        <div class="text-h6">Actividad Especifica: {{ informacionActividad.nombre }}</div>
                    </q-card-section>

                    <q-tabs @update:model-value="onTabChanged" indicator-color="secondary" v-model="tab_actividad" dense
                        outside-arrows mobile-arrows class="bg-primary text-white shadow-2" inline-label no-caps>

                        <q-tab v-for="inf, index in informacionActividad.informacion" :key="index" :name="inf.nombre"
                            :label="inf.nombre" />

                    </q-tabs>
                    <q-card-section style="max-height: 50vh; min-height: 50vh; max-width: 550px;"
                        class="scroll no-margin no-padding">
                        <q-tab-panels v-model="tab_actividad">

                            <q-tab-panel v-for="inf, index in informacionActividad.informacion" :key="index"
                                :name="inf.nombre">
                                <q-list bordered separator dense>
                                    <q-item>
                                        <q-item-section>
                                            <q-item-label>
                                                <q-input bottom-slots v-model="textActividadDesarrollada"
                                                    label="Nueva actividad desarrollada" dense autogrow
                                                    :rules="[val => val && val.length > 0 || val == null || 'Complete este campo']"
                                                    v-if="inf.nombre == formatoInforme.actividadesDesarrolladas">
                                                    <template v-slot:append>
                                                        <q-icon
                                                            v-if="textActividadDesarrollada !== '' && textActividadDesarrollada != null"
                                                            name="close" @click="textActividadDesarrollada = null"
                                                            class="cursor-pointer" />
                                                        <q-btn @click="guardarCamposActividad(informacionActividad.id)"
                                                            round dense flat icon="add" />
                                                    </template>
                                                </q-input>

                                                <q-input bottom-slots v-model="textEvidencia" label="Nueva evidencia" dense
                                                    :rules="[val => val && val.length > 0 || val == null || 'Complete este campo']"
                                                    v-if="inf.nombre == formatoInforme.evidencias" autogrow>
                                                    <template v-slot:append>
                                                        <q-icon v-if="textEvidencia !== '' && textEvidencia != null"
                                                            name="close" @click="textEvidencia = null"
                                                            class="cursor-pointer" />
                                                        <q-btn @click="guardarCamposActividad(informacionActividad.id)"
                                                            round dense flat icon="add" />
                                                    </template>
                                                </q-input>

                                                <q-form @submit="guardarCamposActividad(informacionActividad.id)" dense
                                                    v-if="inf.nombre == formatoInforme.observaciones">
                                                    <q-input bottom-slots v-model="textObservacion" dense
                                                        label="Nueva observación" autogrow
                                                        :rules="[val => val && val.length > 0 || val == null || 'Complete este campo']">
                                                        <template v-slot:append>
                                                            <q-icon v-if="textObservacion !== '' && textObservacion != null"
                                                                name="close" @click="textObservacion = null"
                                                                class="cursor-pointer" />
                                                        </template>
                                                    </q-input>
                                                    <div class="row">
                                                        <div class="col-10">
                                                            <q-input bottom-slots v-model="enlaceObservacion"
                                                                label="Enlace (opcional)" hint="Formato http:// o https://"
                                                                dense autogrow
                                                                :rules="[val => (val == '' || val == null) || (val && val.length > 0 && isUrl(val)) || 'No es un enlace válido']">
                                                                <template v-slot:append>
                                                                    <q-icon
                                                                        v-if="enlaceObservacion !== '' && enlaceObservacion != null"
                                                                        name="close" @click="enlaceObservacion = null"
                                                                        class="cursor-pointer" />
                                                                </template>
                                                            </q-input>
                                                        </div>
                                                        <div class="col-2" align="right">
                                                            <q-btn class="q-mt-md" type="submit" color="grey-7" dense flat
                                                                round icon="add" />
                                                        </div>
                                                    </div>
                                                </q-form>
                                            </q-item-label>
                                        </q-item-section>
                                    </q-item>
                                    <q-item v-for="(item, key) in inf.data" :key="key">
                                        <q-item-section>
                                            <q-item-label>
                                                <div class="row justify-between items-center">
                                                    <div class="col-1" v-if="itemEditCampo != key">
                                                        <q-btn flat icon="mdi-chevron-up" color="grey-7" size="xs" round
                                                            :disable="key != 0 ? false : true"
                                                            @click="cambiarPosicionItem(item, (key + 1) - 1)"></q-btn>
                                                        <q-btn flat icon="mdi-chevron-down" color="grey-7" size="xs" round
                                                            :disable="key != inf.data.length - 1 ? false : true"
                                                            @click="cambiarPosicionItem(item, (key + 1) + 1)"></q-btn>
                                                    </div>
                                                    <div class="col-1" v-if="itemEditCampo != key">
                                                        <b>{{ (key + 1) + '. ' }}</b>
                                                    </div>
                                                    <template v-if="itemEditCampo != key">
                                                        <div class="col-8" v-if="item.enlace">{{ item.nombre }}
                                                            <q-btn tag="a" :href="item.enlace" target="_blank" size="xs"
                                                                icon="mdi-link" flat color="blue-12"></q-btn>
                                                        </div>
                                                        <div class="col-8 " v-else>{{ item.nombre }}
                                                        </div>
                                                        <div class="col-2" align="right">
                                                            <q-btn color="amber" flat round size="xs"
                                                                icon="mdi-file-edit-outline"
                                                                @click="itemEditCampo = key; textEditCampo = item.nombre; enlaceEditCampo = item.enlace ? item.enlace : null " />
                                                            <q-btn color="red" flat round size="xs"
                                                                icon="mdi-trash-can-outline"
                                                                @click="eliminarCamposActividad(item._id)" />
                                                        </div>
                                                    </template>
                                                    <template v-else>
                                                        <template v-if="inf.nombre == formatoInforme.observaciones">
                                                            <div class="col-10">
                                                                <q-form
                                                                    @submit="editarCamposActividad(informacionActividad.id)"
                                                                    dense v-if="inf.nombre == formatoInforme.observaciones">
                                                                    <q-input bottom-slots v-model="textEditCampo"
                                                                        label="Editar" dense autogrow
                                                                        :rules="[val => val && val.length > 0 || val == null || 'Complete este campo']">
                                                                        <template v-slot:append>
                                                                            <q-icon
                                                                                v-if="textEditCampo !== '' && textEditCampo != null"
                                                                                name="close" @click="textEditCampo = null"
                                                                                class="cursor-pointer" />
                                                                        </template>
                                                                    </q-input>
                                                                    <q-input bottom-slots v-model="enlaceEditCampo"
                                                                        label="Enlace (opcional)"
                                                                        hint="Formato http:// o https://" dense autogrow
                                                                        :rules="[val => (val == '' || val == null) || (val && val.length > 0 && isUrl(val)) || 'No es un enlace válido']">
                                                                        <template v-slot:append>
                                                                            <q-icon
                                                                                v-if="enlaceEditCampo !== '' && enlaceEditCampo != null"
                                                                                name="close" @click="enlaceEditCampo = null"
                                                                                class="cursor-pointer" />
                                                                        </template>
                                                                    </q-input>

                                                                </q-form>
                                                            </div>
                                                        </template>
                                                        <template v-else>
                                                            <div class="col-10">
                                                                <q-input bottom-slots v-model="textEditCampo"
                                                                    style="width: 100%;" width="100%" dense autogrow
                                                                    :rules="[val => val && val.length > 0 || val == null || 'Este campo no puede estar vacio']">
                                                                    <template v-slot:append>
                                                                        <q-icon
                                                                            v-if="textEvidencia !== '' && textEvidencia != null"
                                                                            name="close" @click="textEvidencia = null"
                                                                            class="cursor-pointer" />
                                                                    </template>
                                                                </q-input>
                                                            </div>
                                                        </template>

                                                        <div class="col-2" align="right">
                                                            <q-btn color="positive" flat round size="sm"
                                                                icon="mdi-check-bold"
                                                                @click="editarCamposActividad(item._id)" />
                                                            <q-btn color="red" flat round size="sm" icon="close"
                                                                @click="itemEditCampo = null" />
                                                        </div>
                                                    </template>

                                                </div>
                                            </q-item-label>
                                        </q-item-section>
                                    </q-item>

                                </q-list>
                            </q-tab-panel>

                        </q-tab-panels>
                    </q-card-section>
                    <q-separator></q-separator>
                    <q-card-actions align="right">
                        <q-btn flat label="Cerrar" color="negative" v-close-popup @click="obtenerActividadesInforme()" />
                    </q-card-actions>
                </q-card>

            </q-dialog>

            <q-dialog v-model="form_actividad">
                <q-card style="max-width: 400px">
                    <q-card-section class="card-title-gestionar">
                        <div class="text-h6">{{ titulo_form }}<b>{{ tab }}</b></div>
                    </q-card-section>

                    <q-separator />

                    <q-card-section>
                        <q-form @submit="onSubmit" class="q-gutter-md">

                            <q-select filled v-model="selected" :options="selectActividades"
                                label="Actividad del Distributivo"
                                :rules="[val => val && val.length > 0 || 'Seleccione una actividad del distributivo']" />

                            <q-input filled v-model="nombre_actividad" label="Nombre de la actividad especifica"
                                :hint="selected + '-' + nombre_actividad.replace(/\s+/g, '_')" lazy-rules
                                :rules="[val => val && val.length > 0 || 'Ingrese el nombre de la actividad']" />

                            <q-input filled type="number" v-model="horas_actividad" label="Horas" lazy-rules :rules="[
                                val => val !== null && val !== '' || 'Ingrese el número de horas planificadas',
                                val => val > 0 || 'Ingrese el número de horas planificadas'
                            ]" />

                            <q-separator />
                            <div>
                                <q-btn label="Cancelar" @click="resetForm" flat color="negative" class="q-ml-sm" />
                                <q-btn label="Guardar" type="submit" color="positive" />
                            </div>
                        </q-form>
                    </q-card-section>


                </q-card>
            </q-dialog>

            <q-dialog v-model="confirm_delete" persistent>
                <q-card>
                    <q-card-section class="row items-center">
                        <q-avatar icon="warning" color="warning" text-color="white" />
                        <span class="q-ml-sm">¿Está seguro en eliminar la actividad especifica
                            <b>{{ actividadEliminar.nombre }}</b>?</span>
                    </q-card-section>

                    <q-card-actions align="right">
                        <q-btn flat label="Cancel" color="negative" v-close-popup @click="confirm_delete = false" />
                        <q-btn flat label="Aceptar" color="primary" @click="eliminarActividad()" />
                    </q-card-actions>
                </q-card>
            </q-dialog>
        </q-card>
    </div>
</template>

<script setup>
import { api } from 'src/boot/axios';
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import generarPDF from 'src/utils/generar-pdf';
import periodoController from 'src/controller/periodo-controller';
import informeController from 'src/controller/informe-controller';
import especificaController from 'src/controller/especifica-controller';
import { useRouter } from 'vue-router';
import distributivo from 'src/controller/distributivo';
import formatoController from 'src/controller/formato-controller';
import evidenciaController from 'src/controller/evidencia-controller';
import observacionController from 'src/controller/observacion-controller';
import desarrolladaController from 'src/controller/desarrollada-controller';
import conclusionRecomendacionController from 'src/controller/conclusionRecomendacion.controller';
import descargarExcel from 'src/utils/descargarExcel';

const router = useRouter()
const modalVerActividadEspecifica = ref(false)
const textActividadDesarrollada = ref(null)
const textconclusionesRecomendaciones = ref(null)
const textEvidencia = ref(null)
const textObservacion = ref(null)
const enlaceObservacion = ref(null)
const indexEditConclusion = ref(null)
const textEditConclusion = ref('')

const conclusionesRecomendaciones = ref([])

const informacionActividad = ref({
    id: null,
    nombre: null,
    evidencias: [],
    observaciones: [],
    desarrolladas: []
})

const tab_actividad = ref('actividadesdesarrolladas')

const isDataTable = ref(false)
const isRecomendaciones = ref(false)
const visibleConclusiones = ref(true)
const visible = ref(true)

const actividadEspecificaEditar = ref(null)
const actividadEliminar = ref(null)
const confirm_delete = ref(false)
const $q = useQuasar()

const titulo_form = ref('')
const editarActividad = ref(false)
const selected = ref('')
const nombre_actividad = ref('')
const horas_actividad = ref(0)

const selectActividades = ref([])
const formatoInforme = ref(null)
const periodo = ref({ estado: false })  //Para inicializar el template
const informe = ref(null)
const funcionesSustantivas = ref([])
const actividadesEspecificas = ref([])
const tab = ref([])
const form_actividad = ref(false)
const headers = [
    { name: 'nombre', label: 'Nombre', sortable: true, field: 'nombre', align: 'left' },
    { name: 'horas', label: 'Horas', sortable: false, field: 'horas', align: 'center' },
    { name: 'actividadDesarrollada', label: 'Actividades Desarrolladas', sortable: false, field: 'actividadDesarrollada', align: 'center' },
    { name: 'evidencia', label: 'Evidencias', sortable: false, field: 'evidencia', align: 'center' },
    { name: 'observacion', label: 'Observaciones', sortable: false, field: 'observacion', align: 'center' },
]


const textEditCampo = ref('false')
const itemEditCampo = ref(null)
const enlaceEditCampo = ref(null)

const obtenerUltimoPeriodo = async () => {
    await periodoController.obtenerUltimoPeriodo((res) => {
        if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/login' }) }
        if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
        if (res.status != 200) { generateMessage('NO OK', res.message); visible.value = false; return isDataTable.value = true }
        periodo.value = res.data.periodo
        obtenerInformePorPeriodo()
    })
}

const obtenerInformePorPeriodo = async () => {
    await informeController.obtenerInformePeriodo(periodo.value.nombre, async (res) => {
        if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/login' }) }
        if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
        if (res.status != 200) { generateMessage('NO OK', res.message); visible.value = false; return isDataTable.value = true }
        informe.value = res.data.informeFinal
        await obtenerActividadesDistributivo()
        obtenerConclusionesRecomendaciones()
        obtenerActividadesInforme()
    })
}

const obtenerConclusionesRecomendaciones = async () => {
    await conclusionRecomendacionController.obtenerPorInforme(informe.value._id, (res => {
        if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/login' }) }
        if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
        if (res.status != 200) return generateMessage('NO OK', 'Ocurrió un error al obtener las' + informe.value.conclusionesRecomendaciones)
        conclusionesRecomendaciones.value = res.data
    }))
    isRecomendaciones.value = true
    visibleConclusiones.value = false

}

const obtenerActividadesDistributivo = async () => {  //Obtienes las actividades del distributivo con sus respectivas funciones sustantivas
    await distributivo.obtenerTodasActividades(async (res) => {
        if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/login' }) }
        if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
        if (res.status != 200) { generateMessage('NO OK', res.message); visible.value = false; return isDataTable.value = true }
        funcionesSustantivas.value = res.data.actividades.funcionesSustantivas
        for (let i = 0; i < funcionesSustantivas.value.length; i++) {
            actividadesEspecificas.value.push({ nombre: funcionesSustantivas.value[i].nombre, actividadesEspecificas: [] }) // Aqui se coloca la funcion sustantivas las actividad del distributivo que tiene
        }
        if (actividadesEspecificas.value.length != 0) tab.value = actividadesEspecificas.value[0].nombre
    })
    visible.value = false
    isDataTable.value = true
}

const obtenerActividadesInforme = async () => {
    await especificaController.obtenerActividadesPorInforme(informe.value._id, (res) => {
        if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/login' }) }
        if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
        if (res.status != 200) { generateMessage('NO OK', res.message); visible.value = false; return isDataTable.value = true }
        const actsEsp = res.data.actividadesEspecificas
        for (let i = 0; i < actividadesEspecificas.value.length; i++) {
            actividadesEspecificas.value[i].actividadesEspecificas = []
        }
        for (let i = 0; i < actsEsp.length; i++) {
            for (let j = 0; j < actividadesEspecificas.value.length; j++) {
                if (actsEsp[i].actividadDistributivo.funcionSustantiva.nombre
                    == actividadesEspecificas.value[j].nombre) actividadesEspecificas.value[j].actividadesEspecificas.push(actsEsp[i])
            }
        }
    })
    isDataTable.value = true
    visible.value = false

}


const obtenerFormatoInforme = async () => {
    await formatoController.obtenerInformeActivo((res) => {
        if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/login' }) }
        if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
        if (res.status != 200) return generateMessage('NO OK', res.message)
        formatoInforme.value = res.data
        informacionActividad.value.informacion = []
        informacionActividad.value.informacion.push({ nombre: formatoInforme.value.actividadesDesarrolladas, data: [] })
        informacionActividad.value.informacion.push({ nombre: formatoInforme.value.evidencias, data: [] })
        informacionActividad.value.informacion.push({ nombre: formatoInforme.value.observaciones, data: [] })
    })
}

function confirmacionEliminarActividad(actividad) {
    actividadEliminar.value = actividad
    confirm_delete.value = true
}

async function eliminarActividad() {
    await especificaController.eliminarActividad(actividadEliminar.value._id, (res) => {
        if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/login' }) }
        if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
        if (res.status != 200) return generateMessage('NO OK', 'Ocurrió un error al eliminar la actividad')
        obtenerActividadesInforme()
        actividadEliminar.value = null
        confirm_delete.value = false
    })
}

function selectedActividadDistributivo() {
    selectActividades.value = []
    const fs = funcionesSustantivas.value.filter((fun) => fun.nombre == tab.value)
    for (let i = 0; i < fs[0].actividadesDistributivo.length; i++) {
        selectActividades.value.push(fs[0].actividadesDistributivo[i].sigla)
    }
}

async function nuevaActividadForm() {
    await resetForm()
    selectedActividadDistributivo()
    titulo_form.value = 'Agregar nueva actividad de: '
    form_actividad.value = true

}

async function editarConclusionRecomendacion(idConclusion) {
    if (textEditConclusion.value == null || textEditConclusion.value == '') return
    const data = {
        nombre: textEditConclusion.value
    }
    await conclusionRecomendacionController.editar(idConclusion, data, (res) => {
        if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/login' }) }
        if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
        if (res.status != 200) return generateMessage('NO OK', 'Ocurrió un error al guardar la información')
        generateMessage('OK', 'Campo editato con éxito')
        textEditConclusion.value = null
        indexEditConclusion.value = null
        return obtenerConclusionesRecomendaciones()
    })
}

async function eliminarConclusionRecomendacion(idConclusion) {
    textEditConclusion.value = null
    indexEditConclusion.value = null
    await conclusionRecomendacionController.eliminar(idConclusion, (res) => {
        if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/login' }) }
        if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
        if (res.status != 200) return generateMessage('NO OK', 'Error al eliminar')
        generateMessage('OK', 'Item eliminado con éxito')
        return obtenerConclusionesRecomendaciones()
    })
}

async function guardarConclusionRecomendacion() {
    textEditConclusion.value = null
    indexEditConclusion.value = null
    if (textconclusionesRecomendaciones.value == null || textconclusionesRecomendaciones.value == '') return
    const data = {
        nombre: textconclusionesRecomendaciones.value,
        informe: informe.value._id
    }
    await conclusionRecomendacionController.crear(data, (res) => {
        if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/login' }) }
        if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
        if (res.status != 200) return generateMessage('NO OK', res.message)
        generateMessage('OK', 'Información guardada con éxito')
        textconclusionesRecomendaciones.value = null
        return obtenerConclusionesRecomendaciones()
    })
}

async function editarActividadForm(valor) {
    await resetForm()
    selectedActividadDistributivo()
    titulo_form.value = 'Editar actividad específica'
    editarActividad.value = true
    selected.value = valor.row.nombre.split('-')[0]
    nombre_actividad.value = valor.row.nombre.substring(selected.value.length + 1, valor.row.nombre.length).split('_').join(' ')
    horas_actividad.value = valor.row.horas
    form_actividad.value = true
    actividadEspecificaEditar.value = valor.row

}

async function onSubmit() {
    const actividad = {
        nombre: selected.value + '-' + nombre_actividad.value.replace(/\s+/g, '_'),
        horas: +horas_actividad.value
    }
    const fs = funcionesSustantivas.value.filter((fun) => fun.nombre == tab.value)
    const actividadDis = fs[0].actividadesDistributivo.filter((act) => act.sigla == selected.value)
    if (editarActividad.value) {
        if (selected.value != actividadEspecificaEditar.value.actividadDistributivo.sigla) actividad.actividadesDistributivo = actividadDis[0]._id
        await especificaController.editarActividad(actividadEspecificaEditar.value._id, actividad, (res) => {
            if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/login' }) }
            if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
            if (res.status != 200) return generateMessage('NO OK', 'Ocurrió un error al editar la actividad')
            generateMessage('OK', 'Actividad editada con éxito')
            resetForm()
            obtenerActividadesInforme()
        })
    } else {
        await especificaController.crearActividad(informe.value._id, actividadDis[0]._id, actividad, (res) => {
            if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/login' }) }
            if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
            if (res.status != 200) return generateMessage('NO OK', 'Ocurrió un error al guardar la actividad')
            generateMessage('OK', 'Actividad guardada con éxito')
            resetForm()
            obtenerActividadesInforme()
        })
    }
}

async function resetForm() {
    form_actividad.value = false
    editarActividad.value = false
    actividadEspecificaEditar.value = null
    nombre_actividad.value = ''
    horas_actividad.value = 0
    selected.value = ''
    selectActividades.value = []
}

async function guardarCamposActividad(id) {
    let data = {
        actividadEspecifica: id
    }
    let res = null
    switch (tab_actividad.value) {
        case formatoInforme.value.actividadesDesarrolladas:
            if (textActividadDesarrollada.value == null || textActividadDesarrollada.value == '') return textActividadDesarrollada.value = ''
            data.nombre = textActividadDesarrollada.value
            res = await desarrolladaController.crearDesarrollada(data)
            textActividadDesarrollada.value = null
            break;
        case formatoInforme.value.evidencias:
            if (textEvidencia.value == null) return textEvidencia.value = ''
            data.nombre = textEvidencia.value
            res = await evidenciaController.crearEvidencia(data)
            textEvidencia.value = null
            break;
        case formatoInforme.value.observaciones:
            if (textObservacion.value == null || textObservacion.value == '') return textObservacion.value = ''
            if (enlaceObservacion.value != null && enlaceObservacion.value != '' && !isUrl(enlaceObservacion.value)) return
            data.nombre = textObservacion.value
            if (enlaceObservacion.value != null && enlaceObservacion.value != '') data.enlace = enlaceObservacion.value
            res = await observacionController.crearObservacion(data)
            textObservacion.value = null
            enlaceObservacion.value = null
            break;
    }
    if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/login' }) }
    if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
    if (res.status != 200) return generateMessage('NO OK', res.message)
    generateMessage('OK', res.data.message)
    obtenerCamposActividad(id)
}

async function editarCamposActividad(idCampo) {
    if (textEditCampo.value == null || textEditCampo.value == '') return
    let data = {
        nombre: textEditCampo.value
    }
    let res = null
    switch (tab_actividad.value) {
        case formatoInforme.value.actividadesDesarrolladas:
            res = await desarrolladaController.editarDesarrollada(idCampo, data)
            break;
        case formatoInforme.value.evidencias:
            res = await evidenciaController.editarEvidencia(idCampo, data)
            break;
        case formatoInforme.value.observaciones:
            if (enlaceEditCampo.value != null || enlaceEditCampo.value != '') data.enlace = enlaceEditCampo.value
            res = await observacionController.editarObservacion(idCampo, data)
            break;
    }
    if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/login' }) }
    if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
    if (res.status != 200) return generateMessage('NO OK', res.message)
    generateMessage('OK', 'Item eliminado con éxito')
    obtenerCamposActividad(informacionActividad.value.id)
    textEditCampo.value = null
    itemEditCampo.value = null
    enlaceEditCampo.value = null
}

async function eliminarCamposActividad(idCampo) {
    textEditCampo.value = null
    itemEditCampo.value = null
    enlaceEditCampo.value = null
    let res = null
    switch (tab_actividad.value) {
        case formatoInforme.value.actividadesDesarrolladas:
            res = await desarrolladaController.eliminarDesarrollada(idCampo)
            break;
        case formatoInforme.value.evidencias:
            res = await evidenciaController.eliminarEvidencia(idCampo)
            break;
        case formatoInforme.value.observaciones:
            res = await observacionController.eliminarObservacion(idCampo)
            break;
    }
    if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/login' }) }
    if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
    if (res.status != 200) return generateMessage('NO OK', res.message)
    generateMessage('OK', 'Item eliminado con éxito')
    obtenerCamposActividad(informacionActividad.value.id)
}

async function mostrarCamposActividad(id, nombre) {
    obtenerCamposActividad(id, nombre)
    tab_actividad.value = formatoInforme.value.actividadesDesarrolladas
    modalVerActividadEspecifica.value = true
}

async function obtenerCamposActividad(id, nombre) {
    textActividadDesarrollada.value = null
    textEvidencia.value = null
    textObservacion.value = null
    enlaceObservacion.value = null
    await evidenciaController.obtenerEvidencias(id, async (res) => {
        if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/login' }) }
        if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
        if (res.status != 200) return generateMessage('NO OK', 'Ocurrió un error al gestionar la actividad')
        const evidencias = res.data.evidencias
        await desarrolladaController.obtenerDesarrolladas(id, async (res) => {
            if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/login' }) }
            if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
            if (res.status != 200) return generateMessage('NO OK', 'Ocurrió un error al gestionar la actividad')
            const desarrolladas = res.data.actividadesDesarrolladas
            await observacionController.obtenerObservaciones(id, (res) => {
                if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/login' }) }
                if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
                if (res.status != 200) return generateMessage('NO OK', 'Ocurrió un error al gestionar la actividad')
                const observaciones = res.data.observaciones
                informacionActividad.value.id = id
                informacionActividad.value.nombre = nombre
                for (let i = 0; i < informacionActividad.value.informacion.length; i++) {
                    if (informacionActividad.value.informacion[i].nombre == formatoInforme.value.actividadesDesarrolladas) {
                        informacionActividad.value.informacion[i].data = desarrolladas
                    } else if (informacionActividad.value.informacion[i].nombre == formatoInforme.value.evidencias) {
                        informacionActividad.value.informacion[i].data = evidencias
                    } else if (informacionActividad.value.informacion[i].nombre == formatoInforme.value.observaciones) {
                        informacionActividad.value.informacion[i].data = observaciones
                    }
                }
            })
        })

    })
}

async function cambiarPosicionConclusion(idConclusion, key) {
    textEditConclusion.value = null
    indexEditConclusion.value = null
    await conclusionRecomendacionController.editar(idConclusion, { orden: key })
    obtenerConclusionesRecomendaciones()
}

async function cambiarPosicionItem(item, key) {
    itemEditCampo.value = null
    textEditCampo.value = null
    enlaceEditCampo.value = null
    const data = {
        orden: key,
    }
    const tab_actual = tab_actividad.value
    switch (tab_actual) {
        case formatoInforme.value.actividadesDesarrolladas:
            await desarrolladaController.editarDesarrollada(item._id, data)
            break;
        case formatoInforme.value.evidencias:
            await evidenciaController.editarEvidencia(item._id, data)
            break;
        case formatoInforme.value.observaciones:
            await observacionController.editarObservacion(item._id, data)
            break;
    }
    await obtenerCamposActividad(informacionActividad.value.id)
}

function descargarPDF() {
    //downloadPdf.downloadPdf()
    generarPDF.generarPDF(informe.value._id, actividadesEspecificas.value, periodo.value.nombre)
}

function isUrl(s) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(s);
}

function onTabChanged(tab) {
    textEditCampo.value = ''
    itemEditCampo.value = null
}

const errorRequest = (res) => {
    if (res.status == 401) { generateMessage('NO OK', res.message); return router.re('/login') }
    if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
    if (res.status != 200) return generateMessage('NO OK', res.message)
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

obtenerFormatoInforme()
obtenerUltimoPeriodo()
//descargarExcel.descargarInformeExcel()

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