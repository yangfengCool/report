import Vue from 'vue'
import {
  dateFormatter,
  dateFromNow,
  addSpaceForTel,
  upPrice,
  formatPrice
} from './globalFunctions'

// 注册全局过滤器
// 分转元
Vue.filter('fen2Yuan', function (v) {
  return v / 100
})

// 时间格式化（同时间格式化函数）
Vue.filter('dateFormatter', dateFormatter)
// 时间戳转换 多少秒、多少分、多少小时前、多少天前  超出10天显示年月日
Vue.filter('dateFromNow', dateFromNow)
// 手机号加空格
Vue.filter('addSpaceForTel', addSpaceForTel)

// 金额大写
Vue.filter('upPrice', upPrice)
// 金额3位逗号分隔
Vue.filter('formatPrice', formatPrice)

// Vue.filter('addSpaceForBank', function (v) {
//   // 纯数字银行卡号字符串加空格
//   // return v.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
//   // 带有*的银行卡号字符串加空格
//   return v.replace(/\s/g, '').replace(/(.{4})/g, '$1 ')
// })

// Vue.filter('addConfusionForBank', function (v) {
//   // 带有*的银行卡号字符串加空格
//   if (String(v).length < 12) {
//     return v.replace(/\s/g, '').replace(/^(\d{2})\d+(\d{2})$/, '$1 **** **** $2')
//   } else {
//     return v.replace(/\s/g, '').replace(/^(\d{4})\d+(\d{4})$/, '$1 **** **** $2')
//   }
// })
