<template>
    <div class="q-pa-md">
        <q-card class="my-card">
            <q-card-section class="card-title-gestionar">
                <div class="row justify-between">
                    <div class="col-9">
                        <div class="col q-table__title" inline><b>Administrar Docentes</b></div>
                    </div>
                    <div class="col-3" align="right">
                        <q-btn :disabled="loading" @click="formularioCrear()" size="sm" class="col-1 bton-lista-docente"
                            color="secondary" style="color:white">AGREGAR DOCENTE</q-btn>
                    </div>
                </div>
            </q-card-section>
            <q-card-section class="bg-blue-1">
                <q-table title="Lista de Docentes" :rows="rows" :columns="columns" row-key="name"
                    :rows-per-page-options="[5, 10, 0]" :loading="loading">
                    <template v-slot:top>
                        <div class="col q-table__title"><b>Lista de Docentes</b></div>

                    </template>

                    <template v-slot:header="props">
                        <q-tr :props="props">
                            <q-th v-for="col in props.cols" :key="col.name" :props="props">
                                {{ col.label }}
                            </q-th>
                            <q-th auto-width>Opciones</q-th>

                        </q-tr>
                    </template>

                    <template v-slot:body="props">
                        <q-tr :props="props"
                            :class="!props.row.estado ? 'bg-red-1 ' : '' || props.row.isActual ? 'bg-indigo-1' : ''">
                            <q-td v-for="col in props.cols" :key="col.name" :props="props">
                                <div style="display: inline;" v-if="col.name == 'estado'">
                                    <q-btn size="sm" :color="col.value ? 'positive' : 'negative'" dense
                                        :label="col.value ? 'ACTIVO' : 'INACTIVO'"
                                        @click="!props.row.isActual ? cuadroConfirmacionEstado(props.row) : ''" />
                                    <q-tooltip v-if="!props.row.isActual" :offset="[10, 10]" class="bg-indigo">
                                        Cambiar estado cuenta
                                    </q-tooltip>
                                </div>
                                <template v-else-if="col.name == 'rol'">
                                    <q-select v-if="!props.row.isActual" v-model="props.row.rol" dense
                                        :options="selectRoles" @update:model-value="confirmRol(props.row)">
                                    </q-select>
                                    <template v-else>
                                        {{ col.value }}
                                    </template>
                                </template>
                                <template v-else>{{ col.value }}</template>
                            </q-td>

                            <q-td align="center" auto-width>
                                <div style="display: inline;">
                                    <q-btn size="sm" color="warning" round dense @click="formularioEditar(props.row)"
                                        icon="mdi-account-edit" />
                                    <q-tooltip :offset="[10, 10]" class="bg-indigo">
                                        Editar docente
                                    </q-tooltip>
                                </div>
                            </q-td>
                        </q-tr>
                    </template>
                </q-table>
            </q-card-section>
        </q-card>
    </div>

    <div class="q-pa-md">

    </div>

    <q-dialog v-model="formulario">
        <q-card>
            <q-card-section class="header-crear-docente card-title-gestionar">
                <div class="text-h6">{{ titulo_form }}</div>
            </q-card-section>

            <q-separator class="q-separator-crear-docente" />

            <q-card-section style="max-height: 70vh" class="scroll body-crear-docente">
                <q-form @submit="onSubmit" @reset="cerrarFormulario" class="q-gutter-x-md">
                    <div class="row">
                        <q-input class="col label-mid" filled v-model="first_name" label="Primer nombre" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Completa este campo']" />

                        <q-input class="col label-mid" filled v-model="second_name" label="Segundo nombre" />
                    </div>

                    <div class="row">
                        <q-input class="col label-mid" filled v-model="first_surname" label="Primer apellido" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Completa este campo']" />

                        <q-input class="col label-mid" filled v-model="second_surname" label="Segundo apellido" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Completa este campo']" />
                    </div>
                    <q-input filled v-model="email" class="col label-mid" suffix="@unl.edu.ec" label="Correo institucional"
                        lazy-rules :disable="idEditdocente != null"
                        :rules="[val => val && val.length > 0 || 'Completa este campo',
                        val => /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(val + '@unl.edu.ec') || 'Formato de email no válido']" />

                    <div class="row">
                        <div class="col-6">
                            <q-input class="col label-mid" filled v-model="cedula" label="Numero de Cédula"
                                :disable="idEditdocente != null" lazy-rules
                                :rules="[val => val && val.length > 0 || 'Completa este campo', val => val.length == 10 && !isNaN(val) || 'Cédula no correcta']" />
                        </div>
                        <div class="col-6">
                            <q-input class="col label-mid" filled v-model="dedicacion" label="Dedicación" lazy-rules
                                :rules="[val => val && val.length > 0 || 'Completa este campo']" />
                        </div>
                    </div>
                    <q-separator class="q-separator-crear-docente" />
                    <q-card-actions align="right" class="header-crear-docente">
                        <q-btn type="reset" class="btn-cancelar-docente" flat label="Cancelar" color="white" />
                        <q-btn type="submit" class="btn-crear-docente" flat label="Guardar" color="white" />
                    </q-card-actions>
                </q-form>

            </q-card-section>
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

            <q-card-actions align="right">
                <q-btn flat label="Cancel" color="negative" v-close-popup @click="confirm_rol = false" />
                <q-btn flat label="Aceptar" color="primary" @click="cambiarRol()" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import carreraController from 'src/controller/carrera';
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
const cedula = ref(null)
const carrera = ref(null)
const dedicacion = ref(null)
const idEditdocente = ref(null)
const selectRoles = ['DOCENTE', 'DIRECTOR']

const confirm = ref(false)
const confirm_rol = ref(false)
const docenteestado = ref(null)
const docenterol = ref(null)

const Listdocentes = ref(null)
const columns = [
    { name: 'nombre', align: 'center', label: 'Nombre', field: 'nombre', style: 'max-width: 200px; white-space: break-spaces;' },
    { name: 'cedula', align: 'center', label: 'Cédula', field: 'cedula' },
    { name: 'correo', align: 'center', label: 'Email', field: 'correo' },
    { name: 'dedicacion', align: 'center', label: 'Dedicación', field: 'dedicacion', style: 'max-width: 200px; white-space: break-spaces;' },
    { name: 'rol', align: 'center', label: 'Rol', field: 'rol' },
    { name: 'estado', align: 'center', label: "Estado Cuenta", field: 'estado' },
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
                cedula: docente.cedula,
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
    cedula.value = docente.cedula
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
    await user.cambiarEstado(docenteestado.value.cedula, (res) => {
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
        data.cedula = cedula.value
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
    cedula.value = null
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
.bton-lista-docente {
    background-color: $primary;
}

.label-mid {
    padding: 0px 2px 30px 5px;
}

.btn-crear-docente {
    background-color: $positive;
    color: white;
}

.btn-cancelar-docente {
    background-color: $negative;
}

.card-title-gestionar {
    background-color: $primary;
    color: white;
}
</style>