<template>
  <q-card-section>
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <div v-show="isRecomendaciones" class="no-padding no-margin">
        <q-list bordered separator dense class="bg-white">
          <q-expansion-item
            v-model="expansion_conclusion"
            dense
            group="somegroup"
            header-class="bg-grey-5"
            class="text-subtitle2"
            dense-toggle
            :label="`${!editConRec ? 'Agregar nueva' : 'Editar'} ${textConRecSingular}`"
            icon="mdi-plus-box"
            :caption="expansion_conclusion ? '' : 'Expandir Aquí'"
          >
            <q-item class="bg-grey-2 no-padding">
              <q-item-section>
                <editor
                  v-model="textEditorConRec"
                  api-key="kelvh8lt9qpnex1cf3ne32qxcy8zslk1w7290j9vonsekyjk	"
                  :init="{
                    mobile: {
                      toolbar_mode: 'scrolling',
                    },
                    height: 200,
                    menubar: false,
                    plugins: pluginsEditor,
                    toolbar: toolbarEditor,
                    setup: setupEditor,
                    language: 'es',
                  }"
                />
              </q-item-section>
            </q-item>
          </q-expansion-item>
        </q-list>

        <q-toolbar
          class="bg-primary text-weight-bolder text-white q-mt-md q-py-xs"
          style="min-height: 35px"
        >
          <q-toolbar-title class="text-subtitle2 row justify-between text-bold">
            <span> Lista de {{ formatoInforme.conclusiones.toLowerCase() }} </span>
            <span>Total: {{ conRecList.length }}</span>
          </q-toolbar-title>
        </q-toolbar>

        <q-list v-if="conRecList.length == 0" bordered separator dense class="bg-white">
          <q-item>
            <q-item-section class="text-body1">
              <div class="flex flex-center q-gutter-sm q-py-md">
                <q-icon name="mdi-information-outline" size="md" />
                <span>Sin Registros</span>
              </div>
            </q-item-section>
          </q-item>
        </q-list>

        <table v-else class="full-width">
          <draggable
            tag="tbody"
            ghost-class="ghost"
            v-model="conRecList"
            v-bind="dragOptions"
            @start="isDragging = true"
            @end="isDragging = false"
            handle=".handle"
            item-key="orden"
            @change="changePosConRec"
          >
            <template #item="{ element }">
              <tr>
                <q-item class="q-pa-sm">
                  <q-item-section class="handle q-ma-none q-pa-none" avatar>
                    <q-icon name="fas fa-align-justify" class="move" size="xs" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-regular">
                      <div class="text-html" v-html="element.nombre"></div>
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <div>
                      <q-btn
                        flat
                        round
                        color="indigo"
                        size="sm"
                        icon="mdi-file-edit"
                        @click="editarConRec(element)"
                        :disable="editConRec?._id == element._id"
                      >
                        <q-tooltip anchor="top middle" self="center middle">
                          Editar
                        </q-tooltip>
                      </q-btn>

                      <q-btn
                        color="indigo"
                        flat
                        round
                        size="sm"
                        icon="mdi-trash-can"
                        :disabled="editConRec?._id == element._id"
                        @click="confirmacionDeleteConclusion(element)"
                      >
                        <q-tooltip anchor="top middle" self="center middle">
                          Eliminar
                        </q-tooltip></q-btn
                      >
                    </div>
                  </q-item-section>
                </q-item>
              </tr>
            </template>
          </draggable>
        </table>
      </div>
    </transition>
    <q-inner-loading
      :showing="visibleConclusiones"
      label="Cargando información..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
  </q-card-section>

  <q-dialog v-model="dialogDeleteConRec" persistent>
    <q-card style="max-width: 400px">
      <q-card-section
        style="display: flex; gap: 10px"
        class="items-center justify-between"
      >
        <q-avatar icon="warning" color="warning" text-color="white" />
        <span>
          ¿Está seguro que desea eliminar la <b>{{ textConRecSingular }}</b
          >?
        </span>
      </q-card-section>
      <q-card-actions class="justify-end">
        <q-btn
          flat
          label="Cancelar"
          color="negative"
          v-close-popup
          @click="
            modal_eliminar = false;
            item_eliminar = null;
          "
        />
        <q-btn
          flat
          label="Si"
          color="primary"
          @click="eliminarConclusionRecomendacion()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import conRecController from "src/controller/conclusionRecomendacion.controller";
import draggable from "vuedraggable";
import { ref, onMounted } from "vue";
import DOMPurify from "dompurify";
import { useQuasar } from "quasar";
import { obtenerSingularPalabra } from "src/utils/obtenerSingular";
import Editor from "@tinymce/tinymce-vue";
import {
  toolbarEditor,
  pluginsEditor,
  svgSaveString,
  svgCancelString,
} from "../utils/constantsConRec";

