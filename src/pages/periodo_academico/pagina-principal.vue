<template>
  <q-card class="q-ma-md" square flat bordered>
    <q-card-section class="bg-primary text-white">
      <div class="row justify-between items-center">
        <span class="text-h6 text-bold">Gestionar Periodos Académicos</span>
        <q-btn :disable="loading" size="sm" color="positive" style="color:white" @click="mostrarFormularioCrear">Nuevo
          Periodo</q-btn>
      </div>
    </q-card-section>
    <q-card-section class="no-padding" animated>
      <q-table square :columns="headerPeriodo" :rows="dataPeriodo" row-key="name" separator="cell" class="shadow-0"
        :no-data-label="'No existen periodos académicos'" :pagination="{ rowsPerPage: 10 }"
        rows-per-page-label="Resultados por página" :rows-per-page-options="[5, 10, 0]" :loading="loading"
        loading-label="Cargando datos..." :dense="$q.screen.lt.md" :grid="$q.screen.xs"
        no-results-label="No hay ningún resultado" :filter="filtroPeriodos">

        <template v-slot:top>
          <div class="row justify-between items-center full-width">
            <span class="text-subtitle1 text-bold">LISTA DE PERIODOS</span>
            <q-input dense v-model="filtroPeriodos" placeholder="Buscar">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </template>

        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <q-chip size="sm" square :color="props.row.estado ? 'green-5' : 'red-5'" text-color="white"
              :label="props.row.estado ? 'En curso' : 'Culminado'" />
          </q-td>
        </template>

        <template v-slot:body-cell-acciones="props">
          <q-td :props="props" class="col q-col-gutter-xs">
            <span v-if="props.row.estado">
              <q-btn size="sm" color="warning" round dense @click="formularioEditarPeriodo(props.row)"
                icon="mdi-file-document-edit" />
              <q-tooltip :offset="[10, 10]" class="bg-indigo">
                Editar
              </q-tooltip>
            </span>

            <span v-if="props.row.editable">
              <q-btn size="sm" color="negative" round dense @click="confirmacionEliminarPeriodo(props.row)"
                icon="mdi-delete" />
              <q-tooltip :offset="[10, 10]" class="bg-indigo">
                Eliminar
              </q-tooltip>
            </span>
            <span v-else>
              <q-btn round flat color="grey" size="xs" icon="mdi-help-circle-outline">
                <q-tooltip max-width="150px" style="text-align: center;">Este periodo contiene informes</q-tooltip>
              </q-btn>
            </span>
          </q-td>
        </template>

        <template v-slot:item="props">
          <div class="q-pa-xs grid-estilo">
            <q-card bordered flat>
              <q-list dense>
                <q-item v-for="col in props.cols" :key="col.name">
                  <q-item-section class="col-12 q-my-xs">
                    <q-item-label class="text-bold" caption>{{ col.label }}</q-item-label>

                    <q-item-label v-if="col.name == 'estado'">
                      <q-chip size="sm" square :color="props.row.estado ? 'green-5' : 'red-5'" text-color="white"
                        :label="props.row.estado ? 'En curso' : 'Culminado'" />
                    </q-item-label>

                    <q-item-label v-else-if="col.name == 'acciones'">
                      <span v-if="props.row.estado">
                        <q-btn size="sm" color="warning" round dense @click="formularioEditarPeriodo(props.row)"
                          icon="mdi-file-document-edit" />
                        <q-tooltip :offset="[10, 10]" class="bg-indigo">
                          Editar
                        </q-tooltip>
                      </span>

                      <span v-if="props.row.editable">
                        <q-btn size="sm" color="negative" round dense @click="confirmacionEliminarPeriodo(props.row)"
                          icon="mdi-delete" />
                        <q-tooltip :offset="[10, 10]" class="bg-indigo">
                          Eliminar
                        </q-tooltip>
                      </span>
                      <span v-else>
                        <q-btn round flat color="grey" size="xs" icon="mdi-help-circle-outline">
                          <q-tooltip max-width="150px" style="text-align: center;">Este periodo contiene
                            informes</q-tooltip>
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

    <q-dialog v-model="formPeriodo.mostrar" persistent square>
      <q-card style="max-width: 400px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6 text-bold">{{ formPeriodo.titulo }}</div>
        </q-card-section>
        <q-card-section>
          <q-banner class="bg-indigo-1 text-justify" v-if="!formPeriodo.editar">
            <template v-slot:avatar>
              <q-icon name="mdi-information" color="primary" />
            </template>
            <span class="text-caption">
              Recuerde que al crear un nuevo perido académico, este no podrá ser <b>ELIMINADO</b> y
              automáticamente
              se habilitaría un nuevo informe final para todos los docentes</span>
          </q-banner>
        </q-card-section>
        <q-form @submit="guardarFormPeriodo">
          <q-card-section class="q-gutter-y-lg q-pt-none q-pb-lg">
            <q-input square outlined v-model="formPeriodo.nombre" label="Nombre del periodo académico*" lazy-rules
              :rules="[val => val && val.length > 0 || 'Ingrese el nombre del periodo']"
              hint="Ingrese el nombre del periodo académico" />
            <div class="row q-col-gutter-x-md">
              <div class="col-6">
                <q-input square outlined v-model="formPeriodo.fechaInicio" type="date" hint="Ingrese la fecha de inicio"
                  lazy-rules :rules="[val => val && val.length > 0 || 'Ingrese una fecha inicial']" />
              </div>
              <div class="col-6">
                <q-input square outlined v-model="formPeriodo.fechaFinal" type="date"
                  hint="Ingrese la fecha de inicio (opcional)" lazy-rules
                  :rules="[val => isMayorFechaInicial() || 'Debe ser una fecha mayor o igual a la inicial']" />
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-actions class="justify-end">
            <q-btn label="Cancelar" @click="resetForm" flat color="negative" />
            <q-btn label="Guardar" type="submit" color="positive" />
          </q-card-actions>
        </q-form>

      </q-card>
    </q-dialog>


    <q-dialog v-model="dialogEliminarPeriodo" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="warning" text-color="white" />
          <span class="q-ml-sm">¿Está seguro que desea eliminar el Periodo Academico?</span>
        </q-card-section>

        <q-card-actions class="justify-end">
          <q-btn flat label="Cancel" color="negative" v-close-popup />
          <q-btn flat label="Aceptar" color="primary" @click=" eliminarPeriodo()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-card>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import periodoController from 'src/controller/periodo-controller';
