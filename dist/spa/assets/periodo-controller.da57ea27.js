import{aq as o,ar as s,as as n}from"./index.7d30eca8.js";const i="/periodo";var u={async obtenerUltimoPeriodo(e){try{let r=await o.get(i+"/activo",s.headers());return e?e(r):r}catch(r){return e?e(n.obtenerMensajeError(r)):n.obtenerMensajeError(r)}},async obtenerTodosPeriodos(e){try{let r=await o.get(i,s.headers());return e?e(r):r}catch(r){return e?e(n.obtenerMensajeError(r)):n.obtenerMensajeError(r)}},async crearPeriodo(e,r){try{let t=await o.post(i,{periodo:e},s.headers());return r?r(t):t}catch(t){return r?r(n.obtenerMensajeError(t)):n.obtenerMensajeError(t)}},async eliminarPeriodo(e,r){try{let t=await o.delete(i+`/${e}`,s.headers());return r?r(t):t}catch(t){return r?r(n.obtenerMensajeError(t)):n.obtenerMensajeError(t)}}};export{u as p};