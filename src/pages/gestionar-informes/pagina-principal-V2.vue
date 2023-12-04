<template>
  <div class="container-not-periodo" v-if="!periodoAcademico">
    <div
      class="flex justify-center items-center text-center q-px-xl q-py-md"
      style="border: 2px solid rgb(197, 197, 197); gap: 20px"
    >
      <q-icon size="2rem" name="mdi-alert-outline"></q-icon>
      <span class="text-h5 text-weight-light"
        >Aún no existe un periodo académico disponible</span
      >
    </div>
  </div>

  <template v-else>
    <q-card class="q-ma-md bg-transparent no-border" square flat bordered>
      <q-card-section
        class="text-h6 flex justify-center justify-sm-between items-center"
        style="gap: 10px"
        v-if="periodoAcademico"
      >
        <span class="text-primary text-center">
          <b>Periodo Académico:</b> {{ periodoAcademico.nombre }}
        </span>
        <div
          class="flex flex-column wrap text-center justify-center gap-2 q-mt-md q-mt-sm-none"
          style="gap: 5px"
        >
          <q-btn
            size="sm"
            color="primary"
            outline
            @click="descargarPDF()"
            :loading="isGeneratingInforme"
          >
            <q-icon left size="1.3rem" name="mdi-download" />Generar Informe</q-btn
          >
          <SendInforme
            v-if="informeDocente"
            :informe="informeDocente"
            :periodo="periodoAcademico"
          />
        </div>
      </q-card-section>
    </q-card>

    <q-card
      class="q-ma-md shadow-0 rounded-borders"
      style="border: 2px solid rgb(217, 217, 217)"
    >
      <q-tabs
        v-model="tabActual"
        inline-label
        class="text-primary shadow-24"
        align="justify"
        outside-arrows
        mobile-arrows
      >
        <q-tab
          name="actividades"
          icon="mdi-list-box-outline"
          label="Actividades del Distributivo"
        ></q-tab>
        <q-tab
          name="conclusiones"
          icon="mdi-sticker-text-outline"
          label="Conclusiones y/o recomedacionesS"
        ></q-tab>
      </q-tabs>
      <q-tab-panels v-model="tabActual" keep-alive>
        <q-tab-panel name="actividades">
          <ListarActividadesDistributivo
            v-if="informeDocente"
            :informe="informeDocente"
          />
        </q-tab-panel>
        <q-tab-panel name="conclusiones">
          <CompConclusiones
            v-if="informeDocente"
            :formatoInforme="formatoInforme"
            :informe="informeDocente"
          ></CompConclusiones>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </template>
</template>

<script setup>
import ListarActividadesDistributivo from "./components/listar_actividaddistributivo.vue";
import CompConclusiones from "./components/comp-conclusiones.vue";
import SendInforme from "./components/send-informe.vue";

import informeController from "src/controller/informe-controller";
import periodoController from "src/controller/periodo-controller";
import { pluginsQuasar } from "src/composables/pluginsQuasar";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { saveAs } from "file-saver";
import formatoController from "src/controller/formato-controller";
import printJS from "print-js";

const isGeneratingInforme = ref(false);
const router = useRouter();
const pgQuasar = pluginsQuasar();
const periodoAcademico = ref(null);
const informeDocente = ref(null);
const formatoInforme = ref(null);
const tabActual = ref("actividades");

const obtenerUltimoPeriodo = async () => {
  const res = await periodoController.obtenerUltimoPeriodo();
  if (res.status >= 200 && res.status < 300)
    return (periodoAcademico.value = res.data.periodo);
  pgQuasar.generateNotify(pgQuasar.NOTIFY_TYPES.negative, res.message);
  generateMessage("NO OK", res.message);
  if (res.status == 401) return router.push({ path: "/login" });
};

const obtenerInformePorPeriodo = async () => {
  const res = await informeController.obtenerInformePeriodo(periodoAcademico.value._id);
  if (res.status >= 200 && res.status < 300)
    return (informeDocente.value = res.data.informeFinal);
  pgQuasar.generateNotify(pgQuasar.NOTIFY_TYPES.negative, res.message);
  if (res.status == 401) return router.push({ path: "/login" });
};

const obtenerFormatoInforme = async () => {
  return formatoController.obtenerInformeActivo((res) => {
    if (res.status >= 200 && res.status < 300) {
      formatoInforme.value = res.data;
    } else {
      pgQuasar.generateNotify(pgQuasar.NOTIFY_TYPES.negative, res.message);
      if (res.status == 401) return router.push({ path: "/login" });
    }
  });
};

async function descargarPDF() {
  isGeneratingInforme.value = true;
  const res = await informeController.generarFormato(informeDocente.value._id);
  isGeneratingInforme.value = false;
  if (res.status > 199 && res.status < 300) {
    const bytes = new Uint8Array(res.data.pdf.data);
    const file = new Blob([bytes], { type: "application/pdf" });
    var fileURL = URL.createObjectURL(file);
    printJS({ printable: fileURL, type: "pdf" });
    //saveAs(file, "informe.pdf");
  } else {
    pgQuasar.generateNotify(pgQuasar.NOTIFY_TYPES.negative, res.message);
  }
}

onMounted(async () => {
  await obtenerUltimoPeriodo();
  if (periodoAcademico.value) {
    await obtenerInformePorPeriodo();
    await obtenerFormatoInforme();
  }
});
</script>

<style scoped>
.container-not-periodo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 90vh;
}
</style>
