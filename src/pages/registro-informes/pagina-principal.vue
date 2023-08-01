<template>
  <q-card class="q-ma-md" square flat bordered>
    <q-card-section class="bg-primary text-white">
      <span class="text-bold text-h6">Registro de Informes Finales</span>
    </q-card-section>
    <q-card-section class="no-padding">
      <q-table square flat bordered :columns="header" :rows="dataInformes" row-key="name" separator="cell" virtual-scroll
        :filter="filter" :no-data-label="'No posee un historial de informes'" :key="'tablePeriodo'"
        :pagination="{ rowsPerPage: 10 }" rows-per-page-label="Resultados por página" :loading="loading"
        loading-label="Cargando datos..." :dense="$q.screen.lt.md" :grid="$q.screen.xs"
        no-results-label="No hay ningún resultado">

        <template v-slot:top>
          <div class="row justify-between items-center full-width">
            <span class="text-subtitle1 text-bold text-uppercase">Lista de Informes por Periodo</span>
            <q-input dense v-model="filter" placeholder="Buscar">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </template>

        <template v-slot:body-cell-acciones="props">
          <q-td :props="props" auto-width>
            <template
              v-if="props.row.firma_director != null && props.row.estadoInforme.estado != 'Novedad documento' && userStore.user.usuario.rol.nombre.toLowerCase() != 'director'">
              <q-btn-dropdown size="xs" color="indigo-6" label="Notificar">

                <q-list dense class="text-caption" separator style="text-align: center;" bordered>
                  <q-item clickable v-close-popup
                    @click="enviarNotificacion(props.row, 'indica que el documento del informe final no es correcto')">
                    <q-item-section>
                      <q-item-label>Documento incorrecto</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup
                    @click="enviarNotificacion(props.row, 'indica que la firma del informe final no es válida')">
                    <q-item-section>
                      <q-item-label>Firma no válida</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup
                    @click="enviarNotificacion(props.row, 'indica que el informe final enviado no contiene la firma del director')">
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
                        hint="Escriba un mensaje personalizado para el director">

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
                <q-tooltip max-width="150px" style="text-align: center;">
                  <span>Notificar al director
                    sobre problemas encontrados en el documento que ha enviado</span>
                </q-tooltip>
              </q-btn>
            </template>
            <template v-else>
              <q-chip class="q-mr-none" size="sm" color="grey" square text-color="white" label="No Disponible" />
              <q-btn round flat color="grey" size="xs" icon="mdi-help-circle-outline">
                <q-tooltip v-if="props.row.estado" max-width="150px" style="text-align: center;">
                  <span v-if="props.row.firma_director == null">
                    Firma pendiente del Director
                  </span>
                  <span v-else-if="props.row.estadoInforme.estado == 'Novedad documento'">
                    <span>Existe una novedad en el documento</span>
                  </span>
                  <span v-else>
                    <span>Usted es el director</span>
                  </span>
                </q-tooltip>
                <q-tooltip v-else max-width="100px" style="text-align: center;">Este periodo ya ha
                  culminado</q-tooltip>
              </q-btn>
            </template>
          </q-td>
        </template>

        <template v-slot:body-cell-estadoInforme="props">
          <q-td :props="props" auto-width>
            <q-chip size="sm" square :color="props.row.estadoInforme.color" text-color="white"
              :label="props.row.estadoInforme.estado" />
          </q-td>
        </template>

        <template v-slot:body-cell-estado="props">
          <q-td :props="props" auto-width>
            <q-chip size="sm" square :color="props.row.estado ? 'green-5' : 'red-5'" text-color="white"
              :label="props.row.estado ? 'En curso' : 'Culminado'" />
          </q-td>
        </template>

        <template v-slot:body-cell-firma_docente="props">
          <q-td :props="props" auto-width>
            <q-btn size="sm" color="light-blue-9" icon-right="mdi-download" label="DESCARGAR" dense
              @click="desacargarPDF(props.row, props.row.firma_docente, 'firma_docente')">
              <q-tooltip max-width="150px" style="text-align: center;">Descargar Informe</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template v-slot:body-cell-firma_director="props">
          <q-td :props="props" auto-width>
            <template v-if="props.row.firma_director == null">
              <q-chip class="q-mr-none" size="sm" color="grey" square text-color="white" label="No Disponible" />
              <q-btn round flat color="grey" size="xs" icon="mdi-help-circle-outline">
                <q-tooltip max-width="150px" style="text-align: center;">Aprobación pendiente</q-tooltip>
              </q-btn>
            </template>
            <template v-else>
              <q-btn size="sm" color="light-blue-9" icon-right="mdi-download" label="DESCARGAR" dense
                @click="desacargarPDF(props.row, props.row.firma_director, 'firma_director')">
                <q-tooltip max-width="150px" style="text-align: center;">Descargar Informe</q-tooltip>
              </q-btn>
            </template>
          </q-td>
        </template>


        <template v-slot:item="props">
          <div class="q-pa-xs grid-estilo">
            <q-card bordered flat>
              <q-list dense>
                <q-item v-for="col in props.cols" :key="col.name">
                  <q-item-section class="col-12 q-mb-xs q-mt-xs">
                    <q-item-label class="text-bold" caption>{{ col.label }}</q-item-label>

                    <q-item-label v-if="col.name == 'estado'">
                      <q-chip size="sm" square :color="props.row.estado ? 'green-5' : 'red-5'" text-color="white"
                        :label="props.row.estado ? 'En curso' : 'Culminado'" />
                    </q-item-label>

                    <q-item-label v-else-if="col.name == 'estadoInforme'">
                      <q-chip size="sm" square :color="props.row.estadoInforme.color" text-color="white"
                        :label="props.row.estadoInforme.estado" />
                    </q-item-label>


                    <q-item-label v-else-if="col.name == 'firma_docente'">
                      <q-btn size="sm" color="light-blue-9" icon-right="mdi-download" label="DESCARGAR" dense
                        @click="desacargarPDF(props.row, props.row.firma_docente, col.name)">
                        <q-tooltip max-width="150px" style="text-align: center;">Descargar Informe</q-tooltip>
                      </q-btn>
                    </q-item-label>

                    <q-item-label v-else-if="col.name == 'firma_director'">
                      <template v-if="props.row.firma_director == null">
                        <q-chip class="q-mr-none" size="sm" color="grey" square text-color="white"
                          label="No Disponible" />
                        <q-btn round flat color="grey" size="xs" icon="mdi-help-circle-outline">
                          <q-tooltip max-width="150px" style="text-align: center;">Aprobación pendiente</q-tooltip>
                        </q-btn>
                      </template>
                      <template v-else>
                        <q-btn size="sm" color="light-blue-9" icon-right="mdi-download" label="DESCARGAR" dense
                          @click="desacargarPDF(props.row, props.row.firma_director, col.name)">
                          <q-tooltip max-width="150px" style="text-align: center;">Descargar Informe</q-tooltip>
                        </q-btn>
                      </template>
                    </q-item-label>

                    <q-item-label v-else-if="col.name == 'acciones'">
                      <template
                        v-if="props.row.firma_director != null && props.row.estadoInforme.estado != 'Novedad documento'">
                        <q-btn-dropdown size="xs" color="indigo-6" label="Notificar">

                          <q-list dense class="text-caption" separator style="text-align: center;" bordered>
                            <q-item clickable v-close-popup
                              @click="enviarNotificacion(props.row, 'indica que el documento del informe final no es correcto')">
                              <q-item-section>
                                <q-item-label>Documento incorrecto</q-item-label>
                              </q-item-section>
                            </q-item>

                            <q-item clickable v-close-popup
                              @click="enviarNotificacion(props.row, 'indica que la firma del informe final no es válida')">
                              <q-item-section>
                                <q-item-label>Firma no válida</q-item-label>
                              </q-item-section>
                            </q-item>

                            <q-item clickable v-close-popup
                              @click="enviarNotificacion(props.row, 'indica que el informe final enviado no contiene la firma del director')">
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
                                  hint="Escriba un mensaje personalizado para el director">

                                </q-input>
                              </q-card-section>
                              <q-separator class="q-mt-sm"></q-separator>
                              <q-card-actions class="text-center justify-end">
                                <q-btn v-close-popup flat color="red" @click=" mensajePersonalizado = ''">Cancelar</q-btn>
                                <q-btn :disabled="mensajePersonalizado == ''"
                                  @click="enviarNotificacion(props.row, mensajePersonalizado)"
                                  color="positive">Enviar</q-btn>
                              </q-card-actions>
                            </q-card>
                          </q-dialog>

                        </q-btn-dropdown>
                        <q-btn round flat color="grey" size="xs" icon="mdi-help-circle-outline">
                          <q-tooltip max-width="150px" style="text-align: center;">
                            <span>Notificar al director
                              sobre problemas encontrados en el documento que ha enviado</span>
                          </q-tooltip>
                        </q-btn>
                      </template>
                      <template v-else>
                        <q-chip class="q-mr-none" size="sm" color="grey" square text-color="white"
                          label="No Disponible" />
                        <q-btn round flat color="grey" size="xs" icon="mdi-help-circle-outline">
                          <q-tooltip v-if="props.row.estado" max-width="150px" style="text-align: center;">
                            <span v-if="props.row.firma_director == null">
                              Aprobación pendiente
                            </span>
                            <span v-else-if="props.row.estadoInforme.estado == 'Novedad documento'">
                              <span>Existe una novedad en el documento</span>
                            </span>
                          </q-tooltip>
                          <q-tooltip v-else max-width="100px" style="text-align: center;">Este periodo ya ha
                            culminado</q-tooltip>
                        </q-btn>
                      </template>
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


      <q-dialog v-model="modalNotificacionEnviada" persistent>
        <q-card style="max-width: 400px">
          <q-card-section>
            <div class="row items-center">
              <div class="col-3 col-sm-2">
                <q-avatar icon="mdi-check-circle-outline" color="green" text-color="white" />
              </div>
              <div class="col-9 col-sm-10 q-pt-xs text-justify">
                <span>Se ha enviado la notificación al Director con éxito, espere para obtener una respuesta.
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
</template>

