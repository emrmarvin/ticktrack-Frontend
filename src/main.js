import Vue from 'vue'
import App from './App.vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import router from './router'
import vuetify from './plugins/vuetify'
import store from './store'
import moment from 'moment'
import './plugins/chartist'
import JsonCSV from 'vue-json-csv'
import JsonExcel from 'vue-json-excel'
import DaySpanVuetify from 'dayspan-vuetify'
import VueExcelXlsx from "vue-excel-xlsx";
import VueTour from 'vue-tour'

import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'dayspan-vuetify/dist/lib/dayspan-vuetify.min.css'

Vue.config.productionTip = false
Vue.prototype.moment = moment
Vue.component('downloadCsv', JsonCSV);
Vue.component('downloadExcel', JsonExcel)
Vue.use(VueExcelXlsx);
Vue.use(require('vue-chartist'))
Vue.use(VueTour)

Vue.use(DaySpanVuetify, {
  methods: {
    getDefaultEventColor: () => '#1976d2'
  }
});

require('vue-tour/dist/vue-tour.css')

const requireComponent = require.context(
  './components',
  false,
  /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)

  const componentName = upperFirst(
    camelCase(fileName.replace(/^\.\/(.*)\.\w+$/, '$1'))
  )

  Vue.component(componentName, componentConfig.default || componentConfig)
})


new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
