import { defineStore } from 'pinia';
import docenteController from 'src/controller/docente';
import { ref } from 'vue'

export const useUserStore = defineStore("user", () => {

  const user = ref(null)

  async function obtenerUsuario() {
    const res = await docenteController.obtenerPerfilDocente();
    user.value = { ...res.data.docente }
  }

  obtenerUsuario()

  return { user, obtenerUsuario }

});
