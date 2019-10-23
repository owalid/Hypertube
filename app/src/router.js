import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Store from './views/Store.vue'
import Movie from './views/Movie.vue'
import store from './store'
import Settings from './views/Settings.vue'
import Activate from './views/Activate.vue'
import Profile from './views/Profile.vue'
import NotFound from './views/NotFound.vue'
import { veriftoken } from './verifToken'

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      props: true,
      meta: { auth: false, transition_route: 'fade-down' }
    },
    {
      path: '/loginoauth/:token?',
      name: 'loginoauth',
      component: Home,
      props: true,
      meta: { auth: false }
    },
    {
      path: '/activate/:action/:email/:confHash',
      name: 'activate',
      props: true,
      component: Activate,
    },
    {
      path: '/store',
      name: 'store',
      component: Store,
      meta: { auth: true, transition_route: 'fade-up' }
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
      meta: { auth: true, transition_route: 'fade-right' }
    },
    {
      path: '/movie/:idMovie',
      name: 'movie',
      component: Movie,
      props: true,
      meta: { auth: true }
    },
    {
      path: '/profile/:id',
      name: 'profile',
      component: Profile,
      props: true,
      meta: { auth: true }
    },
    {
      path: '*',
      name: 'notfound',
      component: NotFound,
      meta: { auth: false, notFound: true }
    },
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.name;
  if (to.meta.auth === true) {
    if (store.state.isLog !== true && !veriftoken(router.app.$store.getters.token)) {
      next('/')
    } else {
      next()
    }
  } else if (to.name === "activate") {
    next();
  } else {
    if (store.state.isLog === true && veriftoken(router.app.$store.getters.token)) {
      next('/store')
    } else {
      next()
    }
  }
})

export default router
