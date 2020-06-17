import axios from 'axios'
import { Toast } from 'vant'

// 配置api地址
// axios设置
const $ajax = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 6000,
  withCredentials: true
})

/* 拦截器 */
$ajax.interceptors.request.use(config => {
  // 在请求发送之前做一些事
  // console.log('--发送之前--')
  // 获取插入token
  return config
}, function (error) {
  // 当出现请求错误是做一些事
  console.log('--请求超时--', error)
  Toast('请求超时，请重试')
  return Promise.reject(error)
})

// 添加一个返回拦截器
$ajax.interceptors.response.use((response) => {
  // 是否需要toast弹窗
  if (response.config.headers.noToast !== 1) {
    // 判断是否需要重新登录
    if (response.data.error_msg === '需要登录' || response.data.error_code === 1001) {
      Toast({
        message: '需要登录',
        forbidClick: true,
        duration: 1500
      })
    }
    if (response.data.error_code !== 0) {
      Toast({
        message: response.data.error_msg || '请求失败，请重试',
        forbidClick: true,
        duration: 1500
      })
    }
  }

  return response
}, function (error) {
  console.log('--响应超时--', error)
  Toast('响应超时，请重试')
  return Promise.reject(error)
})

export default $ajax
