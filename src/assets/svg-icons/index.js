import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

Vue.component('svg-icon', SvgIcon)
const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./icons', false, /\.svg$/)
const iconMap = requireAll(req)

Vue.prototype.$IconSvg = iconMap.map(e => e.default.id.slice(3))
