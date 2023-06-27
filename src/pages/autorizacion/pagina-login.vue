<template>
  <q-layout view="hHh lpR fFf">

    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="text-center">
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
    <div class="full-width row justify-center items-center bg-grey-3" style="height: 100vh;">
      <q-card class="" style="min-width: 350px" square flat bordered>
        <q-card-section class="bg-primary text-white text-h6 text-center text-bold">
          <span>INICIO DE SESIÓN</span>
        </q-card-section>

        <q-form @submit="onSubmit" @reset="onReset">
          <q-card-section class="q-gutter-md">
            <q-input class="q-pt-md" outlined square v-model="email" label="Correo institucional *" lazy-rules
              :rules="[val => val && val.length > 0 || 'El campo se encuentra vacio',
              val => val && /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(val) || 'Formato email no válido']" hint="Ingrese su correo institucional">
              <template v-slot:prepend>
                <q-icon name="mail" />
              </template>
            </q-input>

            <q-input outlined square :type="isPassword ? 'password' : 'text'" v-model="password" label="Contraseña *"
              lazy-rules :rules="[val => val && val.length > 0 || 'El campo se encuentra vacio']"
              hint="Ingrese su contraseña">
              <template v-slot:append>
                <q-icon :name="isPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="isPassword = !isPassword" />
              </template>
              <template v-slot:prepend>
                <q-icon name="key" />
              </template>
            </q-input>
            <div class="text-right">
              <q-btn flat no-caps size="md" to="/recuperar/cuenta" class="text-primary q-pb-none" dense>¿Olvidaste tu
                contraseña?</q-btn>
            </div>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-actions>
            <q-btn label="Ingresar" type="submit" color="primary" />
            <q-btn label="Borrar" type="reset" color="primary" flat class="q-ml-sm" />
          </q-card-actions>
        </q-form>

      </q-card>
    </div>
    <q-footer>
      <q-toolbar>
        <q-toolbar-title>
          <div class="col-12 text-center">
            <div class="text-caption" style="max-width: 100%; white-space: break-spaces;"><b>
                UNIVERSIDAD NACIONAL DE LOJA - CARRERA DE COMPUTACIÓN</b>
            </div>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import userController from 'src/controller/user'
import Cookies from 'js-cookie'
import { useUserStore } from 'src/stores/user-store'

const userStore = useUserStore()
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
  if (res.status != 200) return $q.notify({
    color: 'red-5',
    textColor: 'white',
    icon: 'warning',
    message: res.message
  })

  await Cookies.set('auth-informefinal', res.data.token, { path: '/' })
  userStore.obtenerUsuario()
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

</script>

<style lang="scss"></style>
