
const routes = [
  {
    path: '',
    component: () => import('layouts/HomePage.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/pagina-inicio.vue'),
        meta: {
          auth: true,
        }
      },
      {
        path: 'docentes',
        component: () => import('src/pages/administrar-docentes/pagina-principal.vue'),
        meta: {
          auth: true,
          requireDirector: true
        }
      },
      {
        path: 'distributivo',
        component: () => import('src/pages/distributivo-general/pagina-principal.vue'),
        meta: {
          auth: true,
        }
      },
      {
        path: 'periodo',
        component: () => import('src/pages/periodo_academico/pagina-principal.vue'),
        meta: {
          auth: true,
          requireDirector: true
        }
      },
      {
        path: 'informe',
        children: [
          {
            path: 'gestionar',
            component: () => import('pages/gestionar-informes/pagina-principal.vue'),
            meta: {
              auth: true,
            }
          },
          {
            path: 'revision',
            component: () => import('pages/revisar-informes/pagina-principal.vue'),
            meta: {
              auth: true,
              requireDirector: true
            }
          },
          {
            path: 'formato',
            component: () => import('pages/formato-informe/pagina-principal.vue'),
            meta: {
              auth: true,
              requireDirector: true
            }
          },
          {
            path: 'registro',
            component: () => import('pages/registro-informes/pagina-principal.vue'),
            meta: {
              auth: true,
            }
          }
        ]
      }
    ]
  },

  {
    path: '/login',
    children: [
      {
        path: '', component: () => import('pages/autorizacion/pagina-login.vue'),
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
        path: '', component: () => import('pages/autorizacion/recuperar-cuenta.vue'),
      },
      {
        name: 'CambiarContrasenia',
        path: ':token', component: () => import('pages/autorizacion/cambiar-contrasenia.vue'),
      }
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/error-no-encontrado.vue')
  },
  {
    path: '/notfound',
    component: () => import('src/pages/error-no-encontrado.vue')
  }
]

export default routes
