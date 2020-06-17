import {
  getReportList,
  getReportDetail,
  userMsg,
  orderSubmit,
  sEmailCode,
  cEmailCode
} from '@/api/home'

export default {
  namespaced: true,
  state: {
    // 数据报告列表
    reportList: sessionStorage.getItem('report-list') ? JSON.parse(sessionStorage.getItem('report-list') || '') : {
      list: [],
      loading: false,
      finished: false,
      currentPage: 1,
      totalPage: 0,
      scroll: 0
    },
    // 数据报告详情
    reportInfo: sessionStorage.getItem('report-info') ? JSON.parse(sessionStorage.getItem('report-info') || '') : {
      id: null,
      before_price: 0,
      price: 0,
      pushtime: 0
    },
    // 购买页面数据保存
    buyState: sessionStorage.getItem('activity-x-buyState') ? JSON.parse(sessionStorage.getItem('activity-x-buyState') || '') : {}
  },
  mutations: {
    // 保存数据报告列表
    saveReportList (state, data) {
      for (const key in data) {
        state.reportList[key] = data[key]
      }
      sessionStorage.setItem('report-list', JSON.stringify(data))
    },
    // 清除数据报告列表
    clearReportList (state) {
      state.reportList = {}
      sessionStorage.setItem('report-list', JSON.stringify({}))
    },
    // 保存数据报告详情
    saveReportInfo (state, data) {
      for (const key in data) {
        state.reportInfo[key] = data[key]
      }
      sessionStorage.setItem('report-info', JSON.stringify(data))
    },
    // 保存购买信息
    saveBuyState (state, data) {
      for (const key in data) {
        state.buyState[key] = data[key]
      }
      sessionStorage.setItem('activity-x-buyState', JSON.stringify(data))
    },
    clearBuyState (state) {
      state.buyState = {}
      sessionStorage.setItem('activity-x-buyState', JSON.stringify({}))
    }
  },
  actions: {
    // 数据报告列表接口
    async getReportList (state, data: any) {
      try {
        const res = await getReportList(data)
        return res.data
      } catch (error) {}
    },
    // 数据报告详情页接口
    async getReportDetail (state, data: any) {
      try {
        const res = await getReportDetail(data)
        return res.data
      } catch (error) {}
    },
    // 获取信息
    async orderSubmit (state, data: any) {
      try {
        const res = await orderSubmit(data)
        return res.data
      } catch (error) {}
    },
    // 获取信息
    async getUserMsg (state) {
      try {
        const res = await userMsg()
        return res.data
      } catch (error) {}
    },
    // 获取信息
    async sendEmailCode (state, data: any) {
      try {
        const res = await sEmailCode(data)
        return res.data
      } catch (error) {}
    },
    // 获取信息
    async checkEmailCode (state, data: any) {
      try {
        const res = await cEmailCode(data)
        return res.data
      } catch (error) {}
    }
  },
  getters: {}
}
