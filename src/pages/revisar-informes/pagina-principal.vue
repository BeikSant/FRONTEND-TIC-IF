<template>
  <q-card class="q-ma-md" square flat bordered>
    <q-card-section class="bg-primary row justify-between items-center">
      <span class="text-white text-h6 text-bold">Revisión de Informes Finales</span>
      <q-select :disable="loading" @update:model-value="obtenerInformesPeriodo" v-model="periodoSelected"
        :options="selectedPeriodos" color="primary" outlined square bg-color="white" label="Periodo académico" />
    </q-card-section>
    <q-card-section class="no-padding">
      <q-table flat square :columns="header" :rows="dataInformes" row-key="name" separator="cell"
        :no-data-label="'Aún no existen informe generados'" :pagination="{ rowsPerPage: 10 }"
        rows-per-page-label="Resultados por página" :loading="loading" loading-label="Cargando datos..."
        :dense="$q.screen.lt.md" :grid="$q.screen.xs" no-results-label="No hay ningún resultado" :filter="filter">

        <template v-slot:top>
          <div class="row justify-between items-center full-width">
            <div>
              <div class="text-subtitle1"><b>PERIODO ACADÉMICO: </b>{{ periodoSeleccionado !=
                null ?
                periodoSeleccionado.nombre :
                ''
              }}
              </div>
              <span class="text-subtitle1 text-bold">ESTADO: </span><q-chip v-if="periodoSeleccionado != null" size="sm"
                square :color="periodoSeleccionado.estado ? 'green-5' : 'red-5'" text-color="white"
                :label="periodoSeleccionado.estado ? 'En curso' : 'Culminado'" />
            </div>
            <q-input dense v-model="filter" placeholder="Buscar">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </template>

        <template v-slot:body-cell-estadoInforme="props">
          <q-td :props="props">
            <q-chip size="sm" square :color="props.row.estadoInforme.color" text-color="white"
              :label="props.row.estadoInforme.estado" />
          </q-td>
        </template>

        <template v-slot:body-cell-firma_director="props">
          <q-td :props="props">
            <template v-if="props.row.firma_director == null">
              <q-chip class="q-mr-none" size="sm" color="grey" square text-color="white" label="No Disponible" />
              <q-btn round flat color="grey" size="xs" icon="mdi-help-circle-outline">
                <q-tooltip max-width="150px" style="text-align: center;">Informe pendiente de firma por parte del
                  Director</q-tooltip>
              </q-btn>
            </template>
            <template v-else>
              <q-btn size="sm" color="light-blue-9" icon-right="mdi-download" label="DESCARGAR" dense
                @click="desacargarPDF(props.row.firma_director)">
                <q-tooltip max-width="150px" style="text-align: center;">Descargar Informe</q-tooltip>
              </q-btn>
            </template>
          </q-td>
        </template>

        <template v-slot:body-cell-firma_docente="props">
          <q-td :props="props">
            <template v-if="props.row.firma_docente == null">
              <q-chip class="q-mr-none" size="sm" color="grey" square text-color="white" label="No Disponible" />
              <q-btn round flat color="grey" size="xs" icon="mdi-help-circle-outline">
                <q-tooltip max-width="150px" style="text-align: center;">El docente aun no ha enviado el
                  informe</q-tooltip>
              </q-btn>
            </template>
            <q-btn v-else size="sm" color="light-blue-9" icon-right="mdi-download" label="DESCARGAR" dense
              @click="desacargarPDF(props.row.firma_docente)">
              <q-tooltip max-width="150px" style="text-align: center;">Descargar Informe</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template v-slot:body-cell-acciones="props">
          <q-td :props="props" auto-width
            v-if="periodoSeleccionado.estado && props.row.firma_docente != null && props.row.estadoInforme.estado != 'Aprobado'">
            <div>
              <q-btn @click="mostrarModalEnviarInforme(props.row)" size="xs" color="pink-7" label="Enviar Informe" />
              <q-btn round flat color="grey" size="xs" icon="mdi-help-circle-outline">
                <q-tooltip max-width="150px" style="text-align: center;">Enviar el informe final con la firma del
                  Director</q-tooltip>
              </q-btn>
            </div>
            <div v-if="props.row.estadoInforme.estado != 'Novedad documento'">
              <q-btn-dropdown size="xs" color="indigo-6" label="Notificar">

                <q-list dense class="text-caption" separator style="text-align: center;" bordered>

                  <q-item clickable v-close-popup
                    @click="enviarNotificacion(props.row, 'indica que el documento del informe final enviado no es correcto')">
                    <q-item-section>
                      <q-item-label>Documento incorrecto</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup
                    @click="enviarNotificacion(props.row, 'indica que la firma del informe enviado final no es válida')">
                    <q-item-section>
                      <q-item-label>Firma no válida</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup
                    @click="enviarNotificacion(props.row, 'indica que el informe final enviado no contiene la firma del docente')">
                    <q-item-section>
                      <q-item-label>Documento sin firma</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item clickable @click="modalMensajePersonalizado = true">
                    <q-item-section>
                      <q-item-label>Mensaje personalizado</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>

                <q-dialog persistent v-model="modalMensajePersonalizado">
                  <q-card style="max-width: 400px; min-width: 300px;">
                    <q-card-section class="bg-primary text-h6 text-white">
                      Mensaje personalizado
                    </q-card-section>
                    <q-card-section>
                      <q-input v-model="mensajePersonalizado" filled type="textarea" label="Mensaje"
                        hint="Escriba un mensaje personalizado para el docente">

                      </q-input>
                    </q-card-section>
                    <q-separator class="q-mt-sm"></q-separator>
                    <q-card-actions class="text-center justify-end">
                      <q-btn v-close-popup flat color="red" @click=" mensajePersonalizado = ''">Cancelar</q-btn>
                      <q-btn :disabled="mensajePersonalizado == ''"
                        @click="enviarNotificacion(props.row, mensajePersonalizado)" color="positive">Enviar</q-btn>
                    </q-card-actions>
                  </q-card>
                </q-dialog>

              </q-btn-dropdown>
              <q-btn round flat color="grey" size="xs" icon="mdi-help-circle-outline">
                <q-tooltip max-width="150px" style="text-align: center;">Notificar al Docente
                  sobre problemas encontrados en el documento que ha enviado</q-tooltip>
              </q-btn>
            </div>
          </q-td>

          <q-td v-else auto-width>
            <q-chip class="q-mr-none" size="sm" color="grey" square text-color="white" label="No Disponible" />
            <q-btn round flat color="grey" size="xs" icon="mdi-help-circle-outline">
              <q-tooltip max-width="100px" style="text-align: center;">
                <span v-if="!periodoSeleccionado.estado">
                  Este periodo ya ha culminado
                </span>
                <span v-else-if="props.row.firma_docente == null">
                  El
                  docente aun no ha enviado el
                  informe
                </span>
                <span v-else-if="props.row.firma_director == null">
                  Informe
                  pendiente de
                  firma por parte del Director
                </span>
                <span v-else>
                  El documento ha sido aprobado
                </span>
              </q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template v-slot:item="props">

          <div class="q-pa-xs grid-estilo">
            <q-card bordered flat>
              <q-list dense>
                <q-item v-for="col in props.cols" :key="col.name">
                  <q-item-section class="q-mb-xs q-mt-xs">
                    <q-item-label class="text-bold" caption>{{ col.label }}</q-item-label>

                    <q-item-label v-if="col.name == 'estadoInforme'">
                      <q-chip size="sm" square :color="props.row.estadoInforme.color" text-color="white"
                        :label="props.row.estadoInforme.estado" />
                    </q-item-label>

                    <q-item-label v-else-if="col.name == 'firma_director'">
                      <template v-if="props.row.firma_director == null">
                        <q-chip class="q-mr-none" size="sm" color="grey" square text-color="white"
                          label="No Disponible" />
                        <q-btn round flat color="grey" size="xs" icon="mdi-help-circle-outline">
                          <q-tooltip max-width="150px" style="text-align: center;">Informe pendiente de firma por parte
                            del
                            Director</q-tooltip>
                        </q-btn>
                      </template>
                      <template v-else>
                        <q-btn size="sm" color="light-blue-9" icon-right="mdi-download" label="DESCARGAR" dense
                          @click="desacargarPDF(props.row.firma_director)">
                          <q-tooltip max-width="150px" style="text-align: center;">Descargar Informe</q-tooltip>
                        </q-btn>
                      </template>
                    </q-item-label>

                    <q-item-label v-else-if="col.name == 'firma_docente'">
                      <template v-if="props.row.firma_docente == null">
                        <q-chip class="q-mr-none" size="sm" color="grey" square text-color="white"
                          label="No Disponible" />
                        <q-btn round flat color="grey" size="xs" icon="mdi-help-circle-outline">
                          <q-tooltip max-width="150px" style="text-align: center;">El docente aun no ha enviado el
                            informe</q-tooltip>
                        </q-btn>
                      </template>
                      <q-btn v-else size="sm" color="light-blue-9" icon-right="mdi-download" label="DESCARGAR" dense
                        @click="desacargarPDF(props.row.firma_docente)">
                        <q-tooltip max-width="150px" style="text-align: center;">Descargar Informe</q-tooltip>
                      </q-btn>
                    </q-item-label>

                    <q-item-label v-else-if="col.name == 'acciones'">
                      <q-td
                        v-if="periodoSeleccionado.estado && props.row.firma_docente != null && props.row.estadoInforme.estado != 'Aprobado'">
                        <div>
                          <q-btn @click="mostrarModalEnviarInforme(props.row)" size="xs" color="pink-7"
                            label="Enviar Informe" />
                          <q-btn round flat color="grey" size="xs" icon="mdi-help-circle-outline">
                            <q-tooltip max-width="150px" style="text-align: center;">Enviar el informe final con la
                              firma
                              del
                              Director</q-tooltip>
                          </q-btn>
                        </div>
                        <div v-if="props.row.estadoInforme.estado != 'Novedad documento'">
                          <q-btn-dropdown size="xs" color="indigo-6" label="Notificar">

                            <q-list dense class="text-caption" separator style="text-align: center;" bordered>

                              <q-item clickable v-close-popup
                                @click="enviarNotificacion(props.row, 'indica que el documento del informe final enviado no es correcto')">
                                <q-item-section>
                                  <q-item-label>Documento incorrecto</q-item-label>
                                </q-item-section>
                              </q-item>

                              <q-item clickable v-close-popup
                                @click="enviarNotificacion(props.row, 'indica que la firma del informe enviado final no es válida')">
                                <q-item-section>
                                  <q-item-label>Firma no válida</q-item-label>
                                </q-item-section>
                              </q-item>

                              <q-item clickable v-close-popup
                                @click="enviarNotificacion(props.row, 'indica que el informe final enviado no contiene la firma del docente')">
                                <q-item-section>
                                  <q-item-label>Documento sin firma</q-item-label>
                                </q-item-section>
                              </q-item>

                              <q-item clickable @click="modalMensajePersonalizado = true">
                                <q-item-section>
                                  <q-item-label>Mensaje personalizado</q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>

                            <q-dialog persistent v-model="modalMensajePersonalizado">
                              <q-card style="max-width: 400px; min-width: 300px;">
                                <q-card-section class="bg-primary text-h6 text-white">
                                  Mensaje personalizado
                                </q-card-section>
                                <q-card-section>
                                  <q-input v-model="mensajePersonalizado" filled type="textarea" label="Mensaje"
                                    hint="Escriba un mensaje personalizado para el docente">

                                  </q-input>
                                </q-card-section>
                                <q-separator class="q-mt-sm"></q-separator>
                                <q-card-actions class="text-center justify-end">
                                  <q-btn v-close-popup flat color="red"
                                    @click=" mensajePersonalizado = ''">Cancelar</q-btn>
                                  <q-btn :disabled="mensajePersonalizado == ''"
                                    @click="enviarNotificacion(props.row, mensajePersonalizado)"
                                    color="positive">Enviar</q-btn>
                                </q-card-actions>
                              </q-card>
                            </q-dialog>

                          </q-btn-dropdown>
                          <q-btn round flat color="grey" size="xs" icon="mdi-help-circle-outline">
                            <q-tooltip max-width="150px" style="text-align: center;">Notificar al Docente
                              sobre problemas encontrados en el documento que ha enviado</q-tooltip>
                          </q-btn>
                        </div>
                      </q-td>

                      <q-td v-else auto-width>
                        <q-chip class="q-mr-none" size="sm" color="grey" square text-color="white"
                          label="No Disponible" />
                        <q-btn round flat color="grey" size="xs" icon="mdi-help-circle-outline">
                          <q-tooltip max-width="100px" style="text-align: center;">
                            <span v-if="!periodoSeleccionado.estado">
                              Este periodo ya ha culminado
                            </span>
                            <span v-else-if="props.row.firma_docente == null">
                              El
                              docente aun no ha enviado el
                              informe
                            </span>
                            <span v-else-if="props.row.firma_director == null">
                              Informe
                              pendiente de
                              firma por parte del Director
                            </span>
                            <span v-else>
                              El documento ha sido aprobado
                            </span>
                          </q-tooltip>
                        </q-btn>
                      </q-td>
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

      <q-dialog v-model="modalEnviarInforme" persistent="">
        <q-card style="width: 450px">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">
              <b>Enviar informe final firmado</b>
            </div>
          </q-card-section>
          <q-card-section class="q-pa-md">
            <q-banner dense class="bg-indigo-1 text-justify">
              <template v-slot:avatar>
                <q-icon name="mdi-information" color="primary" />
              </template>
              <span class="text-caption">
                Envíe el informe final con la firma del Director.</span>
            </q-banner>
            <div class="column items-center q-my-md">
              <q-input @update:model-value="val => { informeUpload = val[0] }" type="file" dense class="bg-grey-5 q-px-md"
                style="width: 98%;" />
            </div>

          </q-card-section>
          <q-separator></q-separator>
          <q-card-actions class="justify-end">
            <q-btn flat label="Cerrar" color="negative" v-close-popup @click="confirm_delete = false" />
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
                <span>Usted ya ha enviado el informe final firmado al docente <b>{{ docenteAEnviarInforme.nombre }}</b>
                  ¿Está
                  seguro que desea reemplazar el informe?
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
          <q-card-section>
            <div class="row items-center">
              <div class="col-3 col-sm-2">
                <q-avatar icon="mdi-check-circle-outline" color="green" text-color="white" />
              </div>
              <div class="col-9 col-sm-10 q-pt-xs text-justify">
                <span>Se ha notificado al Docente sobre la aprobación y envío del informe final.
                </span>
              </div>
            </div>
          </q-card-section>
          <q-card-actions style="display: flex; justify-content: flex-end;">
            <q-btn flat label="Cerrar" color="negative" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

    </q-card-section>
  </q-card>


  <q-dialog v-model="modalNotificacionEnviada" persistent>
    <q-card style="max-width: 400px">
      <q-card-section>
        <div class="row items-center">
          <div class="col-3 col-sm-2">
            <q-avatar icon="mdi-check-circle-outline" color="green" text-color="white" />
          </div>
          <div class="col-9 col-sm-10 q-pt-xs text-justify">
            <span>Se ha enviado la notificación al Docente con éxito.
            </span>
          </div>
        </div>
      </q-card-section>
      <q-card-actions style="display: flex; justify-content: flex-end;">
        <q-btn flat label="Cerrar" color="negative" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>

