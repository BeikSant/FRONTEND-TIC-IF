<template>
  <div class="flex items-center justify-center" style="height: 90vh;">
    <q-card style="width: 70%; background-color: none" class="q-ma-sm card-index" square flat bordered>
      <q-card-section class="bg-primary">
        <div class="row items-center justify-between">
          <div class="col-6 col-xs-6 col-sm-3 col-lg-3 text-left">
            <img alt="Logo de la carrera de Computación" src="~assets/logo_unl.png" style="width: 170px">
          </div>
          <div class="title-middle col-sm-6 col-lg-6 text-subtitle1 text-center">
            <b>¡<i>BIENVENIDO</i>
              al Sistema
              de Gestión del Informe Final de Cumplimiento de Trabajo
              Académico de Docentes de la carrera de Computación!</b>
          </div>
          <div class="col-6 col-xs-6 col-sm-2 col-lg-3 text-right">
            <img alt="Logo UNL" src="~assets/carrera-logo.jpg" style="width: 70px">
          </div>
        </div>
        <div class="title-end col-12 text-subtitle1 text-center q-mt-sm">
          <b>¡<i>BIENVENIDO</i>
            al Sistema
            de Gestión del Informe Final de Cumplimiento de Trabajo
            Académico de Docentes de la carrera de Computación!</b>
        </div>
      </q-card-section>

      <q-card-section class="q-pa-lg">
        <div class="row items-center justify-around">
          <div class="col-12 text-justify">
            <p>Estamos encantados de recibirte en nuestra plataforma diseñada para facilitar la gestión de los informes
              finales de cumplimiento de trabajo académico de los docentes de la carrera de Computación de la UNL. Este
              sistema ha sido desarrollado como parte
              de un Trabajo de Integración
              Curricular, con el objetivo de
              brindar
              una solución eficiente y efectiva para la gestión y seguimiento de los informes académicos.</p>
            <p>Aquí encontrarás todas las herramientas necesarias para llevar a cabo un seguimiento eficiente y preciso de
              los informes, desde la administración de periodos académicos hasta la revisión y evaluación de los informes
              enviados por los docentes. Además, mantendremos un registro completo de todos los informes generados para
              una mejor trazabilidad.</p>

          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>

</script>

<style lang="scss">
.title-end {
  display: none;
  color: white;
}

.title-middle {
  color: white;
}

@media (max-width: $breakpoint-md-max) {
  .title-middle {
    display: none;
  }

  .title-end {
    display: block;
  }
}

@media (max-width: $breakpoint-xs-max) {
  .card-index {
    width: 85% !important;
  }
}
</style>
