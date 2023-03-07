import { route } from 'quasar/wrappers'
import user from 'src/controller/user'
import { useAuthStore } from 'src/stores/auth-stores'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach(async (to, from, next) => {
    const requiredAuth = to.meta.auth
    const requireDirector = to.meta.requireDirector
    const isLogin = to.meta.isLogin
    const useStore = useAuthStore()
    if (to.name == 'CambiarContrasenia') {
      const res = await user.verificarToken(to.params.token)
      if (res.status != 200) return next("/inautorizado")
      return next()

    }
    if (!requiredAuth && !isLogin) return next()
    //si existe el token en memoria
    if (useStore.token) {
      if (isLogin) return next('/')
      if (requireDirector && useStore.rol == "director") return next()
      if (requireDirector && useStore.rol == "docente") return next("/inautorizado")
      return next()
    }
    await useStore.refreshToken()
    if (useStore.token) {
      if (isLogin) return next('/')
      if (requireDirector && useStore.rol == "director") return next()
      if (requireDirector && useStore.rol == "docente") return next("/inautorizado")
      return next()
    } else {
      if (isLogin) return next()
      return next('/login')
    }
  })

  return Router
})
