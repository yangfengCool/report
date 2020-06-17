import request from '@/api/config.ts'
import qs from 'qs'

// 获取wxSdkSign, 这个方法在 @/utils/globalVariable.ts中调用
export function getWxSdkSign (data: any) {
  data = qs.stringify(data)
  return request({
    baseURL: '',
    url: '/jypay/wx/getwxSdkSign',
    method: 'post',
    headers: {
      noToast: 1
    },
    data
  })
}

// app支付
export function paySign (data: any) {
  data = qs.stringify(data)
  return request({
    url: '/pay',
    method: 'post',
    data
  })
}

// 查询是否支付成功
export function isPaySuccess (data: any) {
  data = qs.stringify(data)
  return request({
    url: '/paySuccess',
    method: 'post',
    data
  })
}

// 查询订单详情
export function orderDetail (data: any) {
  data = qs.stringify(data)
  return request({
    url: '/orderDetail',
    method: 'post',
    data
  })
}

// 查询订单详情
export function invokeIsOver (data: any) {
  data = qs.stringify(data)
  return request({
    baseURL: '',
    url: '/subscribepay/orderListDetails/isOver',
    method: 'post',
    headers: {
      noToast: 1
    },
    data
  })
}
