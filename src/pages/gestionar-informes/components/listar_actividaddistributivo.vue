<template>
  <div class="flex justify-between items-center justify-center">
    <div class="text-h6">Lista de actividades</div>
    <q-select
      outlined
      v-model="funcionSustantiva"
      :options="funcionesSustantivas"
      label="Función Sustantiva"
      style="min-width: 230px"
      @update:model-value="obtenerActividadesInforme()"
    ></q-select>
  </div>
  <div class="q-mt-lg">
    <q-table
      :columns="headersTable"
      dense
      :rows="actividadesEspecificas"
      style="border: 1px solid rgb(216, 216, 216)"
      class="shadow-0"
      separator="cell"
      :loading="loadingTable"
      loading-label="Cargando informacion ..."
      no-data-label="No tiene actividades registradas en esta función sustantiva"
      :rows-per-page-options="[-1]"
      :pagination-label="
        (firstRowIndex, endRowIndex, totalRowsNumber) =>
          `${firstRowIndex} - ${endRowIndex} de ${totalRowsNumber}`
      "
    >
      <template v-slot:body-cell-acciones="props">
        <q-td :props="props" class="q-gutter-x-xs" auto-width>
          <span>
            <q-btn
              size="sm"
              color="positive"
              round
              dense
              icon="mdi-folder-edit"
              @click="actividadGestionar = props.row"
            />
            <q-tooltip :offset="[10, 10]" class="bg-indigo">
              Gestionar actividad
            </q-tooltip>
          </span>
          <span>
            <q-btn
              size="sm"
              color="warning"
              round
              dense
              icon="mdi-file-document-edit"
              @click="editarActividad(props.row)"
            />
            <q-tooltip :offset="[10, 10]" class="bg-indigo">
              Editar información
            </q-tooltip>
          </span>
          <span v-if="!props.row.requerido">
            <q-btn
              size="sm"
              color="negative"
              round
              dense
              @click="confirmacionEliminarActividad(props.row)"
              icon="mdi-delete"
            />
            <q-tooltip :offset="[10, 10]" class="bg-indigo">
              Eliminar actividad
            </q-tooltip>
          </span>
        </q-td>
      </template>
    </q-table>
  </div>

  <CompGestActividad
    v-if="actividadGestionar != null"
    :formatoInforme="formatoInforme"
    :actividad="actividadGestionar"
    @close-actividad="closeGestActividad"
  ></CompGestActividad>

  <q-dialog v-model="dialogEditarActividad" persistent>
    <EditarActividad
      v-if="dialogEditarActividad"
      :closeDialog="closeDialog"
      :actividadEditar="actividadEditar"
      :actualizarLista="obtenerActividadesInforme"
    />
  </q-dialog>
</template>

<script setup>
import EditarActividad from "./editar-actividad.vue";
import CompGestActividad from "./comp-gestionar-actividad.vue";
import { pluginsQuasar } from "src/composables/pluginsQuasar";
import distributivoController from "src/controller/distributivo";
import especificaController from "src/controller/especifica-controller";

import { onMounted, ref } from "vue";

const pgQuasar = pluginsQuasar();
const emit = defineEmits(["gestActivity"]);
const props = defineProps({
  informe: {
    type: Object,
    default: null,
  },
  formatoInforme: {
    type: Object,
    default: null,
  },
});

const headersTable = [
  {
    name: "nombre",
    label: "NOMBRE",
    sortable: true,
    field: "nombre",
    align: "left",
    style: "white-space: break-spaces;",
  },
  {
    name: "horas",
    label: "HORAS",
    sortable: false,
    field: "horas",
    align: "center",
  },
  {
    name: "actividadDesarrollada",
    label: "ACT. DES.",
    sortable: false,
    field: "actividadesDesarrolladas",
    align: "center",
    style: "max-width: 20px; white-space: break-spaces;",
  },
  {
    name: "evidencia",
    label: "EVIDENCIAS",
    sortable: false,
    field: "evidencias",
    align: "center",
  },
  {
    name: "observacion",
    label: "OBSERVACIONES",
    sortable: false,
    field: "observaciones",
    align: "center",
  },
  {
    name: "acciones",
    label: "ACCIONES",
    sortable: false,
    field: "acciones",
    align: "center",
  },
];
const actividadGestionar = ref(null);
const funcionSustantiva = ref(null);
const actividadesEspecificas = ref([]);
const funcionesSustantivas = ref([]);
const loadingTable = ref(false);
const dialogEditarActividad = ref(false);
const actividadEditar = ref(null);

const obtenerActividadesInforme = async () => {
  const fs = funcionSustantiva.value;
  const res = await especificaController.actEspecificasPorFuncionSustantiva(
    props.informe._id,
    fs._id
  );
  if (res.status > 199 && res.status < 300) {
    actividadesEspecificas.value = res.data;
  } else {
    pgQuasar.generateNotify(pgQuasar.NOTIFY_TYPES.negative, res.message);
    if (res.status == 401) return router.push({ path: "/login" });
  }
};

const obtenerActividadesDistributivo = async () => {
  loadingTable.value = true;
  funcionSustantiva.value = [];
  const res = await distributivoController.obtenerTodasActividades();
  loadingTable.value = false;
  if (res.status > 199 && res.status < 300) {
    funcionesSustantivas.value = res.data.actividades.funcionesSustantivas.map((fs) => {
      return {
        _id: fs._id,
        nombre: fs.nombre,
        label: fs.nombre,
        value: fs._id,
      };
    });
    funcionSustantiva.value = funcionesSustantivas.value[0];
  } else {
    pgQuasar.generateNotify(pgQuasar.NOTIFY_TYPES.negative, res.message);
    if (res.status == 401) return router.push({ path: "/login" });
  }
};

function editarActividad(actividad) {
  actividadEditar.value = actividad;
  dialogEditarActividad.value = true;
}

function closeDialog() {
  dialogEditarActividad.value = false;
}

function closeGestActividad(data) {
  const find = actividadesEspecificas.value.find((a) => a._id == data._id);
  find.actividadesDesarrolladas = data.actividadesDesarrolladas;
  find.observaciones = data.observaciones;
  find.evidencias = data.evidencias;
  actividadGestionar.value = null;
}

onMounted(async () => {
  await obtenerActividadesDistributivo();
  obtenerActividadesInforme();
});
</script>

<style lang="scss" scoped></style>
