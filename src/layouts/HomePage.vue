<template>
  <Suspense>
    <q-layout view="hHh LpR fFf">
      <q-header class="bg-primary text-white">
        <q-toolbar>
          <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

          <q-toolbar-title class="title-main q-ml-md" width="70%">
            <div class="row items-center text-h6 text-bold" style="gap: 10px">
              <span v-if="!$q.screen.xs" style="white-space: break-spaces; line-height: normal; max-width: 100%">SISTEMA
                DE GESTIÓN DEL
                INFORME FINAL</span>
              <span v-if="$q.screen.width > 464 && $q.screen.width < 600">
                SISTEMA DE GESTIÓN DEL I.F.
              </span>
              <span v-if="$q.screen.width < 465">
                S.G.I.F.
              </span>
            </div>

          </q-toolbar-title>
          <div class="notificaciones">
            <q-btn dense flat round icon="mdi-bell">
              <q-badge size="xs" floating color="red" v-if="notificacionNoLeidas > 0">{{ notificacionNoLeidas
              }}</q-badge>
              <q-menu class="q-pa-none" @show="notificaionesAbiertas">
                <q-item-label header
                  class="text-h6 q-py-sm q-ma-none text-bold text-primary">Notificaciones</q-item-label>
                <q-separator class="q-mb-sm q-pa-none"></q-separator>
                <q-list class="scroll" dense style="min-width: 250px; max-width: 350px; max-height: 50vh;">
                  <q-item v-if="notificaciones.length == 0">
                    <q-item-section>
                      <q-item-label caption>No tiene notificaciones nuevas</q-item-label>
                    </q-item-section>
                  </q-item>
                  <template v-else v-for="item, key in notificaciones" :key="key">
                    <q-item>
                      <q-item-section>
                        <q-item-label :class="'text-caption text-justify ' + (item.leido ? 'text-grey-7' : '')">
                          <b>{{ item.origen.primerNombre + ' ' + item.origen.primerApellido + ' ' }}</b> {{ item.mensaje
                          }}
                        </q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-item-label caption :class="(!item.leido ? 'text-light-blue-9 text-bold' : '')">{{
                          item.tiempoTranscurrido }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-separator spaced inset />
                  </template>

                </q-list>
                <q-separator class="q-mt-sm"></q-separator>
                <div class="flex text-center justify-center q-pa-sm">
                  <q-btn outline dense size="sm" color="primary" class="q-px-md" @click="obtenerTodasNotificaciones">Ver
                    todas</q-btn>
                </div>
              </q-menu>
            </q-btn>
          </div>

          <div class="q-mr-xs q-ml-xs">
            <q-btn dense flat round icon="mdi-account">
              <q-menu fit v-model="menu_notificacion" square>
                <q-list class="list" style="min-width: 100px; width: 200px" separator>
                  <q-item clickable @click="showEditarDedicación = true;
                  editDedicacion = perfil.dedicacion;
                  ">
                    <q-item-section class="col-2">
                      <q-icon name="mdi-account-edit" />
                    </q-item-section>
                    <q-item-section class="col">
                      <q-item-label>Cambiar dedicación</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable @click=" showCambiarContrasennia = true">
                    <q-item-section class="col-2">
                      <q-icon name="mdi-key" />
                    </q-item-section>
                    <q-item-section class="col">
                      <q-item-label>Cambiar contraseña</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable @click=" logout()" class="bg-red-5 text-white text-bold">
                    <q-item-section class="col-2">
                      <q-icon name="mdi-login-variant" />
                    </q-item-section>
                    <q-item-section class="col">
                      <q-item-label>Cerrar sesion</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </q-toolbar>
      </q-header>

      <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered="">
        <q-img style="max-height: 150px" src="~assets/font-user.jpg" class="font-img">
          <q-card-section style="z-index: 1" class="bg-transparent absolute-bottom text-subtitle2 text-left">
            <q-avatar class="items-end q-mb-sm">
              <img src="~assets/user-none.png">
            </q-avatar>
            <div class="text-h7 text-subtitle1 text-bold">{{ perfil.nombre }}</div>
            <div class="text-subtitle2 text-italic">{{ perfil.rol }}</div>
          </q-card-section>
        </q-img>
        <q-list bordered>
          <q-item active-class="text-blue-9" to="/" exact>
            <q-item-section avatar>
              <q-icon name="mdi-home" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Página de Inicio</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-list bordered v-if="isDirector">
          <q-item v-for=" link in linksDirector" :key="link.name" active-class="text-blue-9" :to="link.to" exact>
            <q-item-section v-if="link.icon" avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.title }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-list bordered>
          <q-item v-for=" link in linksDocente" :key="link.name" active-class="text-blue-9" :to="link.to" exact>
            <q-item-section v-if="link.icon" avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.title }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-drawer>
      <q-page-container>
        <router-view />
      </q-page-container>
      <q-dialog v-model="showCambiarContrasennia" persistent square>
        <q-card style="min-width: 300px">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">Cambiar Contraseña</div>
          </q-card-section>

          <q-form @submit=" onSubmit()" @reset=" cerrarFormulario()">
            <q-card-section class="q-col-gutter-md">
              <q-input class="col" outlined square v-model="formPassword.password" label="Contraseña Actual" lazy-rules
                :rules="[val => (val && val.length > 0) || 'Completa este campo']
                  " hint="Ingrese su contraseña actual" :type="isPassword ? 'password' : 'text'">
                <template v-slot:append>
                  <q-icon :name="isPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                    @click=" isPassword = !isPassword" /> </template></q-input>

              <q-input class="col" outlined square v-model="formPassword.new_password" label="Contraseña Nueva" lazy-rules
                :rules="[
                  val => (val && val.length > 0) || 'Completa este campo',
                  val => (val.length > 7 && val.length < 21) || 'Solo se permite una contraseña entre 8 y 20 caracteres'
                ]
                  " hint="Ingrese la nueva contraseña" :type="isNewPassword ? 'password' : 'text'">
                <template v-slot:append>
                  <q-icon :name="isNewPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                    @click=" isNewPassword = !isNewPassword" /> </template></q-input>
            </q-card-section>
            <q-separator />
            <q-card-actions class="justify-end">
              <q-btn type="reset" flat label="Cancelar" color="negative" />
              <q-btn type="submit" color="positive" label="Guardar" />
            </q-card-actions>
          </q-form>
        </q-card>
      </q-dialog>

      <q-dialog v-model="modalNotificaciones" persistent>
        <q-card class="full-width">
          <q-card-section class="row items-center q-py-sm text-white bg-primary">
            <div class="text-h6">Notificaciones</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section>

            <div class="q-pa-lg flex flex-center">
              <q-pagination v-model="current" color="primary" :max="10" :max-pages="6" boundary-numbers />
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog v-model="showEditarDedicación" persistent square>
        <q-card style="max-width: 500px; min-width: 300px">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">Cambiar Dedicación</div>
          </q-card-section>

          <q-form @submit=" cambiarDedicacion()" @reset=" cerrarFormulario()" class="q-gutter-x-md">
            <q-card-section class="q-mb-sm">
              <q-input class="col label-mid" outlined square v-model="editDedicacion" label="Dedicación Actual" lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Complete este campo',
                ]
                  " hint="Ingrese su dedicación actual" type="text" />
            </q-card-section>
            <q-separator />
            <q-card-actions class="justify-end">
              <q-btn type="reset" flat label="Cancelar" color="negative" />
              <q-btn type="submit" color="positive" label="Guardar" />
            </q-card-actions>
          </q-form>

        </q-card>
      </q-dialog>
    </q-layout>
  </Suspense>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import docente from "src/controller/docente";