import { useQuasar } from 'quasar';
import { pluginsQuasar } from 'src/composables/pluginsQuasar';

const plugins = pluginsQuasar()
const formPeriodo = ref({
  mostrar: false,
  editar: false,
  titulo: '',
  nombre: '',
  fechaInicio: '',
  fechaFinal: '',
})
const filtroPeriodos = ref('')
const headerPeriodo = [
  { name: 'nombre', label: 'NOMBRE', sortable: true, field: 'nombre', align: 'left', style: 'max-width: 120px; white-space: break-spaces;' },
  { name: 'fechaInicio', label: 'FECHA INICO', sortable: true, field: 'fechaInicioFormateada', align: 'center' },
  { name: 'fechaFin', label: 'FECHA FINAL', sortable: true, field: 'fechaFinFormateada', align: 'center' },
  { name: 'estado', label: 'ESTADO', sortable: false, field: 'estado', align: 'center' },
  { name: 'acciones', label: 'ACCIONES', sortable: false, field: 'acciones', align: 'center' }
]
const dataPeriodo = ref([])
const dialogEliminarPeriodo = ref(false)
const idEliminarPeriodo = ref(null)
const loading = ref(false)

async function obtenerTodosPeriodos() {
  loading.value = true
  await periodoController.obtenerTodosPeriodos((res) => {
    if (res.status != 200) {
      plugins.generateNotify(plugins.NOTIFY_TYPES.negative, res.message)
      if (res.status == 401) return router.push({ path: '/login' })
      if (res.status == 403) return router.push({ path: '/' })
      return
    }
    dataPeriodo.value = res.data.periodos.map(p => {
      p.fechaInicioFormateada = new Date(p.fechaInicio).toLocaleDateString()
      p.fechaFinFormateada = p.fechaFin
        ? new Date(p.fechaFin).toLocaleDateString()
        : 'NO DEFINIDO'
      return p
    })
    loading.value = false
  })
}

