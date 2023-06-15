<template>
  <q-card class="q-ma-md" square flat bordered>
    <q-card-section class="bg-primary text-white row justify-between items-center">
      <span class="text-h6 text-bold">Administrar Docentes</span>
      <q-btn :disabled="loading" @click="formularioCrear()" size="sm" color="positive" style="color:white">AGREGAR
        DOCENTE</q-btn>
    </q-card-section>
    <q-card-section class="no-padding">
      <q-table square :rows="rows" :columns="columns" row-key="name" class="shadow-0" :rows-per-page-options="[5, 10, 0]"
        bordered :loading="loading" separator="cell" loading-label="Cargando datos..."
        rows-per-page-label="Resultados por página" :dense="$q.screen.lt.md" :grid="$q.screen.xs"
        no-results-label="No hay ningún resultado" :filter="filter">

        <template v-slot:top>
          <div class="row justify-between items-center full-width">
            <span class="text-h6 text-bold">LISTA DE DOCENTES</span>
            <q-input dense v-model="filter" placeholder="Buscar">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </template>

        <template v-slot:body-cell-acciones="props">
          <q-td :props="props">
            <span>
              <q-btn size="sm" color="warning" round dense @click="formularioEditar(props.row)" icon="mdi-account-edit" />
              <q-tooltip :offset="[10, 10]" class="bg-indigo">
                Editar
              </q-tooltip>
            </span>
          </q-td>
        </template>

        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <span v-if="props.row.isActual">
              <q-badge color="blue">
                ACTUAL
              </q-badge>
            </span>
            <span v-else>
              <q-btn size="sm" :color="props.row.estado ? 'positive' : 'negative'" dense
                :label="props.row.estado ? 'ACTIVA' : 'INACTIVA'" @click="cuadroConfirmacionEstado(props.row)" />
              <q-tooltip :offset="[10, 10]" class="bg-indigo">
                Cambiar estado
              </q-tooltip>
            </span>
          </q-td>
        </template>

        <template v-slot:body-cell-rol="props">
          <q-td :props="props">
            <q-select v-if="!props.row.isActual" v-model="props.row.rol" dense :options="selectRoles"
              @update:model-value="confirmRol(props.row)">
            </q-select>
            <template v-else>
              {{ props.row.rol }}
            </template>
          </q-td>
        </template>

        <template v-slot:item="props">
          <div class="q-pa-xs grid-estilo">
            <q-card bordered flat>
              <q-list dense>
                <q-item v-for="col in props.cols" :key="col.name">
                  <q-item-section class="col-12 q-mb-xs q-mt-xs">
                    <q-item-label class="text-bold" caption>{{ col.label }}</q-item-label>

                    <q-item-label v-if="col.name == 'estado'">
                      <span v-if="props.row.isActual">
                        <q-badge color="blue">
                          ACTUAL
                        </q-badge>
                      </span>
                      <span v-else>
                        <q-btn size="sm" :color="props.row.estado ? 'positive' : 'negative'" dense
                          :label="props.row.estado ? 'ACTIVA' : 'INACTIVA'"
                          @click="cuadroConfirmacionEstado(props.row)" />
                        <q-tooltip :offset="[10, 10]" class="bg-indigo">
                          Cambiar estado
                        </q-tooltip>
                      </span>
                    </q-item-label>

                    <q-item-label v-else-if="col.name == 'acciones'">
                      <span>
                        <q-btn size="sm" color="warning" round dense @click="formularioEditar(props.row)"
                          icon="mdi-account-edit" />
                        <q-tooltip :offset="[10, 10]" class="bg-indigo">
                          Editar
                        </q-tooltip>
                      </span>
                    </q-item-label>


                    <q-item-label v-else-if="col.name == 'rol'">
                      <q-select v-if="!props.row.isActual" v-model="props.row.rol" dense :options="selectRoles"
                        @update:model-value="confirmRol(props.row)">
                      </q-select>
                      <template v-else>
                        {{ props.row.rol }}
                      </template>
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
  </q-card>

  <q-dialog v-model="formulario" square>
    <q-card>
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">{{ titulo_form }}</div>
      </q-card-section>

      <q-form @submit="onSubmit" @reset="cerrarFormulario">
        <q-card-section class="scroll q-pa-lg">
          <div class="row q-col-gutter-x-md q-col-gutter-y-lg q-col-gutter-sm-y-sm">
            <q-input class="col-6 col-sm-6" square outlined v-model="first_name" label="Primer nombre*" lazy-rules
              :rules="[val => val && val.length > 0 || 'Completa este campo']" hint="Ingresa el primer nombre" />

            <q-input class="col-6 col-sm-6" square outlined v-model="second_name" label="Segundo nombre"
              hint="Ingresa el segundo nombre (opcional)" />

            <q-input class="col-6 col-sm-6" outlined square v-model="first_surname" label="Primer apellido*" lazy-rules
              :rules="[val => val && val.length > 0 || 'Completa este campo']" hint="Ingresa el primer apellido" />

            <q-input class="col-6 col-sm-6" outlined square v-model="second_surname" label="Segundo apellido*" lazy-rules
              :rules="[val => val && val.length > 0 || 'Completa este campo']" hint="Ingresa el segundo apellido" />

            <q-input class="col-12" outlined square v-model="email" suffix="@unl.edu.ec" label="Correo institucional*"
              lazy-rules :disable="idEditdocente != null"
              :rules="[val => val && val.length > 0 || 'Completa este campo',
              val => /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(val + '@unl.edu.ec') || 'Formato de email no válido']"
              hint="Ingresa el correo institucional" />

            <q-input class="col-12" outlined square v-model="dedicacion" label="Dedicación*" lazy-rules
              :rules="[val => val && val.length > 0 || 'Completa este campo']" hint="Ingresa la dedicación" />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions class="justify-end q-py-sm">
          <q-btn type="reset" flat label="Cancelar" square color="negative" />
          <q-btn type="submit" flat label="Guardar" square class="bg-positive text-white" />
        </q-card-actions>
      </q-form>


    </q-card>
  </q-dialog>

  <q-dialog v-model="confirm" persistent>
    <q-card style="max-width: 400px;">
      <q-card-section class="row items-center">
        <div class="row">
          <div class="col-2">
            <q-avatar icon="warning" color="warning" text-color="white" />
          </div>
          <div class="col-10 q-pt-xs">
            <span>Está a púnto de cambiar el estado de cuenta del docente: <b>{{
              docenteestado.nombre }}</b>
            </span>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="negative" v-close-popup />
        <q-btn flat label="Aceptar" color="primary" @click="cambiarEstado()" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="confirm_rol" persistent>
    <q-card style="max-width: 400px;">
      <q-card-section class="row items-center">
        <div class="row">
          <div class="col-2">
            <q-avatar icon="warning" color="warning" text-color="white" />
          </div>
          <div class="col-10 q-pt-xs">
            <span>¿Está seguro de cambiar el rol del docente: <b>{{
              docenterol.nombre }}</b> de <b>{{ docenterol.rol }}</b> a <b>{{ docenterol.rolnuevo }}</b>
            </span>
          </div>
        </div>
      </q-card-section>
      <q-card-actions class="justify-end">
        <q-btn flat label="Cancel" color="negative" v-close-popup @click="confirm_rol = false" />
        <q-btn flat label="Aceptar" color="primary" @click="cambiarRol()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import docente from 'src/controller/docente';
