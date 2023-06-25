<template>
  <q-card-section class="q-px-lg bg-blue-1" style="min-height: 150px">
    <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <div v-show="isRecomendaciones" class="no-padding no-margin">
        <q-list bordered separator dense class="bg-white">
          <q-expansion-item v-model="expansion_conclusion" dense group="somegroup" header-class="bg-grey-5"
            class="text-subtitle2" dense-toggle :label="'Agregar nuevas ' + formatoInforme.conclusiones.toLowerCase()"
            icon="mdi-plus-box" :caption="expansion_conclusion ? '' : 'Expandir Aquí'">
            <q-item class="bg-grey-2 no-padding">
              <q-item-section>
                <q-item-label>
                  <q-editor square flat class="text-body2" v-model="textconclusionesRecomendaciones" min-height="4rem"
                    ref="editorRef" @paste="pegarEditor" :definitions="definitionsEditor" :toolbar="toolbarEditor"
                    toolbar-bg="grey-5" toolbar-toggle-color="blue-7" />
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-expansion-item>
        </q-list>

        <q-toolbar class="bg-primary text-weight-bolder text-white q-mt-md q-py-xs" style="min-height: 35px;">
          <q-toolbar-title class="text-subtitle2 row justify-between text-bold">
            <span>
              Lista de {{ formatoInforme.conclusiones.toLowerCase() }}
            </span>
            <span>Total: {{ conclusionesRecomendaciones.length }}</span>
          </q-toolbar-title>
        </q-toolbar>

        <q-list v-if="conclusionesRecomendaciones.length == 0" bordered separator dense class="bg-white">
          <q-item>
            <q-item-section avatar><q-icon name="mdi-information" /></q-item-section>
            <q-item-section class="text-weight-light">Aun no tiene {{
              formatoInforme.conclusiones.toLowerCase() }}
              agregadas</q-item-section>
          </q-item>
        </q-list>

        <q-list v-else bordered separator dense class="bg-white">
          <template v-for="(item, key) in conclusionesRecomendaciones " :key="key">

            <q-item v-if="indexEditConclusion == key" class="no-padding">
              <q-item-section style="border: 1px solid rgba(0,0,0,0.5)">
                <q-item-label class="bg-grey-5 q-px-md q-py-sm">
                  <div class="row justify-between items-center">
                    <div class="text-body2 items-center row q-gutter-x-md">
                      <q-icon name="mdi-file-edit"></q-icon>
                      <b>Editar {{
                        obtenerSingular(formatoInforme.conclusiones.toLowerCase()) }}</b>
                    </div>
                    <div>
                      <q-btn dense size="sm" square flat class="bg-red text-white"
                        @click="cancelarEdicion()">CANCELAR</q-btn>
                    </div>
                  </div>
                </q-item-label>
                <q-item-label class="no-margin">
                  <q-editor square flat class="text-body2" v-model="textEditConclusion" min-height="4rem" ref="editorRef"
                    @paste="pegarEditor" :definitions="definitionsEditor" :toolbar="toolbarEditorEditar"
                    toolbar-bg="grey-5" toolbar-toggle-color="blue-7" content-class="bg-grey-3" />

                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-else>
              <q-item-section avatar class="col-1">
                <q-btn flat icon="mdi-chevron-up" color="grey-7" size="xs" round :disable="key != 0 ? false : true"
                  @click="cambiarPosicionConclusion(item, key + 1 - 1)"></q-btn>
                <q-btn flat icon="mdi-chevron-down" color="grey-7" size="xs" round
                  :disable="key != conclusionesRecomendaciones.length - 1 ? false : true"
                  @click="cambiarPosicionConclusion(item, key + 1 + 1)"></q-btn>
              </q-item-section>
              <q-item-section class="col-1 text-bold">
                <span>{{ item.orden + ". " }}</span>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-regular">
                  <div v-html="item.nombre"></div>
                </q-item-label>
              </q-item-section>
              <q-item-section side class="col-2">
                <div class="flex">
                  <span>
                    <q-btn color="amber" flat round size="sm" icon="mdi-file-edit" @click="mostrarEditorEditar(item)" />
                    <q-tooltip class="bg-indigo"> Editar </q-tooltip>
                  </span>
                  <span>
                    <q-btn color="red" flat round size="sm" icon="mdi-trash-can"
                      @click=" confirmacionDeleteConclusion(item)" />
                    <q-tooltip class="bg-indigo"> Eliminar </q-tooltip>
                  </span>
                </div>
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </div>
    </transition>
    <q-inner-loading :showing="visibleConclusiones" label="Cargando información..." label-class="text-teal"
      label-style="font-size: 1.1em" />
  </q-card-section>

  <q-dialog v-model="confirm_delete_conclusion" persistent>
    <q-card style="max-width: 400px">
      <q-card-section style="display: flex; gap: 10px" class="items-center justify-between">
        <q-avatar icon="warning" color="warning" text-color="white" />
        <span>¿Está seguro que desea eliminar la <b>{{ obtenerSingular(props.formatoInforme.conclusiones).toLowerCase()
        }}</b>?
        </span>
      </q-card-section>
      <q-card-actions class="justify-end">
        <q-btn flat label="Cancelar" color="negative" v-close-popup
          @click=" modal_eliminar = false; item_eliminar = null" />
        <q-btn flat label="Si" color="primary" @click=" eliminarConclusionRecomendacion()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import conclusionRecomendacionController from "src/controller/conclusionRecomendacion.controller";
