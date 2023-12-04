<template>
  <router-view />
</template>

<script setup>
import { api } from "boot/axios";
import { useQuasar } from "quasar";

const $q = useQuasar();
api.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    if (error.response) {
      if (error.response.status == 401) {
        $q.notify({ type: "warning", message: "La sesión ha caducado" });
        return router.push({ path: "/login" });
      } else if (error.response.status == 403) {
        $q.notify({ type: "warning", message: "No autorizado" });
        return router.push({ path: "/" });
      }
    }
    return Promise.reject(error);
  }
);
</script>

<style>
html {
  scroll-behavior: smooth;
}

.text-html p {
  margin-bottom: 0px !important;
}

.tox .tox-tbtn--disabled svg,
.tox .tox-tbtn--disabled:hover svg,
.tox .tox-tbtn:disabled svg,
.tox .tox-tbtn:disabled:hover svg {
  fill: rgba(34, 47, 62, 0.5) !important;
}
</style>