import user from "src/controller/user";
import docenteController from "src/controller/docente";
import { Cookies, useQuasar } from "quasar";
import { getCurrentInstance } from "vue"
import notificacionController from "src/controller/notificacion-controller";

const linksDirector = [
  {
    title: "Administrar Docentes",
    icon: "mdi-account-group",
    requireDirector: true,
    to: "/docentes",
  },
  {
    title: "Gestionar Periodos Académicos",
    icon: "mdi-calendar-edit",
    requireDirector: true,
    to: "/periodo",
  },
  {
    title: "Gestionar Formatos del Informe",
    icon: "mdi-file-cog",
    requireDirector: true,
    to: "/informe/formato",
  },
  {
    title: "Revisar Informes de Docentes",
    icon: "mdi-file-check",
    requireDirector: true,
    to: "/informe/revision",
  },
]

const linksDocente = [
  {
    title: "Ver Distributivo General",
    icon: "mdi-view-dashboard",
    requireDirector: false,
    to: "/distributivo",
  },
  {
    title: "Gestionar Informe Actual",
    icon: "mdi-file-document-edit",
    requireDirector: false,
    to: "/informe/gestionar",
  },
  {
    title: "Ver Registro de Informes",
    icon: "mdi-file-document-multiple",
    requireDirector: false,
    to: "/informe/registro",
  },
];