import informeController from 'src/controller/informe-controller';
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import periodoController from 'src/controller/periodo-controller';
import notificacionController from 'src/controller/notificacion-controller';

const router = useRouter()
const modalMensajePersonalizado = ref(false)
const mensajePersonalizado = ref('')
const modalNotificacionEnviada = ref(false)
const $q = useQuasar()
const loading = ref(false)
const filter = ref('')
const header = [
  { name: 'docente', label: 'DOCENTE', sortable: true, field: 'docente', align: 'left', style: "white-space: break-spaces;", },
  { name: 'estadoInforme', label: 'ESTADO INFORME', sortable: false, field: 'estadoInforme', align: 'center', style: "white-space: break-spaces;", },
  { name: 'firma_docente', label: 'FIRMA DOCENTE', sortable: false, field: 'firma_docente', align: 'center' },
  { name: 'firma_director', label: 'FIRMA DIRECTOR', sortable: false, field: 'firma_director', align: 'center' },
  { name: 'acciones', label: 'ACCIONES', sortable: false, field: 'acciones', align: 'center' },
]
const dataInformes = ref([])
const periodos = ref([]) //Es la lista de todos los periodos
const periodoSelected = ref(null) // Esta variables es el v-model del selected de los periodos
const selectedPeriodos = ref([]) // Todos la lista de options del selected
const periodoSeleccionado = ref(null)
const informeUpload = ref(null)

