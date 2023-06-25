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
          <span>Recuperar contraseña</span>
        </q-card-section>

        <q-card-section class="q-pb-none">
          <q-btn no-caps dense size="md" flat class="text-primary" icon="mdi-arrow-left" to="/login"> Inicio de
            sesión</q-btn>
        </q-card-section>

        <q-form @submit="onSubmit">
          <q-card-section>
            <q-input class="q-pt-none q-mt-xs" outlined square v-model="email" label="Correo institucional *" lazy-rules
              hint="Ingrese su correo institucional"
              :rules="[
                val => val && val.length > 0 || 'El campo se encuentra vacio',
                val => val && /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(val) || 'Formato email no válido']">
              <template v-slot:prepend>
                <q-icon name="mail" />
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

</script>

<style lang="scss"></style>
