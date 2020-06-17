import request from '@/api/config.ts'
import qs from 'qs'

// 数据报告列表接口
export function getReportList (data: any) {
  return request({
    url: '/getList',
    method: 'post',
    data
  })
}

// 数据报告详情页
export function getReportDetail (data: any) {
  return request({
    url: '/getDetail',
    method: 'post',
    data
  })
}

// 数据报告详情页
export function orderSubmit (data: any) {
  data = qs.stringify(data)
  return request({
    url: '/orderSubmit',
    method: 'post',
    data
  })
}

// 查询用户是否已经填写过邮箱或者手机号
export function userMsg () {
  return request({
    url: '/userMsg',
    method: 'get'
  })
}

// 发送邮箱验证码
export function sEmailCode (data: any) {
  data = qs.stringify(data)
  return request({
    url: '/sendEmailCode',
    method: 'post',
    data
  })
}

// 校验邮箱验证码
export function cEmailCode (data: any) {
  data = qs.stringify(data)
  return request({
    url: '/checkEmailCode',
    method: 'post',
    data
  })
}
