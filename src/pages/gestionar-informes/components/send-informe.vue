<template>
  <q-btn
    size="sm"
    color="primary"
    outline
    v-if="informe.estado != 'completado' && informe.estado != 'enviadoFirmar'"
    @click="
      informe.documento_firma_docente == null
        ? (modalEnviarInforme = true)
        : (modalAdvertenciaInforme = true)
    "
    ><q-icon left name="mdi-send"></q-icon>Enviar Informe</q-btn
  >

  <q-dialog v-model="modalEnviarInforme" persistent="">
    <q-card style="width: 450px">
      <q-card-section class="text-h6 bg-primary text-white">
        <b>Enviar informe final</b>
      </q-card-section>
      <q-card-section class="q-pa-md">
        <q-banner dense class="bg-indigo-1 text-justify">
          <template v-slot:avatar>
            <q-icon name="mdi-information" color="primary" />
          </template>
          <span class="text-caption">
            Envíe el informe final firmado al Director para su aprobación</span
          >
        </q-banner>
        <div class="column items-center q-my-md">
          <q-input
            @update:model-value="
              (val) => {
                informeUpload = val[0];
              }
            "
            type="file"
            dense
            class="bg-grey-5 q-px-md"
            style="width: 98%"
          />
        </div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-actions class="justify-end">
        <q-btn flat label="Cerrar" color="negative" v-close-popup />
        <q-btn @click="enviarInforme()" color="positive">Enviar</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="modalAdvertenciaInforme" persistent>
    <q-card style="max-width: 400px">
      <q-card-section>
        <div class="row items-center">
          <div class="col-3 col-sm-2">
            <q-avatar icon="warning" color="warning" text-color="white" />
          </div>
          <div class="col-9 col-sm-10 q-pt-xs text-justify">
            <span
              >Usted ya ha enviado un informe final en el periodo
              <b>{{ periodo.nombre }}</b> ¿Está seguro que desea reemplazarlo?
            </span>
          </div>
        </div>
      </q-card-section>
      <q-card-actions style="display: flex; justify-content: flex-end">
        <q-btn flat label="Cancelar" color="negative" v-close-popup />
        <q-btn
          flat
          label="Si"
          color="primary"
          @click="modalEnviarInforme = true"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="modalInformeEnviado" persistent>
    <q-card style="max-width: 400px">
      <q-card-section
        style="display: flex; gap: 20px"
        class="items-center justify-between q-pb-xs"
      >
        <q-avatar icon="mdi-check-circle-outline" color="green" text-color="white" />
        <span class="text-justify">
          Se ha notificado al Director del envío de su informe final. Para ver el estado y
          seguimiento del mismo, dirígase a la sección:
          <q-btn
            rounded
            flat
            no-caps
            size="md"
            dense
            class="text-primary text-bold"
            to="/informe/registro"
            >Ver Registro de Informes</q-btn
          >
        </span>
      </q-card-section>
      <q-card-actions class="justify-end">
        <q-btn flat label="Cerrar" color="negative" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import informeController from "src/controller/informe-controller";
import notificacionController from "src/controller/notificacion-controller";
import { useUserStore } from "src/stores/user-store";

defineProps({
  informe: Object,
  periodo: Object,
});

const $q = useQuasar();
const userStore = useUserStore();
const modalEnviarInforme = ref(false);
const modalAdvertenciaInforme = ref(false);
const modalInformeEnviado = ref(false);
const informeUpload = ref(null);

async function enviarInforme() {
  const dialog = $q.dialog({
    message: "Enviando informe...",
    progress: true,
    persistent: true,
    ok: false,
  });
  if (informeUpload.value == null)
    return generateMessage("WARNING", "Aún no ha seleccionado ningún archivo");
  const formData = new FormData();
  formData.append("firmado_por", "docente");
  formData.append("myFile", informeUpload.value);
  await informeController.guardarInforme(formData, async (res) => {
    if (res.status != 200) {
      dialog.hide();
      generateMessage("NO OK", res.message);
      if (res.status == 401) return router.push({ path: "/login" });
      if (res.status == 403) return router.push({ path: "/" });
      return (existenDatosTabla.value = true);
    }
    //informe.value.estado = "enviadoFirmar";
    informeUpload.value = null;
    modalEnviarInforme.value = false;
    const data = {
      mensaje:
        "ha enviado el informe final firmado, para que lo apruebe, firme y reenvíe nuevamente.",
    };
    if (userStore.user.usuario.rol.nombre.toLowerCase() == "director") {
      dialog.hide();
      return (modalInformeEnviado.value = true);
    } else {
      await notificacionController.guardarNotificacion(data, (res) => {
        setTimeout(() => {
          dialog.hide();
        }, 350);
        if (res.status != 200)
          return generateMessage("NO OK", "Ocurrió un error al notificar al docente");
        modalInformeEnviado.value = true;
      });
    }
  });
}
</script>

<style lang="scss" scoped></style>
