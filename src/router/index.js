import Vue from 'vue'
import VueRouter from 'vue-router'
import authGuard from '../auth/authGuard'
import HomePage from '../pages/HomePage'
import goTo from 'vuetify/es5/services/goto'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/cars',
    component: () => import('../pages/CarsPage.vue')
  },
  {
    path: '/cars/add',
    component: () => import('../pages/CreateCarPage.vue')
  },
  {
    path: '/requests',
    component: () => import('../pages/RequestsPage.vue')
  },
  {
    path: '/forbidden',
    component: () => import('../pages/ForbiddenPage.vue'),
  },
  {
    path: '/cars/:carId',
    component: () => import('../pages/CarDetailPage.vue'),
    props: true
  },
  {
    path: '*',
    name: 'NotFound',
    component: () => import('../pages/NotFoundPage.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior: (to, from, savedPosition) => {
    let scrollTo = 0

    if (to.hash) {
      scrollTo = to.hash
    } else if (savedPosition) {
      scrollTo = savedPosition.y
    }

    return goTo(scrollTo)
  }
})

router.beforeEach((to, from, next) => {
  if (to.path === '/forbidden' || to.path === '/') next()
  else authGuard(to, from, next)
})

export default router
