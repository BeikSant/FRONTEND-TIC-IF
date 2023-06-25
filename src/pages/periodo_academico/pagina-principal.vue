<template>
  <q-card class="q-ma-md" square flat bordered>
    <q-card-section class="bg-primary text-white">
      <div class="row justify-between items-center">
        <span class="text-h6 text-bold">Gestionar Periodos Académicos</span>
        <q-btn :disable="loading" size="sm" color="positive" style="color:white" @click="formularioPeriodo">Nuevo
          Periodo</q-btn>
      </div>
    </q-card-section>
    <q-card-section class="no-padding" animated>
      <q-table square :columns="headerPeriodo" :rows="dataPeriodo" row-key="name" separator="cell" class="shadow-0"
        :no-data-label="'No existen periodos académicos'" :pagination="{ rowsPerPage: 10 }"
        rows-per-page-label="Resultados por página" :rows-per-page-options="[5, 10, 0]" :loading="loading"
        loading-label="Cargando datos..." :dense="$q.screen.lt.md" :grid="$q.screen.xs"
        no-results-label="No hay ningún resultado" :filter="filter">

        <template v-slot:top>
          <div class="row justify-between items-center full-width">
            <span class="text-subtitle1 text-bold">LISTA DE PERIODOS</span>
            <q-input dense v-model="filter" placeholder="Buscar">
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

    <q-dialog v-model="formPeriodo.draw" persistent square>
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

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="negative" v-close-popup />
          <q-btn flat label="Aceptar" color="primary" @click=" eliminarPeriodo()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-card>
</template>

<script setup>
import { ref } from 'vue';
import periodoController from 'src/controller/periodo-controller';
import { useQuasar } from 'quasar';

const $q = useQuasar()

const formPeriodo = ref({
  draw: false,
  editar: false,
  titulo: '',
  nombre: '',
  fechaInicio: '',
  fechaFinal: '',
})


const filter = ref('')
const headerPeriodo = [
  { name: 'nombre', label: 'NOMBRE', sortable: true, field: 'nombre', align: 'left', style: 'max-width: 120px; white-space: break-spaces;' },
  { name: 'fechaInicio', label: 'FECHA INICO', sortable: true, field: 'fechaInicio', align: 'center' },
  { name: 'fechaFin', label: 'FECHA FINAL', sortable: true, field: 'fechaFin', align: 'center' },
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
    loading.value = false
  })

}

function formularioPeriodo() {
  formPeriodo.value.draw = true
  formPeriodo.value.titulo = 'Nuevo Periodo Académico'
  formPeriodo.value.editar = false
}

function formularioEditarPeriodo(periodo) {
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

async function guardarFormPeriodo() {
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
