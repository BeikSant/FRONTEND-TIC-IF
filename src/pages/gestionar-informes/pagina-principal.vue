<template>
  <q-card class="q-ma-md" square flat bordered>

    <q-card-section class="bg-primary text-white row items-center justify-between">
      <span class="col-6 text-bold text-h6">Periodo Académico:
        <span class="text-weight-light" v-if="!existePeriodo">NO DISPONIBLE</span>
        <span class="text-weight-light" v-else>{{ periodo.nombre }}</span>
      </span>
      <div v-if="noActividades == false && existePeriodo && !estaCargandoInformacion" class="column q-gutter-xs col-auto">
        <q-btn :disabled="tab.length == 0" size="sm" color="positive" @click="descargarPDF()">Generar
          Informe</q-btn>
        <q-btn :disabled="tab.length == 0" size="sm" color="pink"
          @click="informe.documento_firma_docente == null ? modalEnviarInforme = true : modalAdvertenciaInforme = true">Enviar
          informe</q-btn>
      </div>
    </q-card-section>

    <q-card-section class="no-padding no-margin" style="min-height: 150px">
      <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <div v-show="existePeriodo" class="no-padding no-margin">

          <q-tabs v-if="formatoInforme != null" v-model="tabPrincipal" indicator-color="white"
            active-class="text-white q-mt-none" dense class="bg-primary text-grey-6" inline-label outside-arrows
            mobile-arrows>
            <q-tab name="Actividades" :label="formatoInforme.actividadesDistributivo"
              style=" white-space: break-spaces;" />
            <q-tab name="Conclusiones" :label="formatoInforme.conclusiones" style=" white-space: break-spaces;" />
          </q-tabs>

          <q-tab-panels v-if="formatoInforme != null" v-model="tabPrincipal" keep-alive>
            <q-tab-panel name="Actividades" class="q-pa-md bg-blue-1">
              <q-card-section class="no-padding no-margin" style="min-height: 150px">
                <div v-show="existenDatosTabla" class="no-padding no-margin">

                  <q-tabs indicator-color="white" v-model="tab" active-class="text-white" dense
                    class="bg-primary text-grey-6" inline-label outside-arrows mobile-arrows>
                    <q-tab v-for="(actividades, index) in actividadesEspecificas" :key="index"
                      :label="actividades.funcionSustantiva.nombre" :name="actividades.funcionSustantiva.nombre" />
                  </q-tabs>

                  <q-tab-panels v-model="tab" animated>
                    <q-tab-panel class="no-padding no-margin" v-for="(actividades, index) in actividadesEspecificas"
                      :key="index" :name="actividades.funcionSustantiva.nombre">
                      <q-table square bordered :columns="headers" :rows="actividades.actividadesEspecificas"
                        row-key="name" separator="cell" flat
                        :no-data-label="'Aún no posee actividades en esta función sustantiva'"
                        :pagination="{ rowsPerPage: 10 }" :rows-per-page-options="[5, 10, 0]"
                        rows-per-page-label="Resultados por página" :dense="$q.screen.lt.md" :grid="$q.screen.xs"
                        no-results-label="No hay ningún resultado">
                        <template v-slot:top>
                          <div class="row justify-between items-center full-width">
                            <span class="text-subtitle1 text-bold text-uppercase">Lista de Actividades</span>
                            <q-btn v-if="noActividades == false" @click="nuevaActividadForm" size="sm" color="blue-7"
                              style="color: white">Nueva
                              Actividad</q-btn>
                          </div>
                        </template>

                        <template v-slot:body-cell-acciones="props">
                          <q-td :props="props" class="q-gutter-x-xs" auto-width>
                            <span>
                              <q-btn size="sm" color="positive" round dense icon="mdi-folder-edit"
                                @click="mostrarCamposActividad(props.row)" />
                              <q-tooltip :offset="[10, 10]" class="bg-indigo">
                                Gestionar actividad
                              </q-tooltip>
                            </span>
                            <span>
                              <q-btn size="sm" color="warning" round dense @click="editarActividadForm(props.row)"
                                icon="mdi-file-document-edit" />
                              <q-tooltip :offset="[10, 10]" class="bg-indigo">
                                Editar información
                              </q-tooltip>
                            </span>
                            <span v-if="!props.row.requerido">
                              <q-btn size="sm" color="negative" round dense
                                @click="confirmacionEliminarActividad(props.row)" icon="mdi-delete" />
                              <q-tooltip :offset="[10, 10]" class="bg-indigo">
                                Eliminar actividad
                              </q-tooltip>
                            </span>
                          </q-td>
                        </template>

                        <template v-slot:body-cell-horas="props">
                          <q-td :props="props" auto-width>
                            <q-chip size="sm" square :color="props.row.horas != 0 ? 'indigo-5' : 'red-5'"
                              text-color="white" :label="props.row.horas" />
                          </q-td>
                        </template>

                        <template v-slot:body-cell-actividadDesarrollada="props">
                          <q-td :props="props" auto-width>
                            <q-chip size="sm" square :color="props.row.actividadDesarrollada != 0 ? 'green-5' : 'red-5'"
                              text-color="white" :label="props.row.actividadDesarrollada" />
                          </q-td>
                        </template>

                        <template v-slot:body-cell-evidencia="props">
                          <q-td :props="props" auto-width>
                            <q-chip size="sm" square :color="props.row.evidencia != 0 ? 'green-5' : 'red-5'"
                              text-color="white" :label="props.row.evidencia" />
                          </q-td>
                        </template>

                        <template v-slot:body-cell-observacion="props">
                          <q-td :props="props" auto-width>
                            <q-chip size="sm" square :color="props.row.observacion != 0 ? 'green-5' : 'red-5'"
                              text-color="white" :label="props.row.observacion" />
                          </q-td>
                        </template>

                        <template v-slot:item="props">
                          <div class="q-pa-xs grid-estilo">
                            <q-card bordered flat>
                              <q-list dense>
                                <q-item v-for="col in props.cols" :key="col.name">
                                  <q-item-section class="col-12 q-mb-xs q-mt-xs">
                                    <q-item-label class="text-bold" caption>{{ col.label }}</q-item-label>

                                    <q-item-label v-if="col.name == 'acciones'" class="row q-gutter-x-xs">
                                      <span>
                                        <q-btn size="sm" color="positive" round dense icon="mdi-folder-edit"
                                          @click="mostrarCamposActividad(props.row)" />
                                        <q-tooltip :offset="[10, 10]" class="bg-indigo">
                                          Gestionar actividad
                                        </q-tooltip>
                                      </span>
                                      <span>
                                        <q-btn size="sm" color="warning" round dense
                                          @click="editarActividadForm(props.row)" icon="mdi-file-document-edit" />
                                        <q-tooltip :offset="[10, 10]" class="bg-indigo">
                                          Editar información
                                        </q-tooltip>
                                      </span>
                                      <span v-if="!props.row.requerido">
                                        <q-btn size="sm" color="negative" round dense
                                          @click="confirmacionEliminarActividad(props.row)" icon="mdi-delete" />
                                        <q-tooltip :offset="[10, 10]" class="bg-indigo">
                                          Eliminar actividad
                                        </q-tooltip>
                                      </span>
                                    </q-item-label>

                                    <q-item-label v-else-if="col.name == 'horas'">
                                      <q-chip size="sm" square :color="props.row.horas != 0 ? 'indigo-5' : 'red-5'"
                                        text-color="white" :label="props.row.horas" />
                                    </q-item-label>

                                    <q-item-label v-else-if="col.name == 'evidencia'">
                                      <q-chip size="sm" square :color="props.row.evidencia != 0 ? 'green-5' : 'red-5'"
                                        text-color="white" :label="props.row.evidencia" />
                                    </q-item-label>

                                    <q-item-label v-else-if="col.name == 'observacion'">
                                      <q-chip size="sm" square :color="props.row.observacion != 0 ? 'green-5' : 'red-5'"
                                        text-color="white" :label="props.row.observacion" />
                                    </q-item-label>

                                    <q-item-label v-else-if="col.name == 'actividadDesarrollada'">
                                      <q-chip size="sm" square
                                        :color="props.row.actividadDesarrollada != 0 ? 'green-5' : 'red-5'"
                                        text-color="white" :label="props.row.actividadDesarrollada" />

                                    </q-item-label>

                                    <q-item-label v-else>{{ col.value }}
                                    </q-item-label>
                                  </q-item-section>
                                </q-item>
                              </q-list>
                            </q-card>
                          </div>
                        </template>

                      </q-table>
                    </q-tab-panel>
                  </q-tab-panels>

                </div>
              </q-card-section>
            </q-tab-panel>
            <!-- CONCLUSIONES Y O RECOMENDACIONES-->
            <q-tab-panel name="Conclusiones" class="q-pa-xs bg-blue-1">

              <keep-alive>
                <CompConclusiones :formatoInforme="formatoInforme" :informe="informe"></CompConclusiones>
              </keep-alive>
            </q-tab-panel>
            <!-- FIN CONCLUSIONES Y O RECOMENDACIONES-->
          </q-tab-panels>
          <CompObservaciones :formatoInforme="formatoInforme" :actividad="actividadEspecifica"></CompObservaciones>
        </div>
      </transition>
      <q-inner-loading :showing="estaCargandoInformacion" label="Cargando información..." label-class="text-teal"
        label-style="font-size: 1.1em" />
    </q-card-section>
    <!-- DIALOG DE CAMPOS ACTIVIDAD ESPECIFICA-->

    <q-dialog v-model="form_actividad" persistent square>
      <q-card>
        <q-card-section class="bg-primary text-h6 text-bold text-white">
          <span>{{ titulo_form }}</span>
          <span v-if="!editarActividad">
            {{ tab }}
          </span>
        </q-card-section>
        <q-separator />
        <q-form @submit="guardarFormActividad">
          <q-card-section style="max-height: 50vh" class="scroll row q-col-gutter-y-lg q-col-gutter-x-md">

            <q-select class="col-6" outlined square v-model="selected" :options="selectActividades" label="Codificación"
              :rules="[
                val => (val && val.length > 0) || 'Selecciona una opción']"
              :disable="editarActividad && actividadEspecificaEditar.requerido"
              hint="Seleccione la codificación de la actividad" />

            <q-input class="col-6" outlined square type="number" v-model="horas_actividad" label="Horas" lazy-rules
              :rules="[
                val => (val !== null && val !== '') || 'Completa este campo',
                val => val > 0 || 'El número de horas debe ser mayor a 0']" hint="Ingrese el numero de horas">
              <template v-slot:append>
                <q-icon name="mdi-clock" />
              </template>
            </q-input>

            <q-input class="col-12" outlined square v-model="nombre_actividad" label="Nombre Actividad"
              :hint="selected + ' - ' + nombre_actividad" lazy-rules autogrow
              :rules="[val => (val && val.length > 0) || 'Completa este campo']" />

          </q-card-section>
          <q-separator />
          <q-card-actions class="justify-end">
            <q-btn label="Cancelar" @click="resetForm" flat color="negative" />
            <q-btn label="Guardar" type="submit" color="positive" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="confirm_delete" persistent>
      <EliminarActividad :function="eliminarActividad" :actividadEliminar="actividadEliminar.nombre" />
    </q-dialog>

    <q-dialog v-model="noActividades" persistent square>
      <q-card>
        <q-card-section class="text-h6 bg-primary text-white">
          <b>Cargar Planificación de Carga Horaria Docente</b>
        </q-card-section>

        <q-card-section v-if="isCargarActividades" style="max-height: 60vh;" class="scroll q-gutter-y-md">
          <q-banner dense class="bg-indigo-1 text-justify">
            <template v-slot:avatar>
              <q-icon name="mdi-information" color="primary" />
            </template>
            <span class="text-caption">
              Verificar que las actividades obtenidas son correctas, ya que una vez guardadas estas no se podrán
              eliminar.</span>
          </q-banner>
          <q-toolbar class="bg-primary text-weight-bolder text-white" style="min-height: 35px;">
            <q-toolbar-title class="text-subtitle2 row justify-between text-bold">
              <span>Lista de actividades obtenidas</span>
              <span>Total: {{ actividadesPDF.length }}</span>
            </q-toolbar-title>
          </q-toolbar>
          <q-list dense bordered separator class="q-mt-none">
            <q-item v-for="(item, index) in actividadesPDF" :key="index" v-ripple>
              <q-item-section>
                <q-item-label caption class="text-black">{{ item.nombre }} </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-section v-else class="q-gutter-y-md">
          <q-banner dense class="bg-indigo-1 text-justify">
            <template v-slot:avatar>
              <q-icon name="mdi-information" color="primary" />
            </template>
            <span class="text-caption">
              Antes de empezar a gestionar el informe final debe cargar su <b>planificación de carga horaria
                docente del SIAAF</b></span>
          </q-banner>
          <q-banner dense class="bg-indigo-1 text-justify">
            <template v-slot:avatar>
              <q-icon name="mdi-information" color="primary" />
            </template>
            <span class="text-caption">
              Verificar que la codificación de la planificación de carga horaria docente coincida con la del <q-btn dense
                flat color="primary" no-caps rounded to="/distributivo">Distributivo General.</q-btn> <b>(ej: 'AD 1')</b>.
              Sino comunicar al DIRECTOR.
            </span>
          </q-banner>
          <q-input outlined square @update:model-value="val => obtenerDatosPdf(val[0])" type="file" dense
            class="bg-grey-4 full-width" style="width: 98%;" />
        </q-card-section>

        <q-separator></q-separator>

        <q-card-actions class="justify-between">
          <q-btn v-if="isCargarActividades" dense label="Volver" color="primary q-mr-xs" flat icon="mdi-arrow-left"
            @click="{ isCargarActividades = false; actividadesPDF = [] }" />
          <div class="q-gutter-x-xs">
            <q-btn flat label="Cancelar" color="negative" v-close-popup to="/" />
            <q-btn dense v-if="isCargarActividades" @click="guardarActividadesPDF()" color="positive">Guardar</q-btn>
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modalEnviarInforme" persistent="">
      <q-card style="width: 450px">
        <q-card-section class="text-h6 bg-primary text-white">
          <b>Enviar informe final</b>
        </q-card-section>
        <q-card-section class="q-pa-xs">
          <q-banner dense class="bg-blue-3 q-pa-none q-ma-xs">
            <div class="row justify-center">
              <div class="col-1 self-center text-center">
                <q-icon name="warning" class="q-ml-xs" />
              </div>
              <div class="col-11 q-pa-sm">
                <p class="text-caption text-weight-light text-justify	q-mb-none">
                  Envíe el informe final generado y firmado por usted, para que el Director pueda aprobarlo y
                  firmarlo.
                </p>
              </div>
            </div>
          </q-banner>
          <div class="column items-center q-my-md">
            <q-input @update:model-value="val => { informeUpload = val[0] }" type="file" dense class="bg-grey-5 q-px-md"
              style="width: 98%;" />
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
              <span>Usted ya ha enviado un informe final en el periodo <b>{{ periodo.nombre }}</b> ¿Está
                seguro que desea reemplazarlo?
              </span>
            </div>
          </div>
        </q-card-section>
        <q-card-actions style="display: flex; justify-content: flex-end;">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn flat label="Si" color="primary" @click=" modalEnviarInforme = true" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>


    <q-dialog v-model="modalInformeEnviado" persistent>
      <q-card style="max-width: 400px">
        <q-card-section style="display: flex; gap: 20px" class="items-center justify-between q-pb-xs">
          <q-avatar icon="mdi-check-circle-outline" color="green" text-color="white" />
          <span class="text-justify">
            Se ha notificado al Director del envío de su informe final. Para ver el estado y seguimiento del
            mismo, dirígase a la sección: <q-btn rounded flat no-caps size="md" dense class="text-primary text-bold"
              to="/informe/registro">Ver Registro de Informes</q-btn>
          </span>
        </q-card-section>
        <q-card-actions class="justify-end">
          <q-btn flat label="Cerrar" color="negative" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup>
