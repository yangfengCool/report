import Vue from 'vue'
import Vuex from 'vuex'

if (process.env.NODE_DEV !== 'production') {
  Vue.use(Vuex)
}

const files = require.context('./modules', false, /\.ts$/)
const modules: any = {}

files.keys().forEach(key => {
  const tempK = key.replace(/(\.\/|\.ts)/g, '')
  modules[tempK] = files(key).default
})

export default new Vuex.Store({
  state: {
    pageTitle: '剑鱼标讯',
    direction: 'forward', // 页面切换方向
    defaultLayoutConf: {
      // layout标题,优先级高于$route.meta
      title: '',
      transparentHeader: false,
      // 是否隐藏左侧返回按钮
      actionLeftHide: '',
      actionRightText: '',
      titleStyle: {},
      actionLeftStyle: {},
      actionRightStyle: {},
      actionRightCallback: ''
    },
    layoutConf: {
      // layout标题,优先级高于$route.meta
      title: '',
      transparentHeader: false,
      // 是否隐藏左侧返回按钮
      actionLeftHide: '',
      actionRightText: '',
      titleStyle: {},
      actionLeftStyle: {},
      actionRightStyle: {},
      actionRightCallback: () => {
        // console.log('actionRight')
      }
    }
  },
  mutations: {
    // 更新页面切换方向
    updateDirection (state, direction) {
      state.direction = direction
    },
    updatePageTitle (state, title) {
      state.pageTitle = title
    },
    // 更新全局头部信息
    updateLayoutConfig (state, conf: object) {
      // 先clear
      for (const key in state.defaultLayoutConf) {
        state.layoutConf[key] = state.defaultLayoutConf[key]
      }
      // 在赋值
      for (const key in conf) {
        state.layoutConf[key] = conf[key]
      }
    },
    // 将数据恢复默认状态
    clearLayoutConfig (state) {
      for (const key in state.defaultLayoutConf) {
        state.layoutConf[key] = state.defaultLayoutConf[key]
      }
    }
  },
  actions: {},
  getters: {},
  modules
})
