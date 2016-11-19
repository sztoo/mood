import Vue from 'vue'
import VueRouter from 'vue-router'
import VueRx from 'vue-rx'

import App from './App.vue'
import Home from './home/Home.vue'

const routes = [
  {path: '/', component: Home}
]

Vue.use(VueRx)
Vue.use(VueRouter)

const router = new VueRouter({
  routes
})

new Vue({
  router,
  el: '#app',
  render: h => h(App)
})
