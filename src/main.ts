import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/utils/'
import { Component } from 'vue-property-decorator'
import { Toast, Lazyload } from 'vant'
import VueBus from './vue_bus'

Component.registerHooks(['beforeRouteEnter', 'beforeRouteLeave', 'beforeRouteUpdate'])
Toast.setDefaultOptions({ getContainer: '#app' })

Vue.config.productionTip = false
Vue.use(Toast).use(Lazyload).use(VueBus)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
