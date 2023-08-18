import Cookies from 'js-cookie'
import { route } from 'quasar/wrappers'
import user from 'src/controller/user'
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

    if (to.name == 'CambiarContrasenia') {
      const res = await user.verificarToken(to.params.token)
      if (res.status != 200) return next("/notfound")
      return next()

    }
    if (!requiredAuth && !isLogin) return next()
    //si existe el token en memoria
    const cookie = Cookies.get('auth-informefinal')
    if (cookie) {
      if (isLogin) return next('/')
      const res = await user.verificarSesion()
      if (res.status != 200) { Cookies.remove('auth-informefinal'); return next('/login') }
      if (requireDirector && res.data.rol == "director") return next()
      if (requireDirector && res.data.rol == "docente") return next("/notfound")
      return next()
    } else {
      if (isLogin) return next()
      return next('/login')
    }
  })

  return Router
})
