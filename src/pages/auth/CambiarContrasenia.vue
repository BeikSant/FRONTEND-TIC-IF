<template>
    <q-layout view="hHh lpR fFf">

        <q-header class="bg-primary text-white">
            <q-toolbar>

                <q-toolbar-title align="center">
                    <div class="row">
                        <div class="col-12">
                            <div class="text-caption" style="max-width: 100%; white-space: break-spaces;"><b>SISTEMA DE
                                    GESTIÓN DEL
                                    INFORME FINAL DE CUMPLIMIENTO DEL TRABAJO
                                    ACADÉMICO</b>
                            </div>
                        </div>
                    </div>


                </q-toolbar-title>
            </q-toolbar>
        </q-header>
        <q-footer>
            <q-toolbar>
                <q-toolbar-title>
                    <div class="col-12" align="center">
                        <div class="text-caption" style="max-width: 100%; white-space: break-spaces;"><b>
                                UNIVERSIDAD NACIONAL DE LOJA - CARRERA DE COMPUTACIÓN</b>
                        </div>
                    </div>

                </q-toolbar-title>
            </q-toolbar>
        </q-footer>
    </q-layout>
    <div class="font flex flex-center fixed-center">
        <q-card class="" style="min-width: 350px">
            <div class="row no-padding no-margin header-login items-center" align="center">
                <div class="col-12">
                    <h6 class="q-ma-none q-pa-md"><b>CAMBIAR CONTRASEÑA</b></h6>
                </div>
            </div>
            <q-separator class="no-marggin no-padding"></q-separator>
            <div class="q-pa-md">
                <q-form @submit="cambiarContrasenia($route.params.token)" class="q-gutter-md">
                    <div class="q-mb-none q-pb-none">
                        Nueva Contraseña:
                    </div>
                    <q-input filled :type="isPassword ? 'password' : 'text'" v-model="password" label="Contraseña *"
                        lazy-rules :rules="[val => val && val.length > 0 || 'El campo se encuentra vacio']"
                        hint='Ingrese una nueva contraseña para recuperar su cuenta'>
                        <template v-slot:append>
                            <q-icon :name="isPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                @click="isPassword = !isPassword" />
                        </template>
                    </q-input>
                    <div>
                        <q-btn label="Enviar" type="submit" color="primary" />
                    </div>
                </q-form>
            </div>
        </q-card>
    </div>
</template>
  
<script setup>
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import user from 'src/controller/user';
const $q = useQuasar()

const password = ref(null)
const isPassword = ref(true)
const router = useRouter()

const cambiarContrasenia = async (token) => {
    console.log(token, password.value)
    await user.recuperarPassword(token, password.value, (res => {
        console.log(res.status)
        if (res.status != 200 && res.status != 201) {
            return $q.notify({
                color: 'red-5',
                textColor: 'white',
                icon: 'mdi-email-alert',
                message: res.message
            })
        } else {
            $q.notify({
                color: 'green-5',
                textColor: 'white',
                icon: 'mdi-email-check',
                message: res.data.message
            })
            return router.push({ path: '/' })
        }
    }))
}
</script>
  
<style lang="scss">
p {
    font-size: 0.7rem;
    margin-bottom: 20px;
    text-align: right;
}

.logo-login {
    width: 100%;
}

.header-login {
    background-color: $primary;
    color: white;
}

.logo-login img {
    width: 100px;
    display: block;
    min-width: 100px
}

.font {
    background-color: rgba($color: $primary, $alpha: 0.1);
    height: 100%;
    width: 100%;
}
</style>