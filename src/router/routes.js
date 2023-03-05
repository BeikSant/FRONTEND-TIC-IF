
const routes = [
  {
    path: '/',
    component: () => import('layouts/HomePage.vue'),
    children: [
      {
        path: '', component: () => import('pages/IndexPage.vue'),
        meta: {
          auth: true,
        }
      }
    ]
  },
  {
    path: '/docente',
    component: () => import('layouts/HomePage.vue'),
    children: [
      {
        path: '', component: () => import('pages/docente/MainPage.vue'),
        meta: {
          auth: true,
          requireDirector: true
        }
      }
    ]
  },
  {
    path: '/distributivo',
    component: () => import('layouts/HomePage.vue'),
    children: [
      {
        path: 'ver', component: () => import('pages/distributivo/VerActividadesPage.vue'),
        meta: {
          auth: true,
        }
      }
    ]
  },
  {
    path: '/informe',
    component: () => import('layouts/HomePage.vue'),
    children: [
      {
        path: 'gestionar', component: () => import('pages/gestionarInforme/MainPage.vue'),
        meta: {
          auth: true,
        }
      },
      {
        path: 'administrar', component: () => import('pages/administrarInforme/MainPage.vue'),
        meta: {
          auth: true,
          requireDirector: true
        }
      },
      {
        path: 'historial', component: () => import('pages/historialInforme/MainPage.vue'),
        meta: {
          auth: true,
        }
      }
    ]
  },


  {
    path: '/login',
    children: [
      {
        path: '', component: () => import('pages/auth/LoginPage.vue'),
        meta: {
          isLogin: true
        }
      }
    ],
  },
  {
    path: '/recuperar/cuenta',
    children: [
      {
        path: '', component: () => import('pages/auth/RecuperarCuenta.vue'),
      },
      {
        name: 'CambiarContrasenia',
        path: ':token', component: () => import('pages/auth/CambiarContrasenia.vue'),
      }
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  },
  {
    path: '/inautorizado',
    component: () => import('pages/InautorizadoPage.vue')
  }
]

export default routes