const $q = useQuasar();
const formPassword = ref({
  password: "",
  new_password: "",
});
const pagination = ref(1)
const instance = getCurrentInstance()
const $socket = instance.appContext.app.config.globalProperties.$socket
const menu_notificacion = ref(false)
const isPassword = ref(true);
const isNewPassword = ref(true);
const showEditarDedicación = ref(false);
const showCambiarContrasennia = ref(false);
const router = useRouter();
const editDedicacion = ref("");
const leftDrawerOpen = ref(false);
let idDocente = null;
const notificaciones = ref([])
const notificacionNoLeidas = ref(0)
const isDirector = ref(false);
const perfil = ref({});
const modalNotificaciones = ref(false)
let open = 0

async function obtenerNotificacionNoLeidas() {
  await notificacionController.obtenerNoLeidos((res) => {
    notificaciones.value = res.data.notificaciones
    notificacionNoLeidas.value = 0
    for (let i = 0; i < notificaciones.value.length; i++) {
      if (!notificaciones.value[i].leido) notificacionNoLeidas.value++
      notificaciones.value[i].tiempoTranscurrido = tiempoTranscurrido(notificaciones.value[i].created_at)
    }
  })
}

async function obtenerTodasNotificaciones() {
  modalNotificaciones.value = true
}

function notificaionesAbiertas() {
  open++
  for (let i = 0; i < notificaciones.value.length; i++) {
    notificaciones.value[i].tiempoTranscurrido = tiempoTranscurrido(notificaciones.value[i].created_at)
    if (!notificaciones.value[i].leido) {
      if (open == 1) {
        notificacionController.leerNotificacion(notificaciones.value[i]._id)
        notificacionNoLeidas.value--
      } else if (open > 1) {
        notificaciones.value[i].leido = true
      }
    }
  }
}

function tiempoTranscurrido(fecha) {
  const fechaMensaje = new Date(fecha);
  const fechaActual = new Date();

  const diferenciaEnMinutos = Math.round((fechaActual - fechaMensaje) / (1000 * 60));
  const diferenciaEnHoras = Math.round(diferenciaEnMinutos / 60);
  const diferenciaEnDias = Math.round(diferenciaEnHoras / 24);
  const diferenciaEnMeses = Math.round(diferenciaEnDias / 12);
  const diferenciaEnAnos = Math.round(diferenciaEnMeses / 365);

  if (diferenciaEnMinutos < 1) {
    return 'Ahora';
  } else if (diferenciaEnMinutos < 60) {
    return `${diferenciaEnMinutos} min.`;
  } else if (diferenciaEnHoras < 24) {
    return `${diferenciaEnHoras} hora${diferenciaEnHoras > 1 ? 's' : ''}`;
  } else if (diferenciaEnDias < 30) {
    return `${diferenciaEnDias} día${diferenciaEnDias > 1 ? 's' : ''}`;
  } else if (diferenciaEnMeses < 12) {
    return `${diferenciaEnMeses} mes${diferenciaEnMeses > 1 ? 'es' : ''}`;
  } else if (diferenciaEnAnos < 12) {
    return `${diferenciaEnAnos} año${diferenciaEnAnos > 1 ? 's' : ''}`;
  } else {
    return fechaMensaje.toLocaleDateString();
  }
}