function mostrarFormularioCrear() {
  formPeriodo.value.mostrar = true
  formPeriodo.value.titulo = 'Nuevo Periodo Académico'
  formPeriodo.value.editar = false
}

function formularioEditarPeriodo(periodo) {
  formPeriodo.value.mostrar = true
  formPeriodo.value.editar = true
  formPeriodo.value.titulo = 'Editar Periodo Académico'
  formPeriodo.value.id = periodo._id
  formPeriodo.value.nombre = periodo.nombre

  const partesFechaInico = periodo.fechaInicioFormateada.split('/').reverse();
  formPeriodo.value.fechaInicio = partesFechaInico.map(d => {
    return d.length == 1 ? '0' + d : d
  }).join('-')

  if (periodo.fechaFin != null) {
    const partesFechaFin = periodo.fechaFinFormateada.split('/').reverse();
    formPeriodo.value.fechaFinal = partesFechaFin.map(d => {
      return d.length == 1 ? '0' + d : d
    }).join('-')
  } else {
    formPeriodo.value.fechaFinal = ''
  }

}

async function guardarFormPeriodo() {
  const dialogo = plugins.generateDialog('Guardando información...')
  const data = {
    nombre: formPeriodo.value.nombre,
    fechaInicio: new Date(formPeriodo.value.fechaInicio + ' 14:00:00'),
    fechaFin: formPeriodo.value.fechaFinal != ''
      ? new Date(formPeriodo.value.fechaFinal + ' 14:00:00')
      : ''
  }
  const res = formPeriodo.value.editar
    ? await periodoController.editar(formPeriodo.value.id, data)
    : await periodoController.crearPeriodo(data)

  if (res.status != 200) {
    dialogo.hide()
    plugins.generateNotify(plugins.NOTIFY_TYPES.negative, res.message)
    if (res.status == 401) return router.push({ path: '/login' })
    if (res.status == 403) return router.push({ path: '/' })
  } else {
    obtenerTodosPeriodos()
    resetForm()
    formPeriodo.value.mostrar = false
    plugins.generateNotify(plugins.NOTIFY_TYPES.positive, res.data.message)
    dialogo.hide()
  }
}

function isMayorFechaInicial() {
  if (formPeriodo.value.fechaFinal == '') return true
  if (formPeriodo.value.fechaInicio != '') {
    const fechaInicio = new Date(formPeriodo.value.fechaInicio)
    const fechaFinal = new Date(formPeriodo.value.fechaFinal)
    if (fechaInicio > fechaFinal) return false
  }
  return true
}

function resetForm() {
  formPeriodo.value = {
    mostrar: false,
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

async function eliminarPeriodo() {
  const dialogo = plugins.generateDialog('Eliminando periodo...')
  await periodoController.eliminarPeriodo(idEliminarPeriodo.value, (res) => {
    if (res.status != 200) {
      dialogo.hide()
      plugins.generateNotify(plugins.NOTIFY_TYPES.negative, res.message)
      if (res.status == 401) return router.push({ path: '/login' })
      if (res.status == 403) return router.push({ path: '/' })
    } else {
      obtenerTodosPeriodos()
      plugins.generateNotify(plugins.NOTIFY_TYPES.positive, res.data.message)
      return dialogo.hide()
    }
    idEliminarPeriodo.value = null
    dialogEliminarPeriodo.value = false
  })
}

onMounted(() => {
  obtenerTodosPeriodos()
})

</script>

<style lang="scss">
@media (max-width: 600px) {
  .grid-estilo {
    width: 50%;
  }
}

@media (max-width: 350px) {
  .grid-estilo {
    width: 100%;
  }
}
</style>
