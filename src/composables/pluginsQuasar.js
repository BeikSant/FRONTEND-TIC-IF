import { useQuasar } from "quasar"


export function pluginsQuasar() {

  const $q = useQuasar()

  const NOTIFY_TYPES = {
    positive: 'positive',
    negative: 'negative',
    warning: 'warning',
    info: 'info',
    ongoing: 'ongoing'
  }

  function generateDialog(mensaje) {
    return $q.dialog({
      message: mensaje,
      progress: true,
      persistent: true,
      ok: false
    })
  }

  function generateNotify(tipo, mensaje) {
    return $q.notify({
      type: tipo,
      message: mensaje
    })
  }

  return {
    NOTIFY_TYPES,
    generateDialog,
    generateNotify
  }
}
