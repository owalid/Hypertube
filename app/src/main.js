import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './plugins/i18n'
import './registerServiceWorker'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import { Promised }  from "vue-promised";

Vue.config.productionTip = false

window.axios = axios;
Vue.component('Promised', Promised);

new Vue({
  i18n,
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
