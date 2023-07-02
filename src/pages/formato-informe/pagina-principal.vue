<template>
  <q-card class="q-ma-md" square bordered flat>
    <q-card-section class="bg-primary text-white row justify-between items-center">
      <span class="text-h6 text-bold">Formatos del Informe Final</span>
      <q-btn size="sm" color="blue-7" style="color:white" @click="formularioFormato()">Nuevo
        Formato</q-btn>
    </q-card-section>
    <q-card-section class="q-pa-none">
      <q-table :columns="headerFormato" :rows="dataFormato" row-key="name" square flat separator="cell"
        :no-data-label="'No existen formatos del informe final'" :key="'tableFormato'" :pagination="{ rowsPerPage: 10 }"
        rows-per-page-label="Resultados por página" :rows-per-page-options="[5, 10, 0]" :loading="loading"
        loading-label="Cargando datos..." :dense="$q.screen.lt.md" :grid="$q.screen.xs"
        no-results-label="No hay ningún resultado" :filter="filter">

        <template v-slot:top>
          <div class="row justify-between items-center full-width">
            <span class="text-subtitle1 text-bold text-uppercase">Lista de Formatos</span>
            <q-input dense v-model="filter" placeholder="Buscar">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </template>

        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <q-badge v-if="props.row.estado" color="positive">
              ACTIVO
            </q-badge>
            <template v-else>
              <q-btn size="sm" color="negative" dense label="INACTIVO"
                @click="dialogUsarFormato = true; formatoUsar = props.row" />
              <q-tooltip class="bg-indigo" :offset="[10, 10]">
                Usar este formato
              </q-tooltip>
            </template>
          </q-td>
        </template>

        <template v-slot:body-cell-tipo="props">
          <q-td :props="props">
            <q-badge style="white-space: break-spaces;" v-if="props.row.tipo == 'POR DEFECTO'" color="blue">
              POR DEFECTO
            </q-badge>
            <q-badge style="white-space: break-spaces;" v-else color="orange">
              {{ props.row.tipo }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-acciones="props">
          <q-td :props="props" auto-width class="col items-center q-col-gutter-x-xs">
            <span>
              <q-btn size="sm" color="positive" round dense icon="mdi-download" @click=" verFormato(props.row)">
                <q-tooltip class="bg-indigo" :offset="[10, 10]">
                  Descargar
                </q-tooltip></q-btn>
            </span>
            <span>
              <q-btn v-if="props.row.tipo != 'POR DEFECTO'" size="sm" color="warning" round dense
                @click=" editarFormatoForm(props.row)" icon="mdi-file-document-edit">
                <q-tooltip class="bg-indigo" :offset="[10, 10]">
                  Editar
                </q-tooltip></q-btn>
            </span>
            <span>
              <q-btn v-if="props.row.tipo != 'POR DEFECTO'" size="sm" color="negative" round dense
                @click=" confirmacionEliminarFormato(props.row)" icon="mdi-delete" :disable="props.row.estado">
              </q-btn>
              <q-tooltip v-if="props.row.estado && props.row.tipo != 'POR DEFECTO'" class="bg-indigo" :offset="[10, 10]">
                Este formato se encuentra activo
              </q-tooltip>
              <q-tooltip v-else class="bg-indigo" :offset="[10, 10]">
                Eliminar
              </q-tooltip>
            </span>
            <span>
              <q-btn v-if="props.row.tipo == 'POR DEFECTO'" round flat color="grey" size="xs"
                icon="mdi-help-circle-outline">
                <q-tooltip max-width="150px" class="text-center">No se puede eliminar ni editar el formato POR
                  DEFECTO</q-tooltip>
              </q-btn>
            </span>
          </q-td>
        </template>

        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition">
            <q-card bordered flat>
              <q-list dense>
                <q-item v-for="col in props.cols" :key="col.name">
                  <q-item-section class="col-12 q-mb-xs q-mt-xs grid">
                    <q-item-label class="text-bold" caption>{{ col.label }}</q-item-label>

                    <q-item-label v-if="col.name == 'estado'">
                      <q-badge v-if="props.row.estado" color="positive">
                        ACTIVO
                      </q-badge>
                      <template v-else>
                        <q-btn size="sm" color="negative" dense label="INACTIVO"
                          @click="dialogUsarFormato = true; formatoUsar = props.row" />
                        <q-tooltip class="bg-indigo" :offset="[10, 10]">
                          Usar este formato
                        </q-tooltip>
                      </template>
                    </q-item-label>

                    <q-item-label v-else-if="col.name == 'tipo'">
                      <q-badge v-if="props.row.tipo == 'POR DEFECTO'" color="blue">
                        POR DEFECTO
                      </q-badge>
                      <q-badge v-else color="orange">
                        {{ props.row.tipo }}
                      </q-badge></q-item-label>

                    <q-item-label v-else-if="col.name == 'acciones'" class="col items-center q-col-gutter-x-xs">
                      <span>
                        <q-btn size="sm" color="positive" round dense icon="mdi-download" @click=" verFormato(props.row)">
                          <q-tooltip class="bg-indigo" :offset="[10, 10]">
                            Descargar
                          </q-tooltip></q-btn>
                      </span>
                      <span>
                        <q-btn v-if="props.row.tipo != 'POR DEFECTO'" size="sm" color="warning" round dense
                          @click=" editarFormatoForm(props.row)" icon="mdi-file-document-edit">
                          <q-tooltip class="bg-indigo" :offset="[10, 10]">
                            Editar
                          </q-tooltip></q-btn>
                      </span>
                      <span>
                        <q-btn v-if="props.row.tipo != 'POR DEFECTO'" size="sm" color="negative" round dense
                          @click=" confirmacionEliminarFormato(props.row)" icon="mdi-delete" :disable="props.row.estado">
                        </q-btn>
                        <q-tooltip v-if="props.row.estado && props.row.tipo != 'POR DEFECTO'" class="bg-indigo"
                          :offset="[10, 10]">
                          Este formato se encuentra activo
                        </q-tooltip>
                        <q-tooltip v-else class="bg-indigo" :offset="[10, 10]">
                          Eliminar
                        </q-tooltip>
                      </span>
                      <span>
                        <q-btn v-if="props.row.tipo == 'POR DEFECTO'" round flat color="grey" size="xs"
                          icon="mdi-help-circle-outline">
                          <q-tooltip max-width="150px" class="text-center">No se puede eliminar ni editar el formato POR
                            DEFECTO</q-tooltip>
                        </q-btn>
                      </span>
                    </q-item-label>

                    <q-item-label v-else>{{ col.value }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>
        </template>

      </q-table>
    </q-card-section>

    <q-dialog v-model="formFormato.draw" persistent square>
      <q-card style="max-width: 600px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6 text-bold">{{ formFormato.titulo }}</div>
        </q-card-section>
        <q-tabs indicator-color="indigo-2" v-model="tabFormato" dense class="text-bold bg-primary text-grey-6"
          active-class="text-white" outside-arrows mobile-arrows inline-label>
          <q-tab name="informacionGeneral">Información General</q-tab>
          <q-tab name="encabezadoTabla">Datos de la Tabla</q-tab>
        </q-tabs>
        <q-card-section class="q-pb-none q-gutter-y-md">
          <q-banner dense class="bg-indigo-1 text-justify" v-if="!formFormato.isEditar">
            <template v-slot:avatar>
              <q-icon name="mdi-information" color="primary" />
            </template>
            <span class="text-caption">
              La información de los campos actuales del formulario
              pertecen al formato que actualmente se encuentra activo</span>
          </q-banner>
          <q-banner dense class="bg-indigo-1 text-justify" v-if="!formFormato.isEditar">
            <template v-slot:avatar>
              <q-icon name="mdi-information" color="primary" />
            </template>
            <span class="text-caption">
              Al crear un formato, este automáticamente quedará activo para generar el informe
              final</span>
          </q-banner>

        </q-card-section>
        <q-form @submit="guardarFormFormato">
          <q-card-section style="max-height:50vh" class="scroll no-padding">
            <keep-alive>
              <q-tab-panels v-model="tabFormato">
                <q-tab-panel name="informacionGeneral" class="q-pa-md row q-col-gutter-x-sm q-col-gutter-y-md">
                  <q-input class="col-12" outlined square v-model="formFormato.nombreFormato" label="Nombre del formato"
                    lazy-rules autogrow :rules="[val => val && val.length > 0 || 'Complete este campo']"
                    hint="Ingrese el nombre del formato" />

                  <q-input class="col-6" outlined square v-model="formFormato.facultad" label="Campo Facultad" lazy-rules
                    :rules="[val => val && val.length > 0 || 'Complete este campo']" hint="Ingrese el campo Facultad" />

                  <q-input class="col-6" outlined square v-model="formFormato.carrera" label="Campo Carrera" lazy-rules
                    :rules="[val => val && val.length > 0 || 'Complete este campo']" hint="Ingrese el campo Carrera" />

                  <q-input class="col-6" outlined square v-model="formFormato.docente" label="Campo Docente" lazy-rules
                    :rules="[val => val && val.length > 0 || 'Complete este campo']" hint="Ingrese el campo Docente" />

                  <q-input class="col-6" outlined square v-model="formFormato.dedicacion" label="Campo Dedicación"
                    lazy-rules :rules="[val => val && val.length > 0 || 'Complete este campo']"
                    hint="Ingrese el campo Dedicación" />

                  <q-input class="col-12" outlined square v-model="formFormato.periodoAcademico"
                    label="Campo Periodo Académico" autogrow lazy-rules
                    :rules="[val => val && val.length > 0 || 'Complete este campo']"
                    hint="Ingrese el campo Periodo Académico" />

                  <q-input class="col-12" outlined square v-model="formFormato.totalHoras" label="Campo Total Horas"
                    lazy-rules autogrow :rules="[val => val && val.length > 0 || 'Complete este campo']"
                    hint="Ingrese el campo Total Horas" />
                </q-tab-panel>

                <q-tab-panel name="encabezadoTabla" class="q-pa-md row q-col-gutter-x-sm q-col-gutter-y-md">
                  <q-input class="col-12 col-sm-6" outlined square v-model="formFormato.funcionesSustantivas"
                    label="Campo Funciones Sustantivas" :rules="[val => val && val.length > 0 || 'Complete este campo']"
                    hint="Ingrese el campo Funciones Sustantivas" />

                  <q-input class="col-12 col-sm-6" outlined square v-model="formFormato.actividadesDistributivo"
                    label="Campo Actividades del distributivo" lazy-rules
                    :rules="[val => val && val.length > 0 || 'Complete este campo']"
                    hint="Ingrese el campo Actividades del distributivo" />

                  <q-input class="col-12 col-sm-6" outlined square v-model="formFormato.horasPAO"
                    label="Campo Horas del PAO" lazy-rules
                    :rules="[val => val && val.length > 0 || 'Complete este campo']"
                    hint="Ingrese el campo Horas del PAO" />

                  <q-input class="col-12 col-sm-6" outlined square v-model="formFormato.actividadesDesarrolladas"
                    label="Campo Actividades desarrolladas" lazy-rules
                    :rules="[val => val && val.length > 0 || 'Complete este campo']"
                    hint="Ingrese el campo Actividades desarrolladas" />

                  <q-input class="col-12 col-sm-6" outlined square v-model="formFormato.evidencias"
                    label="Campo Evidencias" lazy-rules :rules="[val => val && val.length > 0 || 'Complete este campo']"
                    hint="Ingrese el campo Evidencias" />

                  <q-input class="col-12 col-sm-6" outlined square v-model="formFormato.observaciones"
                    label="Campo Observaciones" lazy-rules
                    :rules="[val => val && val.length > 0 || 'Complete este campo']"
                    hint="Ingrese el campo Observaciones" />

                  <q-input class="col-12" outlined square v-model="formFormato.conclusiones"
                    label="Campo Conclusiones y/o Recomendaciones" lazy-rules autogrow
                    :rules="[val => val && val.length > 0 || 'Complete este campo']"
                    hint="Ingrese el campo Conclusiones y/o Recomendaciones" />
                </q-tab-panel>
              </q-tab-panels>
            </keep-alive>
          </q-card-section>

          <q-separator />
          <q-card-actions class="justify-end">
            <q-btn class="q-mr-sm" label="Cancelar" @click=" resetFormFormato()" flat color="negative" />
            <q-btn label="Guardar" type="submit" color="positive" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogEliminarFormato" persistent>
      <q-card>
        <q-card-section class="row items-center q-col-gutter-x-md">
          <div class="col-2">
            <q-avatar icon="warning" color="warning" text-color="white" />
          </div>
          <div class="col-10">
            <span>¿Está seguro que desea eliminar el Formato <b>{{ formatoEliminar.nombreFormato
              ? formatoEliminar.nombreFormato : '' }}</b>? </span>
          </div>
        </q-card-section>
        <q-card-actions class="justify-end">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn flat label="Si" color="primary" @click=" eliminarFormato()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogUsarFormato" persistent>
      <q-card>

        <q-card-section class="row items-center q-col-gutter-x-md">
          <div class="col-2">
            <q-avatar icon="warning" color="warning" text-color="white" />
          </div>
          <div class="col-10">
            <span>¿Está seguro que desea usar el Formato <b>{{ formatoUsar.nombreFormato
              ?
              formatoUsar.nombreFormato : '' }}</b> para generar los informes finales? </span>
          </div>
        </q-card-section>

        <q-card-actions class="justify-end">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn flat label="Si" color="primary" @click=" usarFormato()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-card>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import formatoController from 'src/controller/formato-controller';
import downloadPdf from 'src/utils/downloadPdf';

const $q = useQuasar()
const tabFormato = ref('informacionGeneral')

const formatoActivo = ref(null)
const loading = ref(false)
const formFormato = ref({
  draw: false,
  titulo: ''
})

const filter = ref('')

const headerFormato = [
  { name: 'nombreFormato', label: 'NOMBRE', sortable: true, field: 'nombreFormato', align: 'left', style: 'max-width: 200px; white-space: break-spaces;' },
  { name: 'estado', label: 'ESTADO', sortable: false, field: 'estado', align: 'center' },
  { name: 'tipo', label: 'TIPO', sortable: false, field: 'tipo', align: 'center', style: 'max-width: 80px; white-space: break-spaces;' },
  { name: 'acciones', label: 'ACCIONES', sortable: false, field: 'acciones', align: 'center' },
]
const dataFormato = ref([])

const dialogEliminarFormato = ref(false)
const formatoEliminar = ref(null)

const dialogUsarFormato = ref(false)
const formatoUsar = ref(null)

async function obtenerTodosFormatos() {
  loading.value = true
  await formatoController.obtenerTodosFormato((res) => {
    if (res.status == 401) { generateMessage('negative', res.message); return router.push({ path: '/login' }) }
    if (res.status == 403) { generateMessage('negative', res.message); return router.push({ path: '/' }) }
    if (res.status != 200) return generateMessage('negative', res.message)
    dataFormato.value = res.data.formatos.map(f => {
      if (f.estado) formatoActivo.value = f
      return f
    })
    loading.value = false
  })
}

function formularioFormato() {
  formFormato.value = { ...formatoActivo.value }
  formFormato.value.titulo = 'Crear Nuevo Formato'
  formFormato.value.draw = true
}

function editarFormatoForm(formato) {
  formFormato.value = { ...formato }
  formFormato.value.isEditar = true
  formFormato.value.titulo = 'Editar Formato'
  formFormato.value.draw = true
}

async function guardarFormFormato() {
  for (let key in formFormato.value) {
    if (formFormato.value.hasOwnProperty(key)) {
      if (formFormato.value[key] === '') {
        return generateMessage('warning', 'Debe llenar todos los campos')
      }
    }
  }
  const idformato = formFormato.value._id
  delete formFormato.value.created_at
  delete formFormato.value.updated_at
  delete formFormato.value._id
  if (formFormato.value.isEditar) {
    await formatoController.actualizar(idformato, formFormato.value, res => {
      if (res.status == 401) { generateMessage('negative', res.message); return router.push({ path: '/login' }) }
      if (res.status == 403) { generateMessage('negative', res.message); return router.push({ path: '/' }) }
      if (res.status != 200) return generateMessage('negative', res.message)
      generateMessage('positive', res.data.message)
      resetFormFormato()
      obtenerTodosFormatos()
    })
  } else {
    delete formFormato.value.estado
    delete formFormato.value.tipo
    await formatoController.crearFormato(formFormato.value, res => {
      if (res.status == 401) { generateMessage('negative', res.message); return router.push({ path: '/login' }) }
      if (res.status == 403) { generateMessage('negative', res.message); return router.push({ path: '/' }) }
      if (res.status != 200) return generateMessage('negative', res.message)
      generateMessage('positive', res.data.message)
      resetFormFormato()
      obtenerTodosFormatos()
    })
  }

  resetFormFormato()
}

async function eliminarFormato() {
  await formatoController.eliminar(formatoEliminar.value._id, res => {
    if (res.status == 401) { generateMessage('negative', res.message); return router.push({ path: '/login' }) }
    if (res.status == 403) { generateMessage('negative', res.message); return router.push({ path: '/' }) }
    if (res.status != 200) return generateMessage('negative', res.message)
    dialogEliminarFormato.value = false
    generateMessage('positive', res.data.message)
    obtenerTodosFormatos()
  })
}

async function usarFormato() {
  await formatoController.cambiarEstado(formatoUsar.value._id, res => {
    if (res.status == 401) { generateMessage('negative', res.message); return router.push({ path: '/login' }) }
    if (res.status == 403) { generateMessage('negative', res.message); return router.push({ path: '/' }) }
    if (res.status != 200) return generateMessage('negative', res.message)
    dialogUsarFormato.value = false
    generateMessage('positive', res.data.message)
    obtenerTodosFormatos()
  })
}

function resetFormFormato() {
  formFormato.value = {
    draw: false,
    titulo: ''
  }
}

function confirmacionEliminarFormato(formato) {
  formatoEliminar.value = formato
  dialogEliminarFormato.value = true
}

function verFormato(formatoVer) {
  downloadPdf.formatoPdf(formatoVer, null)
}

const generateMessage = (tipo, message) => {
  $q.notify({
    type: tipo,
    message: message
  })
}

obtenerTodosFormatos()

</script>

<style lang="scss"></style>
