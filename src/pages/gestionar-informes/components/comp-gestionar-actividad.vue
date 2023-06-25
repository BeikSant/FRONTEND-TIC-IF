<template>
  <q-dialog v-model="modalVerActividadEspecifica" persistent square :maximized="$q.screen.xs" transition-show="slide-up"
    transition-hide="slide-down">
    <q-card style="max-width: 700px;">
      <q-card-section class="bg-primary text-white text-h6">
        <q-item>
          <q-item-section>
            <q-item-label lines="2">
              <span class="text-bold">ACTIVIDAD: </span>
              <span>{{ actividad.nombre }}</span>
            </q-item-label>
          </q-item-section>

          <q-item-section side class="col-auto">
            <q-item-label class="text-white">
              <q-btn dense flat icon="close" color="primary" class="text-white" v-close-popup>
                <q-tooltip class="bg-white text-primary">Cerrar</q-tooltip>
              </q-btn>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>

      <q-tabs @vnode-before-update="estaEditando" indicator-color="indigo-4" v-model="tab_actividad" dense outside-arrows
        mobile-arrows class="bg-primary text-grey-7" active-class="text-white" inline-label no-caps>
        <q-tab :name="formatoInforme.actividadesDesarrolladas" :label="formatoInforme.actividadesDesarrolladas" />
        <q-tab :name="formatoInforme.evidencias" :label="formatoInforme.evidencias" />
        <q-tab :name="formatoInforme.observaciones" :label="formatoInforme.observaciones" />
      </q-tabs>

      <q-card-section class="scroll no-margin no-padding card-gestionar-actividad">
        <q-tab-panels v-model="tab_actividad">

          <!-- INICIO SECCION ACTIVIDADES DESARROLLADAS -->
          <q-tab-panel :name="formatoInforme.actividadesDesarrolladas">
            <q-list bordered>

              <!-- Inicio Texto de entrada -->
              <q-expansion-item v-model="expansion_desarrolladas" dense group="somegroup" header-class="bg-grey-5"
                class="text-subtitle2" dense-toggle
                :label="'Agregar nuevas ' + formatoInforme.actividadesDesarrolladas.toLowerCase()" icon="mdi-plus-box"
                :caption="expansion_desarrolladas ? '' : 'Expandir Aquí'">
                <q-item class="no-padding">
                  <q-item-section>
                    <q-editor square flat class="text-body2" v-model="textActividadDesarrollada" min-height="4rem"
                      ref="editorRef" @paste="pegarEditor" :definitions="definitionsEditor" :toolbar="toolbarEditor"
                      toolbar-toggle-color="blue-7" toolbar-bg="grey-5" content-class="bg-grey-3" />
                  </q-item-section>
                </q-item>
              </q-expansion-item>
              <!-- Fin Texto de entrada -->

            </q-list>

            <q-toolbar class="bg-primary text-weight-bolder text-white q-mt-md q-py-xs" style="min-height: 35px;">
              <q-toolbar-title class="text-subtitle2 row justify-between text-bold">
                <span>
                  Lista de {{ formatoInforme.actividadesDesarrolladas.toLowerCase() }}
                </span>
                <span>Total: {{ actividadesDesarrolladas.length }}</span>
              </q-toolbar-title>
            </q-toolbar>

            <q-list v-if="actividadesDesarrolladas.length == 0" bordered separator dense>
              <q-item>
                <q-item-section avatar><q-icon name="mdi-information" /></q-item-section>
                <q-item-section class="text-weight-light">Aun no tiene {{
                  formatoInforme.actividadesDesarrolladas.toLowerCase() }}
                  agregadas</q-item-section>
              </q-item>
            </q-list>

            <q-list v-else bordered separator dense>
              <template v-for="( item, key ) in   actividadesDesarrolladas " :key="key">
                <!-- Inicio Q-Editor para editar Actividades desarrolladas -->
                <q-item v-if="estaEditandoDesarrolladas && itemEditCampo == key" class="no-padding">
                  <q-item-section style="border: 1px solid rgba(0,0,0,0.5)">
                    <q-item-label class="bg-grey-5 q-px-md q-py-sm">
                      <div class="row justify-between">
                        <div class="text-body2"><b>Editar {{
                          obtenerSingular(formatoInforme.actividadesDesarrolladas.toLowerCase()) }}:</b></div>
                        <div>
                          <q-btn square flat size="sm" class="bg-red-5 text-white" dense
                            @click="cancelarEdicion">CANCELAR</q-btn>
                        </div>
                      </div>
                    </q-item-label>
                    <q-item-label class="no-margin">
                      <q-editor class="text-body2 shadow-0" square flat v-model="textEditarDesarrollada" min-height="4rem"
                        ref="editorRef" @paste="pegarEditor" :definitions="definitionsEditor" :toolbar="toolbarEditorEdit"
                        toolbar-toggle-color="blue-7" toolbar-bg="grey-5" content-class="bg-grey-3" />
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <!-- Fin Q-Editor para editar Actividades desarrolladas -->
                <q-item v-else class="no-padding">
                  <q-item-section avatar class="col-1">
                    <q-btn flat icon="mdi-chevron-up" color="grey-7" size="xs" round :disable="key == 0"
                      @click="cambiarPosicionItem(item, key + 1 - 1)">
                      <q-tooltip class="bg-indigo"> Subir </q-tooltip></q-btn>
                    <q-btn flat icon="mdi-chevron-down" color="grey-7" size="xs" round
                      :disable="key == actividadesDesarrolladas.length - 1"
                      @click="cambiarPosicionItem(item, key + 1 + 1)">
                      <q-tooltip class="bg-indigo"> Bajar </q-tooltip></q-btn>
                  </q-item-section>
                  <q-item-section class="col-1 text-bold">
                    <span>{{ item.orden + ". " }}</span>
                  </q-item-section>
                  <q-item-section class="q-my-sm">
                    <q-item-label class="text-weight-regular">
                      <span v-html="item.nombre"></span>
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side class="col-2">
                    <q-item-label>
                      <q-btn color="amber" flat round size="sm" icon="mdi-file-edit" @click="mostrarEditorEditar(item)">
                        <q-tooltip class="bg-indigo"> Editar </q-tooltip>
                      </q-btn>
                      <q-btn color="red" flat round size="sm" icon="mdi-trash-can" @click=" mostrarModalEliminar(item)">
                        <q-tooltip class="bg-indigo"> Eliminar </q-tooltip>
                      </q-btn>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-list>
          </q-tab-panel>
          <!-- FIN SECCION ACTIVIDADES DESARROLLADAS -->

          <!-- INICIO SECCION EVIDENCIA -->
          <q-tab-panel :name="formatoInforme.evidencias">
            <q-list bordered separator dense>
              <!-- Inicio Texto de entrada -->
              <q-expansion-item v-model="expansion_evidencias" dense group="somegroup" header-class="bg-grey-5"
                class="text-subtitle2" dense-toggle :label="'Agregar nuevas ' + formatoInforme.evidencias.toLowerCase()"
                icon="mdi-plus-box" :caption="expansion_evidencias ? '' : 'Expandir Aquí'">
                <q-item class="no-padding">
                  <q-item-section>
                    <q-item-label>
                      <q-editor square flat class="text-body2" v-model="textEvidencia" min-height="4rem" ref="editorRef"
                        @paste="pegarEditor" :definitions="definitionsEditor" :toolbar="toolbarEditor"
                        toolbar-toggle-color="blue-7" toolbar-bg="grey-5" content-class="bg-grey-3" />
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-expansion-item>
            </q-list>
            <!-- Fin Texto de entrada -->

            <!-- Inicio Lista EVIDENCIAS -->
            <q-toolbar class="bg-primary text-weight-bolder text-white q-mt-md q-py-xs" style="min-height: 35px;">
              <q-toolbar-title class="text-subtitle2 row justify-between text-bold">
                <span>
                  Lista de {{ formatoInforme.evidencias.toLowerCase() }}
                </span>
                <span>Total: {{ evidencias.length }}</span>
              </q-toolbar-title>
            </q-toolbar>

            <q-list v-if="evidencias.length == 0" bordered separator dense>
              <q-item>
                <q-item-section avatar><q-icon name="mdi-information" /></q-item-section>
                <q-item-section class="text-weight-light">Aun no tiene {{
                  formatoInforme.evidencias.toLowerCase() }}
                  agregadas</q-item-section>
              </q-item>
            </q-list>

            <q-list v-else bordered separator dense>
              <template v-for="( item, key ) in  evidencias " :key="key">

                <!-- Inicio Q-Editor para editar Evidencias -->
                <q-item v-if="estaEditandoEvidencias && itemEditCampo == key" class="no-padding">
                  <q-item-section style="border: 1px solid rgba(0,0,0,0.5)">
                    <q-item-label class="bg-grey-5 q-px-md q-py-sm">
                      <div class="row justify-between">
                        <div class="text-body2"><b>Editar {{
                          obtenerSingular(formatoInforme.evidencias.toLowerCase()) }}:</b></div>
                        <div>
                          <q-btn dense size="sm" square flat class="bg-red text-white"
                            @click="cancelarEdicion">CANCELAR</q-btn>
                        </div>
                      </div>
                    </q-item-label>
                    <q-item-label class="no-margin">
                      <q-editor square flat class="text-body2" v-model="textEditarEvidencia" min-height="4rem"
                        ref="editorRef" @paste="pegarEditor" :definitions="definitionsEditor" :toolbar="toolbarEditorEdit"
                        toolbar-toggle-color="blue-7" toolbar-bg="grey-5" content-class="bg-grey-3" />
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <!-- Fin Q-Editor para editar Evidencias -->

                <q-item v-else class="no-padding">
                  <q-item-section avatar class="col-1">
                    <q-btn flat icon="mdi-chevron-up" color="grey-7" size="xs" round :disable="key == 0"
                      @click="cambiarPosicionItem(item, key + 1 - 1)">
                      <q-tooltip class="bg-indigo"> Subir </q-tooltip></q-btn>
                    <q-btn flat icon="mdi-chevron-down" color="grey-7" size="xs" round
                      :disable="key == actividadesDesarrolladas.length - 1"
                      @click="cambiarPosicionItem(item, key + 1 + 1)">
                      <q-tooltip class="bg-indigo"> Bajar </q-tooltip></q-btn>
                  </q-item-section>
                  <q-item-section class="col-1 text-bold">
                    <span>{{ item.orden + ". " }}</span>
                  </q-item-section>
                  <q-item-section class="q-my-sm">
                    <q-item-label class="text-weight-regular">
                      <span v-html="item.nombre"></span>
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side class="col-2">
                    <q-item-label>
                      <q-btn color="amber" flat round size="sm" icon="mdi-file-edit" @click="mostrarEditorEditar(item)">
                        <q-tooltip class="bg-indigo"> Editar </q-tooltip>
                      </q-btn>
                      <q-btn color="red" flat round size="sm" icon="mdi-trash-can" @click=" mostrarModalEliminar(item)">
                        <q-tooltip class="bg-indigo"> Eliminar </q-tooltip>
                      </q-btn>
                    </q-item-label>
                  </q-item-section>
                </q-item>

              </template>
            </q-list>
            <!-- Fin Lista EVIDENCIAS -->
          </q-tab-panel>
          <!-- FIN SECCION EVIDENCIA -->

          <!-- INICIO SECCION OBSERVACIONES -->
          <q-tab-panel :name="formatoInforme.observaciones">
            <q-list bordered separator dense>
              <!-- Inicio Texto de entrada -->
              <q-expansion-item v-model="expansion_observaciones" dense group="somegroup" header-class="bg-grey-5"
                class="text-subtitle2" dense-toggle
                :label="'Agregar nuevas ' + formatoInforme.observaciones.toLowerCase()" icon="mdi-plus-box"
                :caption="expansion_observaciones ? '' : 'Expandir Aquí'">
                <q-item class="no-padding">
                  <q-item-section>
                    <q-item-label>
                      <q-editor square flat class="text-body2" v-model="textObservacion" min-height="4rem" ref="editorRef"
                        @paste="pegarEditor" :definitions="definitionsEditor" :toolbar="toolbarEditor"
                        toolbar-toggle-color="blue-7" toolbar-bg="grey-5" content-class="bg-grey-3" />
                    </q-item-label>
                  </q-item-section>

                </q-item>
              </q-expansion-item>
            </q-list>
            <!-- Fin Texto de entrada -->

            <!-- Inicio Lista OBSEVACIONES -->
            <q-toolbar class="bg-primary text-white q-mt-md q-py-xs" style="min-height: 35px;">
              <q-toolbar-title class="text-subtitle2 row justify-between text-bold">
                <span>
                  Lista de {{ formatoInforme.observaciones.toLowerCase() }}
                </span>
                <span>Total: {{ observaciones.length }}</span>
              </q-toolbar-title>
            </q-toolbar>

            <q-list v-if="observaciones.length == 0" bordered separator dense>
              <q-item>
                <q-item-section avatar><q-icon name="mdi-information" /></q-item-section>
                <q-item-section class="text-weight-light">Aun no tiene {{
                  formatoInforme.observaciones.toLowerCase() }}
                  agregadas</q-item-section>
              </q-item>
            </q-list>

            <q-list v-else bordered separator dense>
              <template v-for="( item, key ) in  observaciones " :key="key">

                <!-- Inicio Q-Editor editar OBSERVACIONES -->
                <q-item v-if="estaEditandoObservaciones && itemEditCampo == key" class="no-padding">
                  <q-item-section style="border: 1px solid rgba(0,0,0,0.5)">
                    <q-item-label class="bg-grey-5 q-px-md q-py-sm">
                      <div class="row justify-between">
                        <div class="text-body2"><b>Editar {{
                          obtenerSingular(formatoInforme.observaciones.toLowerCase()) }}:</b></div>
                        <div>
                          <q-btn dense size="sm" square flat class="bg-red text-white"
                            @click="cancelarEdicion">CANCELAR</q-btn>
                        </div>
                      </div>
                    </q-item-label>
                    <q-item-label class="no-margin">
                      <q-editor square flat class="text-body2" v-model="textEditarObservacion" min-height="4rem"
                        ref="editorRef" @paste="pegarEditor" :definitions="definitionsEditor" :toolbar="toolbarEditorEdit"
                        toolbar-toggle-color="blue-7" toolbar-bg="grey-5" content-class="bg-grey-3" />
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <!-- Fin Q-Editor editar OBSERVACIONES -->

                <!-- INICIO Listado de OBSEVACIONES -->
                <q-item v-else class="no-padding">
                  <q-item-section avatar class="col-1">
                    <q-btn flat icon="mdi-chevron-up" color="grey-7" size="xs" round :disable="key == 0"
                      @click="cambiarPosicionItem(item, key + 1 - 1)">
                      <q-tooltip class="bg-indigo"> Subir </q-tooltip></q-btn>
                    <q-btn flat icon="mdi-chevron-down" color="grey-7" size="xs" round
                      :disable="key == actividadesDesarrolladas.length - 1"
                      @click="cambiarPosicionItem(item, key + 1 + 1)">
                      <q-tooltip class="bg-indigo"> Bajar </q-tooltip></q-btn>
                  </q-item-section>
                  <q-item-section class="col-1 text-bold">
                    <span>{{ item.orden + ". " }}</span>
                  </q-item-section>
                  <q-item-section class="q-my-sm">
                    <q-item-label class="text-weight-regular">
                      <span v-html="item.nombre"></span>
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side class="col-2">
                    <q-item-label>
                      <q-btn color="amber" flat round size="sm" icon="mdi-file-edit" @click="mostrarEditorEditar(item)">
                        <q-tooltip class="bg-indigo"> Editar </q-tooltip>
                      </q-btn>
                      <q-btn color="red" flat round size="sm" icon="mdi-trash-can" @click=" mostrarModalEliminar(item)">
                        <q-tooltip class="bg-indigo"> Eliminar </q-tooltip>
                      </q-btn>
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <!-- FIN Listado de OBSEVACIONES -->

              </template>
            </q-list>
            <!-- Fin Lista OBSEVACIONES -->
          </q-tab-panel>
          <!-- FIN SECCION OBSERVACIONES -->
        </q-tab-panels>
      </q-card-section>
      <q-separator v-if="!$q.screen.xs"></q-separator>
      <q-card-actions v-if="!$q.screen.xs" style="display: flex; justify-content: flex-end;">
        <q-btn flat label="Cerrar" color="negative" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="modal_eliminar" persistent>
    <q-card style="max-width: 400px">
      <q-card-section style="display: flex; gap: 10px" class="items-center justify-between">
        <q-avatar icon="warning" color="warning" text-color="white" />
        <span>¿Está seguro que desea eliminar la <b>{{ obtenerSingular(tab_actividad.toLowerCase())
        }}</b>?
        </span>
      </q-card-section>
      <q-card-actions class="justify-end">
        <q-btn flat label="Cancelar" color="negative" v-close-popup
          @click=" modal_eliminar = false; item_eliminar = null" />
        <q-btn flat label="Si" color="primary" @click=" eliminar()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import desarrolladaController from "src/controller/desarrollada-controller";
