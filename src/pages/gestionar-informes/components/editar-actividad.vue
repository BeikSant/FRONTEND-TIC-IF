<template>
  <q-card>
    <q-card-section class="bg-primary text-h6 text-bold text-white">
      <span>{{ "Editar Actividad" }}</span>
    </q-card-section>
    <q-separator />
    <q-form @submit="guardarActividad()">
      <q-card-section
        class="row q-col-gutter-y-xl q-col-gutter-x-md q-col-gutter-sm-y-lg"
      >
        <q-select
          class="col-6"
          outlined
          square
          v-model="actividadDistributivo"
          :options="selectActividades"
          label="Codificación"
          :rules="[(val) => (val && val.length > 0) || 'Selecciona una opción']"
          :disable="editarActividad && actividadEspecificaEditar.requerido"
          hint="Seleccione la codificación de la actividad"
        />

        <q-input
          class="col-6"
          outlined
          square
          type="number"
          v-model="actividad.horas"
          label="Horas"
          lazy-rules
          :rules="[
            (val) => (val !== null && val !== '') || 'Este campo es requerido',
            (val) => val > 0 || 'El número de horas debe ser mayor a 0',
          ]"
          hint="Ingrese el numero de horas"
        >
          <template v-slot:append>
            <q-icon name="mdi-clock" />
          </template>
        </q-input>

        <q-input
          class="col-12"
          outlined
          square
          v-model="actividad.nombre"
          label="Nombre Actividad"
          hint="Ingrese el nombre de la actividad"
          :prefix="actividadDistributivo + ' - '"
          lazy-rules
          autogrow
          :rules="[(val) => (val && val.length > 0) || 'Este campo es requerido']"
        />
      </q-card-section>
      <q-separator />
      <q-card-actions class="justify-end">
        <q-btn label="Cancelar" @click="closeDialog()" flat color="negative" />
        <q-btn label="Guardar" type="submit" color="positive" />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup>
import especificaController from "src/controller/especifica-controller";
import { onMounted, ref } from "vue";
import { pluginsQuasar } from "src/composables/pluginsQuasar";

const pgQuasar = pluginsQuasar();
const props = defineProps({
  actividadEditar: {
    type: Object,
    required: true,
  },
  closeDialog: {
    type: Function,
    required: true,
  },

  actualizarLista: {
    type: Function,
    required: true,
  },
});

const actividadDistributivo = ref("");

const actividad = ref({
  horas: 1,
  nombre: null,
});

async function guardarActividad() {
  const dialogo = pgQuasar.generateDialog("Guardando Actividad...");
  const res = await especificaController.editarActividad(props.actividadEditar._id, {
    horas: actividad.value.horas,
    nombre: actividadDistributivo.value + " - " + actividad.value.nombre,
  });
  if (res.status > 199 && res.status < 300) {
    await props.actualizarLista();
    props.closeDialog();
    pgQuasar.generateNotify(
      pgQuasar.NOTIFY_TYPES.positive,
      "Actividad guardada con éxito"
    );
    dialogo.hide();
  } else {
    dialogo.hide();
    pgQuasar.generateNotify(pgQuasar.NOTIFY_TYPES.negative, res.message);
  }
}

onMounted(() => {
  actividadDistributivo.value = props.actividadEditar.nombre.split(" - ")[0];
  actividad.value = {
    horas: props.actividadEditar.horas,
    nombre: props.actividadEditar.nombre.split(" - ").slice(1).join(),
  };
});
</script>

<style lang="scss" scoped></style>
