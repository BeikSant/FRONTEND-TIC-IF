<template>
  <q-layout view="hHh lpR fFf">

    <q-header class="bg-primary text-white">
      <q-toolbar>

        <q-toolbar-title>
          <div class="row text-center">
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


    <div class="full-width row items-center justify-center bg-grey-3" style="height:100vh">
      <q-card style="min-width: 350px" flat square bordered>
        <q-card-section class="bg-primary text-white text-bold text-h6">
          <span>Cambiar contraseña</span>
        </q-card-section>

        <q-card-section class="q-pb-none">
          <q-btn no-caps dense size="md" flat class="text-primary" icon="mdi-arrow-left" to="/login"> Inicio de
            sesión</q-btn>
        </q-card-section>

        <q-form @submit="cambiarContrasenia($route.params.token)">
          <q-card-section>
            <q-input filled :type="isPassword ? 'password' : 'text'" v-model="password" label="Nueva contraseña *"
              lazy-rules :rules="[val => val && val.length > 0 || 'El campo se encuentra vacio']"
              hint='Ingrese su  nueva contraseña'>
              <template v-slot:append>
                <q-icon :name="isPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="isPassword = !isPassword" />
              </template>
            </q-input>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-actions class="justify-end">
            <q-btn label="Enviar" type="submit" color="primary" />
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
import user from 'src/controller/user';
const $q = useQuasar()

const password = ref(null)
const isPassword = ref(true)
const router = useRouter()

const cambiarContrasenia = async (token) => {
  await user.recuperarPassword(token, password.value, (res => {
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