import { ref } from "vue";
import { watch } from "vue";
import DOMPurify from 'dompurify';
import { useQuasar } from "quasar";

const props = defineProps({
  informe: Object,
  formatoInforme: Object,
});

const $q = useQuasar();
const indexEditConclusion = ref(null);
const textEditConclusion = ref("");
const estaEditandoConclusion = ref(false)
const conclusionEditar = ref(null)

const editorRef = ref(null)
const expansion_conclusion = ref(false)

const textconclusionesRecomendaciones = ref("");
const isRecomendaciones = ref(false);
const conclusionesRecomendaciones = ref([]);
const visibleConclusiones = ref(true);
const confirm_delete_conclusion = ref(false);
const conclusion_delete = ref(null);

const definitionsEditor = {
  save: {
    tip: 'Guardar',
    icon: 'save',
    handler: guardar,
    label: 'Guardar',
    color: 'green-10',
  },
  edit: {
    tip: 'Guardar',
    icon: 'save',
    handler: editarConclusionRecomendacion,
    label: 'Guardar',
    color: 'green-10',
  },
  borrar: {
    tip: 'Borrar texto',
    icon: 'mdi-close',
    label: 'Borrar',
    color: 'negative',
    handler: () => { textconclusionesRecomendaciones.value = '' }
  },
  bold: {
    tip: 'Negrita',
    key: 0
  },
  italic: {
    tip: 'Cursiva',
    key: 0
  },
  strike: {
    tip: 'Tachado',
    key: 0
  },
  underline: {
    tip: 'Subrayado',
    key: 0
  },
  undo: {
    tip: 'Deshacer',
    key: 0
  },
  redo: {
    tip: 'Rehacer',
    key: 0
  },
  link: {
    tip: 'Hipervínculo',
    key: 0
  }
}
const toolbarEditor = [['bold', 'italic', 'strike', 'underline'], ['link'], ['undo', 'redo'], ['save'], ['borrar']]
const toolbarEditorEditar = [['bold', 'italic', 'strike', 'underline'], ['link'], ['undo', 'redo'], ['edit']]