const modalEnviarInforme = ref(false)
const modalAdvertenciaInforme = ref(false)
const modalInformeEnviado = ref(false)
const docenteAEnviarInforme = ref(null)

const obtenerPeriodos = async () => {
  await periodoController.obtenerTodosPeriodos(res => {
    if (res.status != 200) return errorRequest()
    periodos.value = res.data.periodos
    selectedPeriodos.value = periodos.value.map(periodo => periodo.nombre)
    periodoSelected.value = selectedPeriodos.value[0]
    if (periodos.value.length != 0) obtenerInformesPeriodo(periodoSelected.value)
  })
}

const obtenerInformesPeriodo = async (value) => {
  dataInformes.value = []
  loading.value = true
  periodoSeleccionado.value = periodos.value.filter((periodo) => periodo.nombre == value)[0]
  await informeController.obtenerTodosPorPeriodo(periodoSeleccionado.value._id, (res) => {
    if (res.status != 200) return errorRequest()
    const informes = res.data.informes
    for (let i = 0; i < informes.length; i++) {
      dataInformes.value.push({
        idDocente: informes[i].docente._id,
        docente: informes[i].docente.primerNombre + ' ' + informes[i].docente.primerApellido,
        estadoInforme: devolverEstado(informes[i].estado),
        firma_docente: informes[i].documento_firma_docente,
        firma_director: informes[i].documento_firma_director != null ? informes[i].documento_firma_director : null,
        periodo: informes[i].periodoAcademico.nombre,
        fechaInicio: new Date(informes[i].periodoAcademico.fechaInicio).toLocaleDateString(),
        fechaFin: new Date(informes[i].periodoAcademico.fechaFin).toLocaleDateString(),
        id: informes[i]._id,
      })
    }
    loading.value = false
  })
}

