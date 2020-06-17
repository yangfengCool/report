// https://www.cnblogs.com/sosoqi/p/9969929.html
import layout from '@/components/layout'

function plugin (Vue) {
  if (plugin.installed) {
    return
  }

  Vue.component('layout', layout)
}

export default plugin
