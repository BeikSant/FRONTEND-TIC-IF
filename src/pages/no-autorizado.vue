<template>
  <div class="fullscreen bg-primary text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        Not Found
      </div>

      <div class="text-h2" style="opacity:.4">
        Oops. Nada que mostrar...
      </div>

      <q-btn class="q-mt-xl" color="white" text-color="blue" unelevated to="/" label="Ir al Inicio" no-caps />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ErrorNotFound'
})
</script>