function devolverEstado(estado) {
  if (estado == 'completado') return { estado: 'Aprobado', color: 'green-5' }
  if (estado == 'enviadoFirmar') return { estado: 'Enviado para firmar', color: 'orange-5' }
  if (estado == 'novedadDocumento') return { estado: 'Novedad documento', color: 'red-5' }
  return { estado: 'Iniciado', color: 'indigo-5' }
}

async function desacargarPDF(base) {
  const url = process.env.API_URL + '/uploads/' + base
  window.open(url, '_blank');
}

function mostrarModalEnviarInforme(informe) {
  docenteAEnviarInforme.value = { id: informe.idDocente, nombre: informe.docente }
  if (informe.firma_director != null) return modalAdvertenciaInforme.value = true
  modalEnviarInforme.value = true
}

async function enviarInforme() {
  if (informeUpload.value == null) return generateMessage("WARNING", "Aún no ha seleccionado ningún archivo")
  const formData = new FormData()
  formData.append('firmado_por', 'director')
  formData.append('docente', docenteAEnviarInforme.value.id)
  formData.append('myFile', informeUpload.value)
  await informeController.guardarInforme(formData, async (res) => {
    if (res.status != 200) return errorRequest()
    informeUpload.value = null
    modalEnviarInforme.value = false
    generateMessage('OK', "Documento enviado")
    obtenerInformesPeriodo(periodoSelected.value)
    const data = {
      mensaje: 'ha aprobado y firmado su informe final.',
      destino: docenteAEnviarInforme.value.id
    }
    await notificacionController.guardarNotificacion(data, res => {
      if (res.status != 200) return generateMessage("NO OK", "Ocurrió un error al notificar al docente");
      modalInformeEnviado.value = true
      docenteAEnviarInforme.value = null
    })
  })

}

