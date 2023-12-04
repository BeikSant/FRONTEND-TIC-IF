<template>
  <q-card class="q-ma-md" square flat bordered>
    <q-card-section class="bg-primary text-white">
      <div class="flex items-center justify-between">
        <span class="text-h6 text-bold">Distributivo General de los Docentes</span>
        <q-btn
          v-if="
            userStore.user &&
            userStore.user.usuario.rol.nombre.toUpperCase() === 'DIRECTOR'
          "
          @click="fixed = true"
          size="sm"
          color="green"
          >Nuevo Distributivo</q-btn
        >
      </div>
    </q-card-section>

    <q-card-section class="no-padding no-margin">
      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <div v-show="isData" class="no-padding no-margin">
          <template v-if="funSustantivaModel.length == 0">
            <div class="q-py-xl text-center">
              <span>¡Aún no se ha cargado el distributivo general!</span>
            </div>
          </template>
          <template v-else>
            <q-tabs
              indicator-color="white"
              v-model="funSustantivaModel"
              dense
              class="bg-primary text-grey-6"
              inline-label
              outside-arrows
              mobile-arrows
              active-color="white"
            >
              <q-tab
                v-for="(fs, index) in funcionesSustantivas"
                :key="index"
                :label="fs.nombre"
                :name="fs.nombre"
              />
            </q-tabs>

            <q-tab-panels animated v-model="funSustantivaModel">
              <q-tab-panel
                class="no-padding"
                v-for="(fs, index) in funcionesSustantivas"
                :key="index"
                :label="fs.nombre"
                :name="fs.nombre"
              >
                <div class="no-padding">
                  <q-table
                    flat
                    bordered
                    square
                    :rows-per-page-options="[5, 10, 0]"
                    :pagination="{ rowsPerPage: 10 }"
                    rows-per-page-label="Resultados por página"
                    :rows="fs.actividadesDistributivo"
                    :columns="columns"
                    row-key="name"
                    separator="cell"
                    dense
                    :grid="$q.screen.xs"
                    no-results-label="No hay ningún resultado"
                    :filter="filter"
                  >
                    <template v-slot:top>
                      <div class="row justify-between items-center full-width">
                        <span class="text-subtitle1 text-bold text-uppercase"
                          >LISTA DE ACTIVIDADES</span
                        >
                        <q-input dense v-model="filter" placeholder="Buscar">
                          <template v-slot:append>
                            <q-icon name="search" />
                          </template>
                        </q-input>
                      </div> </template
                  ></q-table>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </template>
        </div>
      </transition>
      <q-inner-loading
        style="height: 150px"
        :showing="visible"
        label="Cargando información..."
        label-class="text-teal"
        label-style="font-size: 1.1em"
      />
    </q-card-section>
  </q-card>

  <q-dialog v-model="fixed" square persistent>
    <q-card>
      <q-card-section class="bg-primary row justify-between">
        <div class="text-white text-h6"><b>Nuevo Distributivo General</b></div>
        <q-btn
          target="_blank"
          :href="baseURL + '/documents/Formatodistributivo.xlsx'"
          color="info"
          size="sm"
        >
          Ver Formato</q-btn
        >
      </q-card-section>

      <q-card-section
        class="scroll q-gutter-y-sm"
        v-if="actividadesSubir.length != 0"
        style="max-height: 50vh"
      >
        <template v-for="fs of actividadesSubir" :key="fs">
          <q-toolbar
            style="min-height: 35px"
            class="bg-primary text-weight-bolder text-white q-py-xs"
          >
            <q-toolbar-title class="text-subtitle2">{{ fs.nombre }}</q-toolbar-title>
          </q-toolbar>
          <q-list bordered separator dense class="q-mt-none">
            <q-item v-for="(ac, key2) of fs.actividadesDistributivo" :key="key2">
              <q-item-section side>
                <q-item-label>{{ ac.sigla }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label caption lines="2">{{ ac.descripcion }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </template>
      </q-card-section>

      <q-card-section v-if="actividadesSubir.length == 0">
        <q-banner class="bg-indigo-1 text-justify">
          <template v-slot:avatar>
            <q-icon name="mdi-information" color="primary" />
          </template>
          <span class="text-caption">
            Para cargar un nuevo distributivo general de los docentes, debe regirse al
            formato del documento .xlsx que se puede obtener al dar click en
            <b>VER FORMATO</b>. <br />La <b>CODIFICACIÓN</b> de las actividades debe ser
            igual al de la planificación de carga horaria docente del <b>SIAAF</b> (por
            ejemplo: '<b>AD 1</b>').</span
          >
        </q-banner>
      </q-card-section>

      <q-card-section class="q-pt-none" v-if="actividadesSubir.length == 0">
        <q-file
          class="full-width"
          outlined
          square
          bottom-slots
          accept=".xlsx"
          use-chips
          v-model="excelUpload"
          label="Documento .xlsx"
          max-file-size="2000000"
          counter
          hint="Suba el documento que contiene el distributivo general"
        >
          <template v-slot:prepend>
            <q-icon name="cloud_upload" @click.stop.prevent />
          </template>
          <template v-slot:append>
            <q-icon
              name="close"
              @click.stop.prevent="excelUpload = null"
              class="cursor-pointer"
            />
          </template>
          <template v-slot:hint> Field hint </template>
        </q-file>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-actions class="justify-end">
        <q-btn
          @click="
            actividadesSubir = [];
            excelUpload = null;
          "
          flat
          color="negative"
          v-close-popup
          >Cancelar</q-btn
        >
        <q-btn
          v-if="actividadesSubir.length == 0"
          @click="obtenerDistributivoGeneral"
          color="positive"
          >Aceptar</q-btn
        >
        <q-btn v-else @click="guardarActividades()" color="positive">Guardar</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from "vue";
import readXlsxFile from "read-excel-file";
import distributivo from "src/controller/distributivo";
import { useQuasar } from "quasar";
import { useUserStore } from "src/stores/user-store";
import user from "src/controller/user";

const userStore = useUserStore();
const $q = useQuasar();
const baseURL = process.env.VUE_APP_BASE_URL;
const excelUpload = ref(null);
const filter = ref("");
const fixed = ref(false);
const visible = ref(true);
const isData = ref(false);
const actividadesSubir = ref([]);
const funSustantivaModel = ref([]); // Es para los q-tabs
const funcionesSustantivas = ref([]); // Funcines sustantivas con sus actividades del distributivo
const columns = [
  {
    name: "sigla",
    align: "center",
    label: "CODIFICACIÓN",
    field: "sigla",
    sortable: true,
  },
  {
    name: "descripcion",
    align: "left",
    label: "DESCRIPCIÓN",
    field: "descripcion",
    sortable: false,
    style: "max-width: 500px; white-space: break-spaces;",
  },
];

const obtenerActividades = async () => {
  await distributivo.obtenerTodasActividades(async (res) => {
    if (res.status == 401) {
      generateMessage("NO OK", res.message);
      return router.push({ path: "/login" });
    }
    if (res.status == 403) {
      generateMessage("NO OK", res.message);
      return router.push({ path: "/" });
    }
    if (res.status != 200) return generateMessage("NO OK", res.message);
    funcionesSustantivas.value = res.data.actividades.funcionesSustantivas;
    if (funcionesSustantivas.value.length != 0)
      funSustantivaModel.value = funcionesSustantivas.value[0].nombre;
  });
  isData.value = true;
  visible.value = false;
};

const guardarActividades = async () => {
  const dialog = generateDialog("Guardando distributivo general");
  await distributivo.guardarNuevoDistributivo(actividadesSubir.value, async (res) => {
    if (res.status != 200) {
      dialog.hide();
      return generateMessage("NO OK", "Error al guardar el nuevo distributivo general");
    }
    await obtenerActividades();
    generateMessage("OK", res.data.message);
    dialog.hide();
    fixed.value = false;
  });
};

async function obtenerDistributivoGeneral() {
  const dialog = generateDialog("Obteniendo distributivo general");
  const file = excelUpload.value;
  actividadesSubir.value = [];
  await readXlsxFile(file).then((rows) => {
    let row = {};
    for (let i = 1; i < rows.length; i++) {
      if (i == 1 && rows[i][0] == null)
        return generateMessage(
          "NO OK",
          "El documento .xlsx no sigue el formato sugerido"
        );
      if (rows[i][0] != null) {
        if (i != 1) actividadesSubir.value.push(row);
        row = {
          nombre: rows[i][0],
          actividadesDistributivo: [],
        };
      }
      row.actividadesDistributivo.push({
        sigla: rows[i][1],
        descripcion: rows[i][2],
      });
    }
    actividadesSubir.value.push(row);
    if (actividadesSubir.value.length == 0) {
      generateMessage("NO OK", "No se ha obtenido ninguna actividad del documento .xlsx");
    }
    dialog.hide();
  });
}

const generateMessage = (tipo, message) => {
  if (tipo == "OK") {
    $q.notify({
      color: "green-5",
      textColor: "white",
      icon: "mdi-check-bold",
      message: message,
    });
  } else {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: message,
    });
  }
};

function generateDialog(message) {
  return $q.dialog({
    message: message,
    progress: true,
    persistent: true,
    ok: false,
  });
}

obtenerActividades();
</script>

<style lang="scss"></style>