import CompConclusiones from "./components/comp-conclusiones.vue";
import EliminarActividad from "./components/eliminar-actividad.vue";
import CompObservaciones from "./components/comp-gestionar-actividad.vue";
import { ref } from "vue";
import { useQuasar } from "quasar";
import generarPDF from "src/utils/generar-pdf";
import periodoController from "src/controller/periodo-controller";
import informeController from "src/controller/informe-controller";
import especificaController from "src/controller/especifica-controller";
import { useRouter } from "vue-router";
import distributivo from "src/controller/distributivo";
import formatoController from "src/controller/formato-controller";
import planificacionDocente from "src/utils/planificacionDocente";
import notificacionController from "src/controller/notificacion-controller";
import { useUserStore } from "src/stores/user-store";

const tabPrincipal = ref('Actividades')
const uploadOk = ref(false);
const isCargarActividades = ref(false);
const actividadesPDF = ref([]);
const existePeriodo = ref(false)
const userStore = useUserStore()
const router = useRouter();

const existenDatosTabla = ref(false);

const tieneActividades = ref(false);
const estaCargandoInformacion = ref(true); // Animacion de cargando informacion

const noActividades = ref(false); //Cuando el usuario tiene actividades del distributivo
const modalEnviarInforme = ref(false)
const informeUpload = ref(null)
const modalAdvertenciaInforme = ref(false)

