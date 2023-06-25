<template>
    <q-card>
        <q-card-section class="row justify-between items-center">
            <div class="row">
                <div class="col-2">
                    <q-avatar icon="warning" color="warning" text-color="white" />
                </div>
                <div class="col-10 q-pt-xs">
                    <span>¿Está seguro en eliminar la actividad especifica
                        <b>{{ props.actividadEliminar }}</b>?
                    </span>
                </div>
            </div>
        </q-card-section>

        <q-card-actions class="justify-end">
            <q-btn flat label="Cancelar" color="negative" v-close-popup />
            <q-btn label="Aceptar" color="primary" @click="ejecutarFuncion" />
        </q-card-actions>
    </q-card>
</template>

<script setup>
const props = defineProps({
    actividadEliminar: {
        type: String,
        default: ""
    },
    function: {
        type: Function,
        required: true,
    }
})

function ejecutarFuncion() {
    props.function()
}

</script>