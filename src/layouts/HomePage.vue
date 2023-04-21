<template>
    <Suspense>
        <q-layout view="hHh lpR fFf">

            <q-header elevated class="bg-primary text-white">
                <q-toolbar>
                    <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

                    <q-toolbar-title class="title-main">
                        <img class="nav-img" alt="Carrera logo" src="~assets/favicon-512x512.png" style="width: 40px">

                        <div class="div1 q-ml-md">
                            <b>Carrera de&nbsp;</b>
                        </div>
                        <div class="div2">
                            <b>Computación</b>
                        </div>
                    </q-toolbar-title>
                    <div align="right" class="perfil-main">
                        <div>{{ perfil.nombre }}</div>
                        <div><b style="font-style: italic;">{{ perfil.rol }}</b></div>
                    </div>

                    <div class="icon-user-menu">
                        <q-btn dense flat round icon="mdi-account">
                            <q-menu fit>
                                <q-list style="min-width: 100px; width: 200px;">
                                    <q-item clickable
                                        @click="showEditarDedicación = true; editDedicacion = perfil.dedicacion">
                                        <q-item-section class="col-2">
                                            <q-icon name="mdi-account-edit" />
                                        </q-item-section>
                                        <q-item-section class="col">
                                            <q-item-label>Cambiar dedicación</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                    <q-item clickable @click="showCambiarContrasennia = true">
                                        <q-item-section class="col-2">
                                            <q-icon name="mdi-key" />
                                        </q-item-section>
                                        <q-item-section class="col">
                                            <q-item-label>Cambiar contraseña</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                    <q-separator />
                                    <q-item clickable @click="logout()">
                                        <q-item-section class="col-2">
                                            <q-icon name="mdi-login-variant" />
                                        </q-item-section>
                                        <q-item-section class="col">
                                            <q-item-label>Cerrar sesion</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </q-list>
                            </q-menu>
                        </q-btn>
                    </div>

                </q-toolbar>

            </q-header>

            <q-drawer show-if-above v-model="leftDrawerOpen" side="left" elevated>
                <q-list>
                    <q-item-label header>
                        Lista de Opciones
                    </q-item-label>
                    <div v-for="link in essentialLinks" :key="link.name" clickable tag="a">
                        <q-item v-if="!link.requireDirector || link.requireDirector == isDirector" :to="link.to">
                            <q-item-section v-if="link.icon" avatar>
                                <q-icon :name="link.icon" />
                            </q-item-section>

                            <q-item-section v-if="!link.requireDirector || link.requireDirector == isDirector">
                                <q-item-label>{{ link.title }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </div>
                </q-list>
            </q-drawer>
            <q-page-container>
                <router-view />
            </q-page-container>
            <q-dialog v-model="showCambiarContrasennia" persistent>
                <q-card style="max-width: 500px; min-width: 300px;">
                    <q-card-section class="card-title">
                        <div class="text-h6">Cambiar contraseña</div>
                    </q-card-section>

                    <q-separator class="q-separator-crear-docente" />

                    <q-card-section style="max-height: 70vh" class="scroll body-crear-docente">
                        <q-form @submit="onSubmit()" @reset="cerrarFormulario()" class="q-gutter-x-md">

                            <q-input dense class="col label-mid q-mb-md" filled v-model="formPassword.password"
                                label="Contraseña Actual" lazy-rules
                                :rules="[val => val && val.length > 0 || 'Ingrese su actual contraseña']"
                                hint="Ingrese su actual contraseña" :type="isPassword ? 'password' : 'text'">
                                <template v-slot:append>
                                    <q-icon :name="isPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                        @click="isPassword = !isPassword" />
                                </template></q-input>

                            <q-input dense class="col label-mid q-mb-sm" filled v-model="formPassword.new_password"
                                label="Contraseña Nueva" lazy-rules
                                :rules="[val => val && val.length > 0 || 'Ingrese la nueva contraseña']"
                                hint="Ingrese la nueva contraseña" :type="isNewPassword ? 'password' : 'text'">
                                <template v-slot:append>
                                    <q-icon :name="isNewPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                        @click="isNewPassword = !isNewPassword" />
                                </template></q-input>


                            <q-separator class="q-separator-crear-docente" />
                            <q-card-actions align="right" class="q-mb-none q-pb-none">
                                <q-btn type="reset" label="Cancelar" color="negative" />
                                <q-btn type="submit" color="positive" label="Guardar" />
                            </q-card-actions>
                        </q-form>

                    </q-card-section>
                </q-card>
            </q-dialog>

            <q-dialog v-model="showEditarDedicación" persistent>
                <q-card style="max-width: 500px; min-width: 300px;">
                    <q-card-section class="card-title">
                        <div class="text-h6">Cambiar dedicación</div>
                    </q-card-section>

                    <q-separator class="q-separator-crear-docente" />

                    <q-card-section style="max-height: 70vh" class="scroll body-crear-docente">
                        <q-form @submit="cambiarDedicacion()" @reset="cerrarFormulario()" class="q-gutter-x-md">

                            <q-input dense class="col label-mid q-mb-md" filled v-model="editDedicacion"
                                label="Dedicación Actual" lazy-rules
                                :rules="[val => val && val.length > 0 || 'Ingrese su dedicación actual']"
                                hint="Ingrese su dedicación actual" type="text" />

                            <q-separator class="q-separator-crear-docente" />
                            <q-card-actions align="right" class="q-mb-none q-pb-none">
                                <q-btn type="reset" label="Cancelar" color="negative" />
                                <q-btn type="submit" color="positive" label="Guardar" />
                            </q-card-actions>
                        </q-form>

                    </q-card-section>
                </q-card>
            </q-dialog>

        </q-layout>

    </Suspense>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import docente from 'src/controller/docente';
import user from 'src/controller/user';
import docenteController from 'src/controller/docente';
import { Cookies, useQuasar } from 'quasar';

const linksList = [
    {
        title: 'Página de Inicio',
        icon: 'mdi-home',
        requireDirector: false,
        to: '/'
    },
    {
        title: 'Administrar docentes',
        icon: 'mdi-account-cog',
        requireDirector: true,
        to: '/docente'
    },
    {
        title: 'Administrar informe final',
        icon: 'mdi-file-cog',
        requireDirector: true,
        to: '/informe/administrar'
    },
    {
        title: 'Actividades del distributivo',
        icon: 'mdi-view-list',
        requireDirector: false,
        to: '/distributivo/ver'
    },
    {
        title: 'Gestionar informe final',
        icon: 'mdi-file-document-edit',
        requireDirector: false,
        to: '/informe/gestionar'
    },
    {
        title: 'Historial de informes',
        icon: 'mdi-clipboard-text-multiple',
        requireDirector: false,
        to: '/informe/historial'
    },
]
export default {
    setup() {
        const $q = useQuasar()
        const formPassword = ref({
            password: '',
            new_password: ''
        })
        const isPassword = ref(true)
        const isNewPassword = ref(true)
        const showEditarDedicación = ref(false)
        const showCambiarContrasennia = ref(false)
        const router = useRouter()
        const editDedicacion = ref('')
        const leftDrawerOpen = ref(false)
        let idDocente = null
        const isDirector = ref(false)
        const perfil = ref({})

        const obtenerPerfil = async () => {
            await docente.obtenerPerfilDocente((res) => {
                if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/login' }) }
                if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
                if (res.status != 200) return generateMessage('NOK', res.message)
                console.log(res.data)
                perfil.value = {
                    dedicacion: res.data.docente.dedicacion,
                    nombre: `${res.data.docente.primerNombre} ${res.data.docente.primerApellido}`,
                    rol: res.data.docente.usuario.rol.nombre.toUpperCase()
                }
                idDocente = res.data.docente._id
                isDirector.value = perfil.value.rol == 'DIRECTOR' ? true : false
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


        obtenerPerfil()

        return {
            essentialLinks: linksList,
            leftDrawerOpen,
            isDirector,
            perfil,
            isPassword,
            isNewPassword,
            formPassword,
            showCambiarContrasennia,
            editDedicacion,
            showEditarDedicación,
            toggleLeftDrawer() {
                leftDrawerOpen.value = !leftDrawerOpen.value
            },
            logout() {
                if (Cookies.get("auth-informefinal")) Cookies.remove('auth-informefinal')
                return router.push({ path: '/login' });
            },

            async cambiarDedicacion() {
                await docenteController.editarDedicacion(idDocente, editDedicacion.value, res => {
                    if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/login' }) }
                    if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
                    if (res.status != 200) return generateMessage('NO OK', res.message)
                    generateMessage('OK', res.data.message)
                    perfil.value.dedicacion = editDedicacion.value
                    showEditarDedicación.value = false
                })

            },

            async onSubmit() {
                await user.cambiarContrasennia(formPassword.value, (res => {
                    if (res.status == 401) { generateMessage('NO OK', res.message); return router.push({ path: '/login' }) }
                    if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
                    if (res.status != 200) return generateMessage('NO OK', res.message)
                    generateMessage('OK', res.data.message)
                    this.cerrarFormulario()
                }))

            },

            cerrarFormulario() {
                showCambiarContrasennia.value = false
                formPassword.value = {
                    password: '',
                    new_password: ''
                }
                showEditarDedicación.value = false
                editDedicacion.value = ''

            }
        }
    }
}
</script>

<style lang="scss">
body {
    background-color: rgba($color: $primary, $alpha: 0.1);
}

.title-main {
    display: flex;
}

.icon-user-menu {
    margin-right: -5px;
    margin-left: 10px;
}

.card-title {
    background-color: $primary;
    color: white;
}

@media screen and (max-width: 500px) {

    .nav-img {
        display: none;
    }

    .title-main {
        display: inline-block;
    }

    .title-main .div2 {
        margin-top: -10px;
    }

    .title-main .div1 {
        margin-bottom: -10px;
    }

    .perfil-main {
        font-size: 0.9rem;
    }
}
</style>