const actividadEspecificaEditar = ref(null);
const actividadEliminar = ref(null);
const confirm_delete = ref(false);
const $q = useQuasar();
const modalInformeEnviado = ref(false)

const titulo_form = ref("");
const editarActividad = ref(false);
const selected = ref("");
const nombre_actividad = ref("");
const horas_actividad = ref(0);

const selectActividades = ref([]);
const formatoInforme = ref(null);
const periodo = ref(null); //Para inicializar el template
const informe = ref(null);
const funcionesSustantivas = ref([]);
const actividadesEspecificas = ref([]);
const tab = ref([]);
const form_actividad = ref(false);
const headers = [
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
    field: "actividadDesarrollada",
    align: "center",
    style: "max-width: 20px; white-space: break-spaces;",
  },
  {
    name: "evidencia",
    label: "EVIDENCIAS",
    sortable: false,
    field: "evidencia",
    align: "center",
  },
  {
    name: "observacion",
    label: "OBSERVACIONES",
    sortable: false,
    field: "observacion",
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

const actividadEspecifica = ref(null);

const obtenerUltimoPeriodo = async () => {
  return periodoController.obtenerUltimoPeriodo(async (res) => {
    if (res.status != 200) {
      generateMessage("NO OK", res.message);
      if (res.status == 401) return router.push({ path: "/login" })
      if (res.status == 403) return router.push({ path: "/" })
      return false
    }
    return res.data.periodo
  });
};

const obtenerInformePorPeriodo = async () => {
  return await informeController.obtenerInformePeriodo(
    periodo.value._id,
    async (res) => {
      if (res.status != 200) {
        generateMessage("NO OK", res.message);
        if (res.status == 401) return router.push({ path: "/login" })
        if (res.status == 403) return router.push({ path: "/" })
        return false
      }
      return res.data.informeFinal;
    }
  );
};

//Obtienes las funciones sustantivas con sus
//actividades del distributivo general
const obtenerActividadesDistributivo = async () => {
  return distributivo.obtenerTodasActividades(async (res) => {
    if (res.status != 200) {
      generateMessage("NO OK", res.message);
      if (res.status == 401) return router.push({ path: "/login" })
      if (res.status == 403) return router.push({ path: "/" })
      return false
    }
    return res.data.actividades.funcionesSustantivas;
  });
};

const obtenerActividadesInforme = async () => {
  return await especificaController.obtenerActividadesPorInforme(informe.value._id,
    (res) => {
      if (res.status != 200) {
        generateMessage("NO OK", res.message);
        if (res.status == 401) return router.push({ path: "/login" })
        if (res.status == 403) return router.push({ path: "/" })
        return false
      }
      return res.data.actividadesEspecificas
    }
  )
}

const obtenerFormatoInforme = async () => {
  return formatoController.obtenerInformeActivo((res) => {
    if (res.status != 200) {
      generateMessage("NO OK", res.message);
      if (res.status == 401) return router.push({ path: "/login" })
      if (res.status == 403) return router.push({ path: "/" })
      return false
    }
    return res.data;
  });
};

function confirmacionEliminarActividad(actividad) {
  actividadEliminar.value = actividad;
  confirm_delete.value = true;
}

async function eliminarActividad() {
  const dialogo = generateDialog('Eliminando Actividad')
  confirm_delete.value = false;
  await especificaController.eliminarActividad(
    actividadEliminar.value._id,
    async (res) => {
      if (res.status != 200) {
        dialogo.hide()
        generateMessage("NO OK", res.message);
        if (res.status == 401) return router.push({ path: "/login" })
        if (res.status == 403) return router.push({ path: "/" })
        return
      }
      actividadesEspecificas.value = actividadesEspecificas.value.map(fs => {
        return {
          funcionSustantiva: fs.funcionSustantiva,
          actividadesEspecificas: fs.actividadesEspecificas.filter(ae =>
            ae._id != actividadEliminar.value._id)
        }
      })
      actividadEliminar.value = null;
      dialogo.hide()
      generateMessage("OK", res.data.message);
    }
  );
}

function selectedActividadDistributivo() {
  selectActividades.value = [];
  const fs = funcionesSustantivas.value.filter(
    (fun) => fun.nombre == tab.value
  );
  for (let i = 0; i < fs[0].actividadesDistributivo.length; i++) {
    selectActividades.value.push(fs[0].actividadesDistributivo[i].sigla);
  }
}

async function nuevaActividadForm() {
  await resetForm();
  selectedActividadDistributivo();
  titulo_form.value = "Nueva Actividad De ";
  form_actividad.value = true;
}

async function editarActividadForm(actividad) {
  resetForm();
  selectedActividadDistributivo();
  titulo_form.value = "Editar Actividad";
  editarActividad.value = true;
  selected.value = actividad.nombre.split(" - ")[0];
  if (actividad.requerido) selectActividades.value = selectActividades.value.filter((ad) => ad.sigla == selected.value)
  nombre_actividad.value = actividad.nombre.substring(
    selected.value.length + 3,
    actividad.nombre.length
  );
  horas_actividad.value = actividad.horas;
  form_actividad.value = true;
  actividadEspecificaEditar.value = actividad;
}

async function guardarFormActividad() {
  const dialogo = generateDialog('Guardando Actividad...')
  let actividad = {
    nombre: selected.value + " - " + nombre_actividad.value,
    horas: Number(horas_actividad.value),
  };
  const fs = funcionesSustantivas.value.filter(fun => fun.nombre == tab.value);
  const actividadDis = fs[0].actividadesDistributivo.filter(act => act.sigla == selected.value);
  let res = null
  if (editarActividad.value) {
    if (selected.value != actividadEspecificaEditar.value.actividadDistributivo.sigla) {
      actividad.actividadesDistributivo = actividadDis[0]._id;
    }
    res = await especificaController.editarActividad(actividadEspecificaEditar.value._id, actividad);
  } else {
    actividad.requerido = false
    res = await especificaController.crearActividad(informe.value._id, actividadDis[0]._id, actividad);
  }
  if (res.status != 200) {
    dialogo.hide()
    generateMessage("NO OK", res.message);
    if (res.status == 401) return router.push({ path: "/login" })
    if (res.status == 403) return router.push({ path: "/" })
    return
  }

  if (!editarActividad.value) {
    let ae = res.data.actividadEspecifica
    actividadesEspecificas.value.forEach(ac => {
      if (ac.funcionSustantiva._id == ae.actividadDistributivo.funcionSustantiva._id) {
        ae.evidencia = 0
        ae.actividadDesarrollada = 0
        ae.observacion = 0
        ac.actividadesEspecificas.push(ae)
      }
    });
  } else {

  }
  //const aeRequest = await obtenerActividadesInforme()
  //formatearArrayActividades(aeRequest)

  resetForm();
  generateMessage("OK", res.data.message);
  dialogo.hide()
}

async function resetForm() {
  form_actividad.value = false;
  editarActividad.value = false;
  actividadEspecificaEditar.value = null;
  nombre_actividad.value = "";
  horas_actividad.value = 0;
  selected.value = "";
  selectActividades.value = [];
}

async function mostrarCamposActividad(actividad) {
  actividadEspecifica.value = null
  setTimeout(() => {
    actividadEspecifica.value = actividad;
  }, 50);
}

async function obtenerDatosPdf(file) {
  if (file == null) return
  if (file.type != "application/pdf") return generateMessage("NO OK", "Solo se adminten documentos .pdf");
  if (file.size > 5000000) return generateMessage("NO OK", "Solo se adminten documentos con tamaño menores a 2MB");

  const dialog = generateDialog('Obteniendo actividades')
  uploadOk.value = true;
  actividadesPDF.value = await planificacionDocente.obtenerActividadPdf(file);
  if (actividadesPDF.value.length == 0) {
    dialog.hide()
    uploadOk.value = false;
    return generateMessage("NO OK", "No se encontró ninguna actividad en el documento");
  }
  isCargarActividades.value = true;
  dialog.hide()
}

async function guardarActividadesPDF() {
  const dialog = generateDialog('Guardando actividades')
  for (let i = 0; i < actividadesPDF.value.length; i++) {
    const actividad = {
      nombre: actividadesPDF.value[i].nombre,
      horas: actividadesPDF.value[i].horas,
      requerido: true,
    };
    await especificaController.crearActividad(
      informe.value._id,
      actividadesPDF.value[i].actividadDistributivo,
      actividad,
      async (res) => {
        if (res.status != 200) {
          return generateMessage(
            "NO OK",
            "Ocurrió un error al guardar la actividad" +
            actividadesPDF.value[i].nombre.split(" - ")[0]
          );
        }
      }
    );
  }
  const aeRequest = await obtenerActividadesInforme()
  noActividades.value = false;
  formatearArrayActividades(aeRequest)
  dialog.hide()
}

async function enviarInforme() {
  const dialog = $q.dialog({
    message: 'Enviando informe...',
    progress: true,
    persistent: true,
    ok: false
  })
  if (informeUpload.value == null) return generateMessage("WARNING", "Aún no ha seleccionado ningún archivo")
  const formData = new FormData()
  formData.append('firmado_por', 'docente')
  formData.append('myFile', informeUpload.value)
  await informeController.guardarInforme(formData, async (res) => {
    if (res.status != 200) {
      dialog.hide()
      generateMessage("NO OK", res.message);
      if (res.status == 401) return router.push({ path: "/login" })
      if (res.status == 403) return router.push({ path: "/" })
      return existenDatosTabla.value = true
    }
    informeUpload.value = null
    modalEnviarInforme.value = false
    const data = {
      mensaje: 'ha enviado el informe final firmado, para que lo apruebe, firme y reenvíe nuevamente.',
    }
    if (userStore.user.usuario.rol.nombre.toLowerCase() == 'director') {
      dialog.hide()
      return modalInformeEnviado.value = true
    } else {
      await notificacionController.guardarNotificacion(data, res => {
        setTimeout(() => {
          dialog.hide()
        }, 350)
        if (res.status != 200) return generateMessage("NO OK", "Ocurrió un error al notificar al docente");
        modalInformeEnviado.value = true
      })
    }
  })
}

async function descargarPDF() {
  for (const fs of actividadesEspecificas.value) {
    for (const actividad of fs.actividadesEspecificas) {
      if (actividad.horas == 0) return generateMessage("NOOK", "Existen actividades que no poseen horas")
    }
  }
  const dialog = $q.dialog({
    message: 'Generando informe...',
    progress: true, // we enable default settings
    persistent: true, // we want the user to not be able to close it
    ok: false // we want the user to not be able to close it
  })
  await generarPDF.generarPDF(
    informe.value._id,
    actividadesEspecificas.value,
    periodo.value.nombre
  );
  dialog.hide()
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

function generateDialog(message) {
  return $q.dialog({
    message: message,
    progress: true,
    persistent: true,
    ok: false
  })
}

function formatearArrayActividades(aeRequest) {
  actividadesEspecificas.value = funcionesSustantivas.value.map(fs => {
    return {
      funcionSustantiva: {
        _id: fs._id,
        nombre: fs.nombre
      },
      actividadesEspecificas: aeRequest.filter(ae =>
        ae.actividadDistributivo.funcionSustantiva._id == fs._id)
    }
  })
}

async function cargarData() {
  periodo.value = await obtenerUltimoPeriodo()
  if (periodo.value != false) {
    existePeriodo.value = true
    informe.value = await obtenerInformePorPeriodo()
    if (informe.value == false) {
      return estaCargandoInformacion.value = false
    }

    funcionesSustantivas.value = await obtenerActividadesDistributivo()
    if (funcionesSustantivas.value == false) {
      existePeriodo.value = false
      generateMessage('NOOK', 'Aún no se ha cargado el distributivo general')
      return estaCargandoInformacion.value = false
    }
    tab.value = funcionesSustantivas.value[0].nombre
    formatoInforme.value = await obtenerFormatoInforme()
    if (formatoInforme.value == false) {
      formatoInforme.value = null
      return estaCargandoInformacion.value = false
    }
    const aeRequest = await obtenerActividadesInforme()
    if (aeRequest.length == 0) {
      noActividades.value = true
    } else {
      tieneActividades.value = true
      noActividades.value = false
    }
    formatearArrayActividades(aeRequest)
    existenDatosTabla.value = true
  } else {
    existePeriodo.value = false
  }
  estaCargandoInformacion.value = false
}
cargarData()
</script>

<style lang="scss">
@media (max-width: 600px) {
  .grid-estilo {
    width: 50%;
  }
}

@media (max-width: 400px) {
  .grid-estilo {
    width: 100%;
  }
}
</style>