import observacionController from "src/controller/observacion-controller";
import evidenciaController from "src/controller/evidencia-controller";
import DOMPurify from 'dompurify';
import { ref } from "vue";
import { watch } from "vue";
import { useQuasar } from "quasar";

const $q = useQuasar();
const modalVerActividadEspecifica = ref(false);
const tab_actividad = ref("actividadesdesarrolladas");
const definitionsEditor = {
  save: {
    tip: 'Guardar',
    icon: 'save',
    handler: guardar,
    label: 'Guardar',
    color: 'green-10',
  },
  format: {
    tip: 'Borrar',
    icon: 'mdi-close',
    label: 'Borrar',
    color: 'negative',
    handler: borrarEditor
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

const toolbarEditor = [['bold', 'italic', 'strike', 'underline'], ['link'], ['undo', 'redo'], [''], ['save', 'format']]
const toolbarEditorEdit = [['bold', 'italic', 'strike', 'underline'], ['link'], ['undo', 'redo'], [''], ['save']]

//Estas variables tendran la informacion de la actividad especifica
const actividadesDesarrolladas = ref([])
const observaciones = ref([])
const evidencias = ref([])

const itemClickable = ref(null);
const itemEditCampo = ref(null);

//Estas variables sirven para verificar si se esta editando cualquier de las 3
const estaEditandoDesarrolladas = ref(false)
const estaEditandoObservaciones = ref(false)
const estaEditandoEvidencias = ref(false)

//Estas variables guardan el texto que se esta editando
const textEditarEvidencia = ref('')
const textEditarDesarrollada = ref("")
const textEditarObservacion = ref('')

//Estas guardar el item con sus respectivos datos(_id, etc) que se esta editando
const evidenciaEditar = ref(null)
const desarrolladaEditar = ref(null)
const observacionEditar = ref(null)

//Esta variable sirve para controlar que solo se pueda pegar texto en el q-editor
const editorRef = ref(null)

//Estas variables sirven para guardar el texto que se esta escribiendo en los q-editor
const textEvidencia = ref("");
const textObservacion = ref("");
const textActividadDesarrollada = ref("");

//Esto sirve paras lista de expansion de los q-editor
const expansion_evidencias = ref(false)
const expansion_observaciones = ref(false)
const expansion_desarrolladas = ref(false)

const modal_eliminar = ref(false)
const item_eliminar = ref(null)

const props = defineProps({
  actividad: Object,
  formatoInforme: Object,
});

async function mostrarCamposActividad() {
  const dialog = generateDialog('Obteniendo información...')
  await obtenerEvidencias();
  await obtenerActividadesDesarrolladas()
  await obtenerObservaciones()
  tab_actividad.value = props.formatoInforme.actividadesDesarrolladas;
  modalVerActividadEspecifica.value = true;
  dialog.hide()
}

async function obtenerEvidencias() {
  await evidenciaController.obtenerEvidencias(props.actividad._id, async (res) => {
    if (res.status == 401) {
      generateMessage("NO OK", res.message);
      return router.push({ path: "/login" });
    }
    if (res.status == 403) {
      generateMessage("NO OK", res.message);
      return router.push({ path: "/" });
    }
    if (res.status != 200)
      return generateMessage(
        "NO OK",
        "Ocurrió un error al gestionar la actividad"
      );
    evidencias.value = res.data.evidencias
  });
}

async function obtenerActividadesDesarrolladas() {
  await desarrolladaController.obtenerDesarrolladas(props.actividad._id, async (res) => {
    if (res.status == 401) {
      generateMessage("NO OK", res.message);
      return router.push({ path: "/login" });
    }
    if (res.status == 403) {
      generateMessage("NO OK", res.message);
      return router.push({ path: "/" });
    }
    if (res.status != 200)
      return generateMessage(
        "NO OK",
        "Ocurrió un error al gestionar la actividad"
      );
    actividadesDesarrolladas.value = res.data.actividadesDesarrolladas
  });
}

async function obtenerObservaciones() {
  await observacionController.obtenerObservaciones(props.actividad._id, (res) => {
    if (res.status == 401) {
      generateMessage("NO OK", res.message);
      return router.push({ path: "/login" });
    }
    if (res.status == 403) {
      generateMessage("NO OK", res.message);
      return router.push({ path: "/" });
    }
    if (res.status != 200)
      return generateMessage(
        "NO OK",
        "Ocurrió un error al gestionar la actividad"
      );
    observaciones.value = res.data.observaciones
  });
}

function guardar() {
  if (estaEditandoDesarrolladas.value) return editarActividadDesarrollada()
  if (estaEditandoEvidencias.value) return editarEvidencia()
  if (estaEditandoObservaciones.value) return editarObservacion()
  if (tab_actividad.value == props.formatoInforme.actividadesDesarrolladas) return guardarActividadDesarrollada()
  if (tab_actividad.value == props.formatoInforme.evidencias) return guardarEvidencia()
  if (tab_actividad.value == props.formatoInforme.observaciones) return guardarObsevacion()
}

async function guardarEvidencia() {
  textEvidencia.value = sanitizarTexto(textEvidencia.value)
  if (textEvidencia.value == "") return generateMessage('NOOK', 'No se puede guardar texto vacio')
  let data = {
    actividadEspecifica: props.actividad._id,
    nombre: textEvidencia.value
  };
  const res = await evidenciaController.crearEvidencia(data);
  if (res.status == 401) { generateMessage("NO OK", res.message); return router.push({ path: "/login" }) }
  if (res.status == 403) { generateMessage("NO OK", res.message); return router.push({ path: "/" }) }
  if (res.status != 200) return generateMessage("NO OK", "Ocurrio un error al guardar la " + obtenerSingular(props.formatoInforme.evidencias))
  textEvidencia.value = "";
  generateMessage("OK", obtenerSingular(props.formatoInforme.evidencias) + " guardada");
  obtenerEvidencias()
}

async function guardarActividadDesarrollada() {
  textActividadDesarrollada.value = sanitizarTexto(textActividadDesarrollada.value)
  if (textActividadDesarrollada.value == "") return generateMessage('NOOK', 'No se puede guardar texto vacio')
  let data = {
    actividadEspecifica: props.actividad._id,
    nombre: textActividadDesarrollada.value
  };
  const res = await desarrolladaController.crearDesarrollada(data);
  if (res.status == 401) { generateMessage("NO OK", res.message); return router.push({ path: "/login" }) }
  if (res.status == 403) { generateMessage("NO OK", res.message); return router.push({ path: "/" }) }
  if (res.status != 200) return generateMessage("NO OK", "Ocurrio un error al guardar la " + obtenerSingular(props.formatoInforme.actividadesDesarrolladas))
  textActividadDesarrollada.value = "";
  generateMessage("OK", obtenerSingular(props.formatoInforme.actividadesDesarrolladas) + " guardada");
  obtenerActividadesDesarrolladas()
}

async function guardarObsevacion() {
  textObservacion.value = sanitizarTexto(textObservacion.value)
  if (textObservacion.value == "") return generateMessage('NOOK', 'No se puede guardar texto vacio')
  let data = {
    actividadEspecifica: props.actividad._id,
    nombre: textObservacion.value
  };
  const res = await observacionController.crearObservacion(data);
  if (res.status == 401) { generateMessage("NO OK", res.message); return router.push({ path: "/login" }) }
  if (res.status == 403) { generateMessage("NO OK", res.message); return router.push({ path: "/" }) }
  if (res.status != 200) return generateMessage("NO OK", "Ocurrio un error al guardar la " + obtenerSingular(props.formatoInforme.observaciones))
  textObservacion.value = "";
  generateMessage("OK", obtenerSingular(props.formatoInforme.observaciones) + " guardada");
  obtenerObservaciones()
}

function borrarEditor() {
  if (tab_actividad.value == props.formatoInforme.actividadesDesarrolladas) return textActividadDesarrollada.value = ''
  if (tab_actividad.value == props.formatoInforme.evidencias) return textEvidencia.value = ''
  if (tab_actividad.value == props.formatoInforme.observaciones) return textObservacion.value = ''
}

async function mostrarModalEliminar(item) {
  if (estaEditandoDesarrolladas.value || estaEditandoEvidencias.value || estaEditandoObservaciones.value) {
    return generateMessage("WARNING", "Aún se encuentra editando una " + obtenerSingular(tab_actividad.value.toLowerCase()))
  }
  item_eliminar.value = item
  modal_eliminar.value = true
}

async function eliminar() {
  if (tab_actividad.value == props.formatoInforme.actividadesDesarrolladas) return eliminarActividadDesarrollada()
  if (tab_actividad.value == props.formatoInforme.evidencias) return eliminarEvidencia()
  if (tab_actividad.value == props.formatoInforme.observaciones) return eliminarObservacion()
}

async function eliminarEvidencia() {
  await evidenciaController.eliminarEvidencia(item_eliminar.value._id, (res) => {
    if (res.status == 401) { generateMessage("NO OK", res.message); return router.push({ path: "/login" }) }
    if (res.status == 403) { generateMessage("NO OK", res.message); return router.push({ path: "/" }) }
    if (res.status != 200) return generateMessage("NO OK", "Ocurrió un error al eliminar la " + obtenerSingular(props.formatoInforme.evidencias.toLowerCase()))
    generateMessage('OK', obtenerSingular(props.formatoInforme.evidencias) + ' eliminada con éxito')
    item_eliminar.value = null
    modal_eliminar.value = false
    obtenerEvidencias()
  });
}

async function eliminarActividadDesarrollada() {
  await desarrolladaController.eliminarDesarrollada(item_eliminar.value._id, (res) => {
    if (res.status == 401) { generateMessage("NO OK", res.message); return router.push({ path: "/login" }) }
    if (res.status == 403) { generateMessage("NO OK", res.message); return router.push({ path: "/" }) }
    if (res.status != 200) return generateMessage("NO OK", "Ocurrió un error al eliminar la " + obtenerSingular(props.formatoInforme.actividadesDesarrolladas.toLowerCase()))
    generateMessage('OK', obtenerSingular(props.formatoInforme.actividadesDesarrolladas) + ' eliminada con éxito')
    item_eliminar.value = null
    modal_eliminar.value = false
    obtenerActividadesDesarrolladas()
  });
}

async function eliminarObservacion() {
  await observacionController.eliminarObservacion(item_eliminar.value._id, (res) => {
    if (res.status == 401) { generateMessage("NO OK", res.message); return router.push({ path: "/login" }) }
    if (res.status == 403) { generateMessage("NO OK", res.message); return router.push({ path: "/" }) }
    if (res.status != 200) return generateMessage("NO OK", "Ocurrió un error al eliminar la " + obtenerSingular(props.formatoInforme.observaciones.toLowerCase()))
    generateMessage('OK', obtenerSingular(props.formatoInforme.observaciones) + ' eliminada con éxito')
    item_eliminar.value = null
    modal_eliminar.value = false
    obtenerObservaciones()
  });
}

function mostrarEditorEditar(item) {
  if (estaEditandoDesarrolladas.value || estaEditandoEvidencias.value || estaEditandoObservaciones.value) return generateMessage("WARNING", "Aún se encuentra editando una " + obtenerSingular(tab_actividad.value.toLowerCase()))
  if (tab_actividad.value == props.formatoInforme.actividadesDesarrolladas) {
    estaEditandoDesarrolladas.value = true
    desarrolladaEditar.value = item
    textEditarDesarrollada.value = item.nombre
  }
  if (tab_actividad.value == props.formatoInforme.evidencias) {
    estaEditandoEvidencias.value = true
    evidenciaEditar.value = item
    textEditarEvidencia.value = item.nombre
  }
  if (tab_actividad.value == props.formatoInforme.observaciones) {
    estaEditandoObservaciones.value = true
    observacionEditar.value = item
    textEditarObservacion.value = item.nombre
  }
  itemEditCampo.value = item.orden - 1
  editorRef.value = null
}

async function editarActividadDesarrollada() {
  textEditarDesarrollada.value = sanitizarTexto(textEditarDesarrollada.value)
  await desarrolladaController.editarDesarrollada(desarrolladaEditar.value._id, { nombre: textEditarDesarrollada.value }, async (res) => {
    if (res.status == 401) {
      generateMessage("NO OK", res.message);
      return router.push({ path: "/login" });
    }
    if (res.status == 403) {
      generateMessage("NO OK", res.message);
      return router.push({ path: "/" });
    }
    if (res.status != 200)
      return generateMessage(
        "NO OK",
        "Ocurrió un error al editar la " + obtenerSingular(props.formatoInforme.actividadesDesarrolladas.toLowerCase())
      );
    generateMessage("OK", obtenerSingular(props.formatoInforme.actividadesDesarrolladas) + " editada con éxito");
    cancelarEdicion()
    await obtenerActividadesDesarrolladas()
  });
}

async function editarEvidencia() {
  textEditarEvidencia.value = sanitizarTexto(textEditarEvidencia.value)
  await evidenciaController.editarEvidencia(evidenciaEditar.value._id, { nombre: textEditarEvidencia.value }, async (res) => {
    if (res.status == 401) {
      generateMessage("NO OK", res.message);
      return router.push({ path: "/login" });
    }
    if (res.status == 403) {
      generateMessage("NO OK", res.message);
      return router.push({ path: "/" });
    }
    if (res.status != 200)
      return generateMessage(
        "NO OK",
        "Ocurrió un error al editar la " + obtenerSingular(props.formatoInforme.evidencias.toLowerCase())
      );
    generateMessage("OK", obtenerSingular(props.formatoInforme.evidencias) + " editada con éxito");
    cancelarEdicion()
    await obtenerEvidencias()
  });
}

async function editarObservacion() {
  textEditarObservacion.value = sanitizarTexto(textEditarObservacion.value)
  await observacionController.editarObservacion(observacionEditar.value._id, { nombre: textEditarObservacion.value }, async (res) => {
    if (res.status == 401) {
      generateMessage("NO OK", res.message);
      return router.push({ path: "/login" });
    }
    if (res.status == 403) {
      generateMessage("NO OK", res.message);
      return router.push({ path: "/" });
    }
    if (res.status != 200)
      return generateMessage(
        "NO OK",
        "Ocurrió un error al editar la " + obtenerSingular(props.formatoInforme.observaciones.toLowerCase())
      );
    generateMessage("OK", obtenerSingular(props.formatoInforme.observaciones) + " editada con éxito");
    cancelarEdicion()
    await obtenerObservaciones()
  });
}

function cancelarEdicion() {
  if (tab_actividad.value == props.formatoInforme.actividadesDesarrolladas) {
    estaEditandoDesarrolladas.value = false
    desarrolladaEditar.value = null
    textEditarDesarrollada.value = ""
  }
  if (tab_actividad.value == props.formatoInforme.evidencias) {
    estaEditandoEvidencias.value = false
    evidenciaEditar.value = null
    textEditarEvidencia.value = ""
  }
  if (tab_actividad.value == props.formatoInforme.observaciones) {
    estaEditandoObservaciones.value = false
    observacionEditar.value = null
    textEditarObservacion.value = ""
  }
  itemEditCampo.value = null
}

async function cambiarPosicionItem(item, nuevaPosicion) {
  if (estaEditandoDesarrolladas.value || estaEditandoEvidencias.value || estaEditandoObservaciones.value) {
    return generateMessage("WARNING", "Aún se encuentra editando una " + obtenerSingular(tab_actividad.value.toLowerCase()))
  }
  const data = {
    orden: nuevaPosicion,
  };
  switch (tab_actividad.value) {
    case props.formatoInforme.actividadesDesarrolladas:
      await desarrolladaController.editarDesarrollada(item._id, data);
      obtenerActividadesDesarrolladas()
      break;
    case props.formatoInforme.evidencias:
      await evidenciaController.editarEvidencia(item._id, data);
      obtenerEvidencias()
      break;
    case props.formatoInforme.observaciones:
      await observacionController.editarObservacion(item._id, data);
      obtenerObservaciones()
      break;
  }
}

function sanitizarTexto(texto) {
  texto = texto.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
  texto = texto.replace(/(<div><br><\/div>){2,}/g, "<div><br></div>");
  texto = DOMPurify.sanitize(texto)
  texto = texto.replaceAll("&nbsp;", " ")
  return texto.trim()
}

function estaEditando(_event) {
  if (estaEditandoDesarrolladas.value) {
    if (tab_actividad.value == props.formatoInforme.actividadesDesarrolladas) return
    tab_actividad.value = props.formatoInforme.actividadesDesarrolladas
  }
  if (estaEditandoEvidencias.value) {
    if (tab_actividad.value == props.formatoInforme.evidencias) return
    tab_actividad.value = props.formatoInforme.evidencias
  }
  if (estaEditandoObservaciones.value) {
    if (tab_actividad.value == props.formatoInforme.observaciones) return
    tab_actividad.value = props.formatoInforme.observaciones
  }
  if (estaEditandoDesarrolladas.value || estaEditandoEvidencias.value || estaEditandoObservaciones.value) {
    return generateMessage("WARNING", "Aún se encuentra editando una " + obtenerSingular(tab_actividad.value.toLowerCase()))
  }
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


function obtenerSingular(texto) {
  return texto
}

function formatearTodo() {
  expansion_desarrolladas.value = false
  expansion_evidencias.value = false
  expansion_observaciones.value = false
  textEvidencia.value = '';
  textObservacion.value = '';
  textActividadDesarrollada.value = '';
}

//Escucha cuando el docente cambia de actividad especifica
watch(
  () => props.actividad,
  (_) => {
    if (props.actividad != null) {
      formatearTodo()
      cancelarEdicion()
      mostrarCamposActividad();
    }
  }
);

</script>


<style lang="scss">
.card-gestionar-actividad {
  height: 70vh;
  max-height: 60vh;
}

@media (max-width: $breakpoint-xs-max) {
  .card-gestionar-actividad {
    height: 80vh;
    max-height: 80vh;
  }
}
</style>
