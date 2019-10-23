import Vue from 'vue'
import Vuex from 'vuex'

import d2admin from './modules/d2admin'
import region from './modules/region'
import getters from './getters'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    d2admin,
    region
  },
  getters
})