async function enviarNotificacion(informe, notificacion) {
  if (notificacion == '') return
  notificacion = notificacion.replace(/\s{2,}/g, ' ').trim()
  if (mensajePersonalizado.value != '') {
    notificacion = 'ha enviado un mensaje personalizado: " ' + notificacion + ' "'
  }
  const data = {
    destino: informe.idDocente,
    mensaje: notificacion,
  }
  informeController.cambiarEstado(informe.id, 'novedadDocumento', res => {
    obtenerInformesPeriodo(periodoSelected.value)
  })
  await notificacionController.guardarNotificacion(data, res => {
    if (res.status != 200) return generateMessage("NO OK", "Ocurrió un error al notificar al director");
    modalNotificacionEnviada.value = true
    modalMensajePersonalizado.value = false
    mensajePersonalizado.value = ''
  })
}

obtenerPeriodos()

const errorRequest = (res) => {
  if (res.status == 401) { generateMessage('NO OK', res.message); return router.re('/login') }
  if (res.status == 403) { generateMessage('NO OK', res.message); return router.push({ path: '/' }) }
  if (res.status != 200) generateMessage('NO OK', res.message)
}

const generateMessage = (tipo, message) => {
  if (tipo == 'OK') {
    $q.notify({
      color: 'green-5',
      textColor: 'white',
      icon: 'mdi-check-bold',
      message: message
    })
  } else {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: message
    })
  }
}

</script>

<style lang="scss">
@media (max-width: 600px) {
  .grid-estilo {
    width: 50%;
  }
}

@media (max-width: 325px) {
  .grid-estilo {
    width: 100%;
  }
}
</style>