const props = defineProps({
  informe: Object,
  formatoInforme: Object,
});

const $q = useQuasar();
const isDragging = ref(false);
const expansion_conclusion = ref(false);

const textConRecSingular = obtenerSingularPalabra(
  props.formatoInforme.conclusiones.toLowerCase()
);
const editConRec = ref(null);
const textEditorConRec = ref("");

const isRecomendaciones = ref(false);
const conRecList = ref([]);
const visibleConclusiones = ref(true);
const dialogDeleteConRec = ref(false);
const deleteConRec = ref(null);

const dragOptions = {
  animation: 200,
  group: "description",
  disabled: false,
  ghostClass: "ghost",
};

const setupEditor = (editor) => {
  editor.ui.registry.addIcon("savePer", svgSaveString);
  editor.ui.registry.addIcon("cancelPer", svgCancelString);

  editor.ui.registry.addButton("savePer", {
    icon: "savePer",
    tooltip: "Guardar",
    enabled: false,
    onAction: () => guardarConRec(),
    onSetup: (buttonApi) => {
      editor.on("GetContent", (r) => {
        buttonApi.setDisabled(textEditorConRec.value.trim() == "");
      });
    },
  });

  editor.ui.registry.addButton("cancelPer", {
    icon: "cancelPer",
    tooltip: "Cancelar",
    enabled: true,
    onAction: () => {
      expansion_conclusion.value = false;
      editConRec.value = null;
      textEditorConRec.value = "";
    },
    onSetup: (buttonApi) => {
      editor.on("GetContent", (e) => {
        buttonApi.setDisabled(textEditorConRec.value.trim() == "");
      });
    },
  });
};

async function obtenerconRec() {
  const res = await conRecController.obtenerPorInforme(props.informe._id);
  if (res.status >= 200 && res.status < 300) {
    conRecList.value = res.data;
  } else {
    generateMessage("negative", res.message);
  }
}

function editarConRec(item) {
  editConRec.value = item;
  textEditorConRec.value = editConRec.value.nombre;
  expansion_conclusion.value = true;
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);
}

async function guardarConRec() {
  if (textEditorConRec.value == "") return;
  const dialogo = generateDialog(`Guardando ${textConRecSingular}`);
  const data = { nombre: DOMPurify.sanitize(textEditorConRec.value) };
  if (!editConRec.value) data.informe = props.informe._id;
  const res = !editConRec.value
    ? await conRecController.crear(data)
    : await conRecController.editar(editConRec.value._id, data);
  dialogo.hide();
  if (res.status > 199 && res.status < 300) {
    generateMessage("positive", `Se ha guardado la ${textConRecSingular}`);
    expansion_conclusion.value = false;
    textEditorConRec.value = "";
    obtenerconRec();
  } else {
    generateMessage("negative", res.message);
  }
}

async function confirmacionDeleteConclusion(element) {
  dialogDeleteConRec.value = true;
  deleteConRec.value = element;
}

async function eliminarConclusionRecomendacion() {
  const dialogo = generateDialog(`Eliminando ${textConRecSingular}`);
  const res = await conRecController.eliminar(deleteConRec.value._id);
  dialogo.hide();
  if (res.status > 199 && res.status < 300) {
    generateMessage("positive", `Se ha eliminado la ${textConRecSingular}`);
    dialogDeleteConRec.value = false;
    conRecList.value = conRecList.value.filter((c) => c._id !== deleteConRec.value._id);
    deleteConRec.value = null;
  } else {
    generateMessage("negative", res.message);
  }
}

async function changePosConRec(e) {
  const data = { orden: e.moved.newIndex + 1 };
  await conRecController.editar(e.moved.element._id, data);
  obtenerconRec();
}

function generateDialog(message) {
  return $q.dialog({
    message: message,
    progress: true,
    persistent: true,
    ok: false,
  });
}

const generateMessage = (tipo, message) => {
  return $q.notify({
    type: tipo,
    message: message,
  });
};

onMounted(async () => {
  await obtenerconRec();
  isRecomendaciones.value = true;
  visibleConclusiones.value = false;
});
</script>

<style scoped>
.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #bdbcbc;
}

.list-group {
  padding: 5px;
  border-radius: 0px;
}

.handle .move {
  cursor: move;
}

table {
  border: 1px solid #c9c8c8;
  border-collapse: collapse;
}

tr {
  border: 1px solid #c9c8c8;
}
</style>