import user from 'src/controller/user';

const $q = useQuasar()

const titulo_form = ref(null)
const first_name = ref(null)
const second_name = ref(null)
const loading = ref(true)
const first_surname = ref(null)
const second_surname = ref(null)
const email = ref(null)
const carrera = ref(null)
const dedicacion = ref(null)
const idEditdocente = ref(null)
const selectRoles = ['DOCENTE', 'DIRECTOR']
const filter = ref('')

const confirm = ref(false)
const confirm_rol = ref(false)
const docenteestado = ref(null)
const docenterol = ref(null)

const Listdocentes = ref(null)
const columns = [
  { name: 'nombre', sortable: true, align: 'center', label: 'NOMBRES', field: 'nombre', style: 'white-space: break-spaces;' },
  { name: 'correo', align: 'center', label: 'CORREO', field: 'correo' },
  { name: 'dedicacion', align: 'center', label: 'DEDICACIÓN', field: 'dedicacion', style: 'white-space: break-spaces;' },
  { name: 'rol', sortable: true, align: 'center', label: 'ROL', field: 'rol' },
  { name: 'estado', sortable: true, align: 'center', label: "CUENTA", field: 'estado' },
  { name: 'acciones', sortable: false, align: 'center', label: "ACCIONES", field: 'acciones' },
]
const rows = ref([])
const formulario = ref(false)
const router = useRouter()