const obtenerConclusionesRecomendaciones = async () => {
  return await conclusionRecomendacionController.obtenerPorInforme(
    props.informe._id,
    (res) => {
      if (res.status != 200) {
        if (res.status == 401) {
          generateMessage("NO OK", res.message);
          return router.push({ path: "/login" });
        }
        if (res.status == 403) {
          generateMessage("NO OK", res.message);
          return router.push({ path: "/" });
        }
        generateMessage(
          "NO OK",
          "Ocurrió un error al obtener las" +
          props.informe.conclusionesRecomendaciones
        )
        return false
      }
      return res.data;
    }
  );

};

function mostrarEditorEditar(item) {
  if (estaEditandoConclusion.value) return generateMessage('WARNING', 'Se encuentra editando una ' + obtenerSingular(props.formatoInforme.conclusiones).toLowerCase())
  indexEditConclusion.value = item.orden - 1
  estaEditandoConclusion.value = true
  textEditConclusion.value = item.nombre
  conclusionEditar.value = item
  editorRef.value = null
}

async function editarConclusionRecomendacion() {
  if (textEditConclusion.value == "") return;
  const dialogo = generateDialog('Editando ' + obtenerSingular(props.formatoInforme.conclusiones).toLowerCase())
  const data = {
    nombre: sanitizarTexto(textEditConclusion.value),
  };
  await conclusionRecomendacionController.editar(conclusionEditar.value._id, data, async (res) => {
    if (res.status != 200) {
      dialogo.hide()
      if (res.status == 401) {
        generateMessage("NO OK", res.message);
        return router.push({ path: "/login" });
      }
      if (res.status == 403) {
        generateMessage("NO OK", res.message);
        return router.push({ path: "/" });
      }
      return generateMessage(
        "NO OK",
        "Ocurrio un error al editar la " + obtenerSingular(props.formatoInforme.conclusiones).toLowerCase()
      );
    }
    conclusionesRecomendaciones.value = await obtenerConclusionesRecomendaciones();
    generateMessage("OK", "Se ha editado la " + obtenerSingular(props.formatoInforme.conclusiones).toLowerCase());
    cancelarEdicion()
    return dialogo.hide()
  });
}

async function confirmacionDeleteConclusion(conclusion) {
  if (estaEditandoConclusion.value) return generateMessage('WARNING', 'Se encuentra editando una ' + obtenerSingular(props.formatoInforme.conclusiones).toLowerCase())
  confirm_delete_conclusion.value = true;
  conclusion_delete.value = conclusion;
}

async function eliminarConclusionRecomendacion() {
  const dialogo = generateDialog('Eliminando ' + obtenerSingular(props.formatoInforme.conclusiones).toLowerCase())
  textEditConclusion.value = null;
  indexEditConclusion.value = null;
  await conclusionRecomendacionController.eliminar(
    conclusion_delete.value._id,
    async (res) => {
      if (res.status != 200) {
        dialogo.hide()
        if (res.status == 401) {
          generateMessage("NO OK", res.message);
          return router.push({ path: "/login" });
        }
        if (res.status == 403) {
          generateMessage("NO OK", res.message);
          return router.push({ path: "/" });
        }
        return generateMessage(
          "NO OK",
          "Ocurrio un error al eliminar la " + obtenerSingular(props.formatoInforme.conclusiones).toLowerCase()
        )
      }
      conclusionesRecomendaciones.value = await obtenerConclusionesRecomendaciones();
      confirm_delete_conclusion.value = false;
      conclusion_delete.value = null;
      generateMessage("OK", "Se ha eliminado la " + obtenerSingular(props.formatoInforme.conclusiones).toLowerCase());
      return dialogo.hide()
    }
  );
}

function cancelarEdicion() {
  estaEditandoConclusion.value = false
  conclusionEditar.value = null
  textEditConclusion.value = ""
  indexEditConclusion.value = null
}

