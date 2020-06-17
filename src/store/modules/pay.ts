import {
  getWxSdkSign,
  paySign,
  isPaySuccess,
  orderDetail,
  invokeIsOver
} from '@/api/pay'

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    // 获取微信Sdk ['appId','timestamp','nonceStr','signature']
    async getWxSdkSign (state, data: any) {
      try {
        const res = await getWxSdkSign(data)
        return res.data
      } catch (error) {}
    },
    // 支付接口
    async paySign (state, data: any) {
      try {
        const res = await paySign(data)
        return res.data
      } catch (error) {}
    },
    // 查询是否支付成功
    async isPaySuccess (state, data: any) {
      try {
        const res = await isPaySuccess(data)
        return res.data
      } catch (error) {}
    },
    // 获取订单信息
    async orderDetail (state, data: any) {
      try {
        const res = await orderDetail(data)
        return res.data
      } catch (error) {}
    },
    // 查询发票是否过期
    async invokeIsOver (state, data: any) {
      try {
        const res = await invokeIsOver(data)
        return res.data
      } catch (error) {}
    }
  },
  getters: {}
}