const obtenerPerfil = async () => {
  await docente.obtenerPerfilDocente((res) => {
    if (res.status == 401) {
      generateMessage("NO OK", res.message);
      return router.push({ path: "/login" });
    }
    if (res.status == 403) {
      generateMessage("NO OK", res.message);
      return router.push({ path: "/" });
    }
    if (res.status != 200) return generateMessage("NOK", res.message);
    perfil.value = {
      dedicacion: res.data.docente.dedicacion,
      nombre: `${res.data.docente.primerNombre} ${res.data.docente.primerApellido}`,
      rol: res.data.docente.usuario.rol.nombre.toUpperCase(),
    };
    idDocente = res.data.docente._id;
    isDirector.value = perfil.value.rol == "DIRECTOR" ? true : false;
  });
};

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

async function logout() {
  if (Cookies.get("auth-informefinal"))
    await Cookies.remove("auth-informefinal", { path: "/" });
  return router.push({ path: "/login" });
}

async function cambiarDedicacion() {
  await docenteController.editarDedicacion(
    idDocente,
    editDedicacion.value,
    (res) => {
      if (res.status == 401) {
        generateMessage("NO OK", res.message);
        return router.push({ path: "/login" });
      }
      if (res.status == 403) {
        generateMessage("NO OK", res.message);
        return router.push({ path: "/" });
      }
      if (res.status != 200) return generateMessage("NO OK", res.message);
      generateMessage("OK", res.data.message);
      perfil.value.dedicacion = editDedicacion.value;
      showEditarDedicación.value = false;
    }
  );
}
async function onSubmit() {
  await user.cambiarContrasennia(formPassword.value, (res) => {
    if (res.status == 401) {
      generateMessage("NO OK", res.message);
      return router.push({ path: "/login" });
    }
    if (res.status == 403) {
      generateMessage("NO OK", res.message);
      return router.push({ path: "/" });
    }
    if (res.status != 200) return generateMessage("NO OK", res.message);
    generateMessage("OK", res.data.message);
    this.cerrarFormulario();
  });
}

function cerrarFormulario() {
  showCambiarContrasennia.value = false;
  formPassword.value = {
    password: "",
    new_password: "",
  };
  showEditarDedicación.value = false;
  editDedicacion.value = "";
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function socket() {
  $socket.on('notificacion', (notificacion) => {
    notificacion.tiempoTranscurrido = tiempoTranscurrido(notificacion.created_at)
    if (notificacion.destinos.length > 1) {
      for (let i = 0; i < notificacion.destinos.length; i++) {
        if (notificacion.destinos[i] == idDocente) {
          notificaciones.value.unshift(notificacion)
          notificacionNoLeidas.value++
          open = 0
        }
      }
    } else if (idDocente == notificacion.destino) {
      notificaciones.value.unshift(notificacion)
      notificacionNoLeidas.value++
      open = 0
    }

  })
}


obtenerPerfil();
obtenerNotificacionNoLeidas()
socket()

</script>

<style lang="scss">
body {
  background-color: rgba($color: black, $alpha: 0.15);
}



.btn-menu {
  display: none;
}

@media screen and (max-width: 500px) {

  .title-main {
    display: inline-block;
  }
}

@media screen and (max-width: 1024px) {
  .btn-menu {
    display: inline-flex;
  }
}
</style>