<script setup>

import informeController from 'src/controller/informe-controller';
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import notificacionController from 'src/controller/notificacion-controller';
import { useUserStore } from 'src/stores/user-store';
import { saveAs } from 'file-saver'

const userStore = useUserStore()
const router = useRouter()
const modalMensajePersonalizado = ref(false)
const mensajePersonalizado = ref('')
const filter = ref(null)
const modalNotificacionEnviada = ref(false)
const $q = useQuasar()
const header = [
  { name: 'periodo', label: 'PERIODO', sortable: true, field: 'periodo', align: 'left', style: "white-space: break-spaces;", },
  { name: 'estado', label: 'ESTADO PERIODO', field: 'estado', align: 'center' },
  { name: 'estadoInforme', label: 'INFORME', field: 'estadoInforme', align: 'center' },
  { name: 'firma_docente', label: 'INF. FIRMA DOCENTE', field: 'firma_docente', align: 'center' },
  { name: 'firma_director', label: 'INF. FIRMA DIRECTOR', field: 'firma_director', align: 'center' },
  { name: 'acciones', label: 'ACCIONES', field: 'acciones', align: 'center' },
]
const loading = ref(false)
const dataInformes = ref([])

const obtenerHistorialInformes = async () => {
  loading.value = true
  await informeController.obtenerTodosInformes((res) => {
    if (res.status != 200) return errorRequest()
    const informes = res.data.informes
    console.log(informes)
    dataInformes.value = []
    for (let i = 0; i < informes.length; i++) {
      dataInformes.value.push({
        estado: informes[i].periodoAcademico.estado,
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
  if (estado == 'enviadoFirmar') return { estado: 'Aprobación pendiente', color: 'orange-5' }
  if (estado == 'novedadDocumento') return { estado: 'Novedad documento', color: 'red-5' }
  return { estado: 'No iniciado', color: 'grey-5' }
}

async function desacargarPDF(info, base, tipo) {
  const url = process.env.API_URL + '/uploads/' + base
  const namePdf = `${userStore.user.primerNombre.toLowerCase()}-${userStore.user.primerApellido.toLowerCase()}-${info.periodo.toLowerCase()}-${tipo}-signed.pdf`
  saveAs(url, namePdf)
}

async function enviarNotificacion(informe, notificacion) {
  if (notificacion == '') return
  notificacion = notificacion.replace(/\s{2,}/g, ' ').trim()
  if (mensajePersonalizado.value != '') {
    notificacion = 'ha enviado un mensaje personalizado: " ' + notificacion + ' "'
  }
  const data = {
    mensaje: notificacion,
  }
  informeController.cambiarEstado(informe.id, 'novedadDocumento', res => {
    obtenerHistorialInformes()
  })
  await notificacionController.guardarNotificacion(data, res => {
    if (res.status != 200) return generateMessage("NO OK", "Ocurrió un error al notificar al director");
    modalNotificacionEnviada.value = true
    modalMensajePersonalizado.value = false
    mensajePersonalizado.value = ''
  })
}

obtenerHistorialInformes()

const errorRequest = (res) => {
  if (res.status == 401) { generateMessage('NO OK', res.message); return router.push('/login') }
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
