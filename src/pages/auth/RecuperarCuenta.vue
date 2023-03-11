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
                    <h6 class="q-ma-none q-pa-md"><b>RECUPERAR CONTRASEÑA</b></h6>
                </div>
            </div>

            <q-separator class="no-marggin no-padding"></q-separator>
            <div class="q-pt-none q-mt-md q-ml-md" align="left">
                <a class="text-caption recuperar-enlace" clickable @click="irLogin()">Ir al inicio de
                    sesión</a>
            </div>
            <div class="q-pa-md">
                <q-form @submit="onSubmit" class="q-gutter-md">
                    <div class="q-mb-none q-pb-none">
                        Email institucional:
                    </div>
                    <q-input class="q-pt-none q-mt-xs" filled v-model="email" label="Email *" lazy-rules
                        hint="Ingrese el email institucional para recuperar su cuenta"
                        :rules="[
                            val => val && val.length > 0 || 'El campo se encuentra vacio',
                            val => val && /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(val) || 'Formato email no válido']">
                        <template v-slot:prepend>
                            <q-icon name="mail" />
                        </template></q-input>
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

const email = ref(null)
const router = useRouter()

const onSubmit = async () => {
    await user.generarTokenRecuperacion(email.value, (res => {
        if (res.status != 200 && res.status != 201) {
            return $q.notify({
                color: 'red-5',
                textColor: 'white',
                icon: 'mdi-email-alert',
                message: res.message
            })
        } else if (res.status == 201) {
            $q.notify({
                color: 'green-5',
                textColor: 'white',
                icon: 'mdi-email-check',
                message: 'Se envió un email de recuperación a su correo'
            })
            return router.push({ path: '/' })
        } else if (res.status == 200) {
            $q.notify({
                color: 'orange-5',
                textColor: 'white',
                icon: 'mdi-email-search',
                message: 'Ya se ha enviado un email de recuperación a su correo'
            })
        }
    }))
}

function irLogin() {
    return router.push({ path: "/login" })
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