<template>
    <div class="q-pa-md">
        <q-table title="Lista de Docentes" :rows="rows" :columns="columns" row-key="name"
            :rows-per-page-options="[5, 10, 0]">
            <template v-slot:top>
                <div class="col q-table__title"><b>Lista de Docentes</b></div>
                <q-btn @click="formularioCrear()" class="col-1 bton-lista-docente" color="secondary" style="color:white"
                    icon="mdi-account-plus" />
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
                <q-tr :props="props">
                    <q-td v-for="col in props.cols" :key="col.name" :props="props">
                        <q-btn v-if="col.name == 'estado'" size="sm" :color="col.value ? 'positive' : 'negative'" round
                            dense :icon="col.value ? 'mdi-check-bold' : 'mdi-close-thick'"
                            @click="cuadroConfirmacionEstado(props.row)" />
                        <a v-else>{{ col.value }}</a>
                    </q-td>

                    <q-td align="center" auto-width>
                        <q-btn size="sm" color="warning" round dense @click="formularioEditar(props.cols[1].value)"
                            icon="mdi-account-edit" />
                    </q-td>
                </q-tr>
            </template>
        </q-table>
    </div>

    <q-dialog v-model="formulario">
        <q-card>
            <q-card-section class="header-crear-docente">
                <div class="text-h6">{{ titulo_form }}</div>
            </q-card-section>

            <q-separator class="q-separator-crear-docente" />

            <q-card-section style="max-height: 70vh" class="scroll body-crear-docente">
                <q-form @submit="onSubmit" @reset="cerrarFormulario" class="q-gutter-x-md">
                    <div class="row">
                        <q-input class="col label-mid" filled v-model="first_name" label="Primer nombre" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Completa este campo']" />

                        <q-input class="col label-mid" filled v-model="second_name" label="Segundo nombre" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Completa este campo']" />
                    </div>

                    <div class="row">
                        <q-input class="col label-mid" filled v-model="first_surname" label="Primer apellido" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Completa este campo']" />

                        <q-input class="col label-mid" filled v-model="second_surname" label="Segundo apellido" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Completa este campo']" />
                    </div>
                    <q-input filled v-model="email" class="col label-mid" suffix="@unl.edu.ec" label="Correo institucional"
                        lazy-rules
                        :rules="[val => val && val.length > 0 || 'Completa este campo',
                        val => /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(val + '@unl.edu.ec') || 'Formato de email no válido']" />

                    <div class="row">
                        <q-input class="col label-mid" filled v-model="cedula" label="Numero de Cédula" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Completa este campo', val => val.length == 10 && !isNaN(val) || 'Cédula no correcta']" />

                        <q-select class="col label-mid" filled v-model="carrera" :options="options" label="Carrera"
                            :rules="[val => val && val.length > 0 || 'Selecciona una carrera']" />

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
const first_surname = ref(null)
const second_surname = ref(null)
const email = ref(null)
const cedula = ref(null)
const carrera = ref(null)
const options = ref([])
const idEditdocente = ref(null)

const confirm = ref(false)
const docenteestado = ref(null)

const Listdocentes = ref(null)
const columns = [
    { name: 'nombre', align: 'center', label: 'Nombre', field: 'nombre' },
    { name: 'cedula', align: 'center', label: 'Cédula', field: 'cedula' },
    { name: 'correo', align: 'center', label: 'Email', field: 'correo' },
    { name: 'dedicacion', align: 'center', label: 'Dedicación', field: 'dedicacion' },
    { name: 'estado', align: 'center', label: "Estado", field: 'estado' },
]
const rows = ref([])
const formulario = ref(false)
const router = useRouter()

const obtenerDocentes = async () => {
    await docente.obtenerDocentes((res) => {
        if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) };
        if (res.status != 200) return generateMessage('NO OK', res.message)
        let docentes = []
        Listdocentes.value = res.data
        for (let i = 0; i < Listdocentes.value.length; i++) {
            const docente = Listdocentes.value[i].docente
            const nombre = `${docente.primerNombre} ${docente.segundoNombre} ${docente.primerApellido} ${docente.segundoApellido}`
            docentes.push({
                nombre: nombre,
                estado: Listdocentes.value[i].estado,
                cedula: docente.cedula,
                correo: docente.correo,
                dedicacion: docente.dedicacion
            })
        }
        rows.value = docentes
    })
}

const crearDocente = async (data) => {
    await docente.crearDocente(data, (res) => {
        if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) };
        if (res.status != 200) return generateMessage('NO OK', res.message)
        generateMessage('OK', res.data.message)
        cerrarFormulario()
        obtenerDocentes()
    })
}

const editarDocente = async (id, data) => {
    await docente.editarDocente(id, data, (res) => {
        if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) };
        if (res.status != 200) return generateMessage('NO OK', res.message)
        generateMessage('OK', res.data.message)
        cerrarFormulario()
        obtenerDocentes()
    })
}

const obtenerCarreras = async () => {
    await carreraController.obtenerCarreras((res) => {
        if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) };
        if (res.status != 200) return generateMessage('NO OK', res.message)
        options.value = []
        res.data.carreras.forEach(carrera => {
            options.value.push(carrera.nombre)
        });
    })
}

const formularioCrear = async () => {
    await onReset()
    obtenerCarreras()
    titulo_form.value = "Crear Nuevo Docente"
    formulario.value = true
}

const formularioEditar = async (docente) => {
    await onReset()
    for (let i = 0; i < Listdocentes.value.length; i++) {
        const datosDocente = Listdocentes.value[i].docente
        if (datosDocente.cedula == docente) {
            idEditdocente.value = datosDocente._id
            titulo_form.value = 'Editar Información del Docente'
            first_name.value = datosDocente.primerNombre
            second_name.value = datosDocente.segundoNombre
            first_surname.value = datosDocente.primerApellido
            second_surname.value = datosDocente.segundoApellido
            email.value = datosDocente.correo.split('@')[0]
            cedula.value = datosDocente.cedula
            carrera.value = datosDocente.carrera.nombre
            formulario.value = true
            obtenerCarreras()
            i = Listdocentes.value.length + 1
        }
    }
}

const cerrarFormulario = () => {
    formulario.value = false
    onReset()
}

const cuadroConfirmacionEstado = async (docente) => {
    console.log(docente)
    confirm.value = true
    docenteestado.value = docente
}

const cambiarEstado = async () => {
    await user.cambiarEstado(docenteestado.value.cedula, (res) => {
        if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
        if (res.status != 200) return generateMessage('NO OK', res.message)
        generateMessage('OK', 'El estado de la cuenta del docente ha sido cambiado')
        confirm.value = false
        obtenerDocentes()
    })
}

const onSubmit = async () => {
    const data = {
        primerNombre: first_name.value,
        segundoNombre: second_name.value,
        primerApellido: first_surname.value,
        segundoApellido: second_surname.value,
        cedula: cedula.value,
        correo: email.value + '@unl.edu.ec',
        dedicacion: "Tiempo completo",
        carrera: "639fa39c916766a2c821055b",
        rol: "docente"
    }
    if (idEditdocente.value == null) return crearDocente(data)
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
    idEditdocente.value = null
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
</style>