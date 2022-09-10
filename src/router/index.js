import Vue from 'vue'
import VueRouter from 'vue-router'
import NotFound from '../views/NotFound.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/help',
  },
  {
    path: '/help',
    name: 'Help',
    component: () => import(/* webpackChunkName: "help" */ '../views/Help.vue'),
  },
  {
    path: '/coverage',
    name: 'Coverage',
    component: () => import(/* webpackChunkName: "coverage" */ '../views/Coverage.vue'),
  },
  {
    path: '/:catchAll(.*)',
    component: NotFound,
    name: 'NotFound'
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