async function guardar() {
  const dialogo = generateDialog('Guardando ' + obtenerSingular(props.formatoInforme.conclusiones).toLowerCase())
  if (textconclusionesRecomendaciones.value == "") return;
  const data = {
    nombre: sanitizarTexto(textconclusionesRecomendaciones.value),
    informe: props.informe._id,
  };
  await conclusionRecomendacionController.crear(data, async (res) => {
    if (res.status != 200) {
      dialogo.hide()
      if (res.status == 401) {
        generateMessage("NO OK", res.message);
        return router.push({ path: "/login" });
      }
      if (res.status == 403) {
        generateMessage("NO OK", res.message);
        return router.push({ path: "/" });
      }
      return generateMessage("NO OK", "Ocurrió un error al guardar la " + obtenerSingular(props.formatoInforme.conclusiones).toLowerCase());
    }
    conclusionesRecomendaciones.value = await obtenerConclusionesRecomendaciones();
    textconclusionesRecomendaciones.value = '';
    generateMessage("OK", "Se ha guardado la " + obtenerSingular(props.formatoInforme.conclusiones).toLowerCase());
    return dialogo.hide()
  });
}


function sanitizarTexto(texto) {
  texto = texto.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
  texto = texto.replace(/(<div><br><\/div>){2,}/g, "<div><br></div>");
  texto = DOMPurify.sanitize(texto)
  texto = texto.replaceAll("&nbsp;", " ")
  return texto.trim()
}

function obtenerSingular(texto) {
  return texto
}

function pegarEditor(evt) {
  // Let inputs do their thing, so we don't break pasting of links.
  if (evt.target.nodeName === 'INPUT') return
  let text, onPasteStripFormattingIEPaste
  evt.preventDefault()
  evt.stopPropagation()
  if (Array.isArray(editorRef.value)) editorRef.value = editorRef.value[0]
  if (evt.originalEvent && evt.originalEvent.clipboardData.getData) {
    text = evt.originalEvent.clipboardData.getData('text/plain')
    editorRef.value.runCmd('insertText', text)
  }
  else if (evt.clipboardData && evt.clipboardData.getData) {
    text = evt.clipboardData.getData('text/plain')
    editorRef.value.runCmd('insertText', text)
  }
  else if (window.clipboardData && window.clipboardData.getData) {
    if (!onPasteStripFormattingIEPaste) {
      onPasteStripFormattingIEPaste = true
      editorRef.value.runCmd('ms-pasteTextOnly', text)
    }
    onPasteStripFormattingIEPaste = false
  }
}

async function cambiarPosicionConclusion(conclusion, key) {
  const dialogo = generateDialog('Reordenando')
  if (estaEditandoConclusion.value) return generateMessage('WARNING', 'Se encuentra editando una ' + obtenerSingular(props.formatoInforme.conclusiones).toLowerCase())
  textEditConclusion.value = null;
  indexEditConclusion.value = null;
  await conclusionRecomendacionController.editar(conclusion._id, { orden: key });
  conclusionesRecomendaciones.value = await obtenerConclusionesRecomendaciones();
  dialogo.hide()
}

function generateDialog(message) {
  return $q.dialog({
    message: message,
    progress: true,
    persistent: true,
    ok: false
  })
}

const generateMessage = (tipo, message) => {
  if (tipo == "OK") {
    $q.notify({
      color: "green-5",
      textColor: "white",
      icon: "mdi-check-bold",
      message: message,
    });
  } else if (tipo == "WARNING") {
    $q.notify({
      color: "orange-5",
      textColor: "white",
      icon: "warning",
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

async function iniciarData() {
  conclusionesRecomendaciones.value = await obtenerConclusionesRecomendaciones()
  isRecomendaciones.value = true;
  visibleConclusiones.value = false;
}


iniciarData()

//Esta funcion se ejecuta cuando se obtiene el informe final
watch(
  () => props.informe,
  (_) => {
    if (props.informe != null) {
      obtenerConclusionesRecomendaciones();
    }
  }
);
</script>
