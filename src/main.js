// polyfill
import 'babel-polyfill'
// Vue
import Vue from 'vue'
import App from './App'
// store
import store from '@/store/index'
// 多国语
import i18n from './i18n'
// 核心插件
import d2Admin from '@/plugin/d2admin'
// 路由
import router from './router'
import echarts from 'echarts';
import VCharts from 'v-charts'
import utils from './utils/utils'
// 核心插件
Vue.use(d2Admin, { store })
Vue.use(VCharts)
Vue.prototype.$echarts = echarts;
Vue.prototype.utils=utils
new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  created() {

  },
  mounted() {
    // 展示系统信息
    this.$store.commit('d2admin/releases/versionShow')
    // 用户登录后从数据库加载一系列的设置
    this.$store.dispatch('d2admin/account/load')
    // 获取并记录用户 UA
    this.$store.commit('d2admin/ua/get')
    // 初始化全屏监听
    this.$store.dispatch('d2admin/fullscreen/listen')
  },
  watch: {
    '$route.matched'(val) {
      let fullAside = this.$store.state.d2admin.menu.fullAside
      const _side = fullAside.filter(menu => menu.path === val[0].path)
      this.$store.commit('d2admin/menu/asideSet', _side.length > 0 ? _side[0].children : [])
    }
  }
}).$mount('#app')
