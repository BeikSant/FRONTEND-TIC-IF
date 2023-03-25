<template>
  <div class="flex flex-center contorno">
    <div class="contorno-dentro">
      <div class=" info-app">
        <h6><b style="font-style: italic;">BIENVENIDO</b> al Sistema de Gestión del Informe
          Final de Cumplimiento
          Académico de Docentes</h6>
      </div>
      <div class="logo-app">
        <img alt="Carrera logo" src="~assets/favicon-512x512.png" style="width: 200px; height: 200px">
      </div>
    </div>

  </div>
</template>

<script setup>

console.log("Hola Mundo")

</script>

<style>
.info-app {
  width: 100%;
  margin-top: -50px;
  margin-bottom: -3em;
}

.info-app h6 {
  color: rgba(0, 0, 0, 0.75);
}

.contorno {
  margin-top: 11em;
}

.contorno-dentro {
  width: 60%;
  border-top: 1px solid rgba(0, 0, 0, 0.8);
  border-bottom: 1px solid rgba(0, 0, 0, 0.8);
  text-align: center;
}
</style>