const obtenerDocentes = async () => {
  loading.value = true
  await docente.obtenerDocentes((res) => {
    if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/login' }) }
    if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
    if (res.status != 200) return generateMessage('NO OK', res.message)
    let docentes = []
    Listdocentes.value = res.data
    for (let i = 0; i < Listdocentes.value.length; i++) {
      const docente = Listdocentes.value[i]
      const nombre = `${docente.primerNombre} ${docente.segundoNombre} ${docente.primerApellido} ${docente.segundoApellido}`
      docentes.push({
        id: docente._id,
        nombre: nombre,
        primerNombre: docente.primerNombre,
        segundoNombre: docente.segundoNombre,
        primerApellido: docente.primerApellido,
        segundoApellido: docente.segundoApellido,
        estado: docente.usuario.estado,
        isActual: docente.isActual ? true : false,
        rol: docente.usuario.rol.nombre.toUpperCase(),
        correo: docente.correo,
        dedicacion: docente.dedicacion
      })
    }
    rows.value = docentes
  })
  loading.value = false
}

const crearDocente = async (data) => {
  await docente.crearDocente(data, (res) => {
    if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/login' }) }
    if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
    if (res.status != 200) return generateMessage('NO OK', res.message)
    generateMessage('OK', res.data.message)
    cerrarFormulario()
    obtenerDocentes()
  })
}

const editarDocente = async (id, data) => {
  await docente.editarDocente(id, data, (res) => {
    if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/login' }) }
    if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
    if (res.status != 200) return generateMessage('NO OK', res.message)
    generateMessage('OK', res.data.message)
    cerrarFormulario()
    obtenerDocentes()
  })
}

const formularioCrear = async () => {
  await onReset()
  titulo_form.value = "Agregar Nuevo Docente"
  formulario.value = true
}

const formularioEditar = async (docente) => {
  await onReset()
  idEditdocente.value = docente.id
  titulo_form.value = 'Editar Información del Docente'
  first_name.value = docente.primerNombre
  second_name.value = docente.segundoNombre
  first_surname.value = docente.primerApellido
  second_surname.value = docente.segundoApellido
  email.value = docente.correo.split('@')[0]
  dedicacion.value = docente.dedicacion
  formulario.value = true
}

const cerrarFormulario = () => {
  formulario.value = false
  onReset()
}

const cuadroConfirmacionEstado = async (docente) => {
  confirm.value = true
  docenteestado.value = docente

}

const cambiarEstado = async () => {
  await user.cambiarEstado(docenteestado.value.id, (res) => {
    if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/login' }) }
    if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
    if (res.status != 200) return generateMessage('NO OK', res.message)
    generateMessage('OK', 'El estado de la cuenta del docente ha sido cambiado')
    confirm.value = false
    obtenerDocentes()
  })
}

const onSubmit = async () => {
  let data = {
    primerNombre: first_name.value,
    segundoNombre: second_name.value,
    primerApellido: first_surname.value,
    segundoApellido: second_surname.value,
    dedicacion: dedicacion.value,
  }
  if (idEditdocente.value == null) {
    data.correo = email.value + '@unl.edu.ec'
    return crearDocente(data)
  }
  return editarDocente(idEditdocente.value, data)
}

const onReset = () => {
  titulo_form.value = null
  first_name.value = null
  second_name.value = null
  first_surname.value = null
  second_surname.value = null
  email.value = null
  carrera.value = null
  dedicacion.value = null
  idEditdocente.value = null
}

const confirmRol = async (docente) => {
  docenterol.value = docente
  docenterol.value.rolnuevo = docenterol.value.rol
  docenterol.value.rol = selectRoles.filter(value => value != docenterol.value.rolnuevo)[0]
  confirm_rol.value = true
}

const cambiarRol = async () => {
  await user.cambiarRol(docenterol.value.id, docenterol.value.rolnuevo.toLowerCase(), res => {
    if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/login' }) }
    if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
    if (res.status != 200) return generateMessage('NO OK', res.message)
    generateMessage('OK', 'El rol del docente ha sido cambiado')
    confirm_rol.value = false
    docenterol.value = null
    obtenerDocentes()
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

obtenerDocentes()

</script>

<style lang="scss">
@media (max-width: 600px) {
  .grid-estilo {
    width: 50%;
  }
}

@media (max-width: 470px) {
  .grid-estilo {
    width: 100%;
  }
}
</style>
