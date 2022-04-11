import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import NotFound from '../views/NotFound.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/annotate',
    name: 'Annotate',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "annotate" */ '../views/Annotate.vue')
  },
  {
    path: '/help',
    name: 'Help',
    component: () => import(/* webpackChunkName: "help" */ '../views/Help.vue')
  },
  {
    path: '/signup',
    name: 'Sign Up',
    component: () => import(/* webpackChunkName: "signup" */ '../views/SignUp.vue')
  },
  {
    path: '/coverage',
    name: 'Coverage',
    component: () => import(/* webpackChunkName: "coverage" */ '../views/Coverage.vue')
  },
  {
    path: '/streamers',
    name: 'Streamers',
    component: () => import(/* webpackChunkName: "streamers" */ '../views/Streamers.vue')
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
