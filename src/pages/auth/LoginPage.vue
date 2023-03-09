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
                    <h6 class="q-ma-none q-pa-md"><b>INICIO DE SESIÓN</b></h6>
                </div>
            </div>
            <q-separator class="no-marggin no-padding"></q-separator>
            <div class="q-pa-md">
                <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
                    <q-input class="q-pt-md" filled v-model="email" label="Email *" lazy-rules
                        :rules="[
                            val => val && val.length > 0 || 'El campo se encuentra vacio',
                            val => val && /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(val) || 'Formato email no válido']" />

                    <q-input filled :type="isPassword ? 'password' : 'text'" v-model="password" label="Contraseña *"
                        lazy-rules :rules="[val => val && val.length > 0 || 'El campo se encuentra vacio']">
                        <template v-slot:append>
                            <q-icon :name="isPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                @click="isPassword = !isPassword" />
                        </template>
                    </q-input>
                    <div class="q-pt-none q-mt-none" align="right">
                        <a class="text-caption recuperar-enlace" clickable @click="recuperarCuenta()">¿Olvidaste tu
                            contraseña?</a>
                    </div>
                    <div>
                        <q-btn label="Ingresar" type="submit" color="primary" />
                        <q-btn label="Borrar" type="reset" color="primary" flat class="q-ml-sm" />
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
import userController from 'src/controller/user'
import Cookies from 'js-cookie'
const $q = useQuasar()
const isPassword = ref(true)
const email = ref(null)
const password = ref(null)
const router = useRouter()
const onSubmit = async () => {
    const data = {
        username: email.value,
        password: password.value
    }
    const res = await userController.login(data)
    console.log(res)
    if (res.status != 200) return $q.notify({

        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: res.message
    })

    Cookies.set('auth-informefinal', res.data.token)
    $q.notify({
        color: 'green-5',
        textColor: 'white',
        icon: 'mdi-account-check',
        message: 'Acceso correcto'
    })
    return router.push({ path: '/' });
};
const onReset = () => {
    email.value = null
    password.value = null
}

const recuperarCuenta = () => {
    return router.push({ path: '/recuperar/cuenta' })
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

.recuperar-enlace {
    text-decoration: none;
    color: $primary;
}

.recuperar-enlace:hover {
    text-decoration: underline;
    background-color: rgba(0, 0, 0, 0.1);
}

.recuperar-enlace:visited {
    color: $primary;
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