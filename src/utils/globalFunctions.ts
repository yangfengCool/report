import moment from 'moment'

// 是否是微信浏览器 ------------>
export function isWeiXinBrowser () {
  return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
}

// 在安卓或者ios中
export function androidOrIOS () {
  const u = navigator.userAgent.toLowerCase()
  let agent = ''
  if (/iphone|ipod|ipad|ios/.test(u)) {
    agent = 'ios'
  } else {
    agent = 'android'
  }
  return agent
}

// 字符串处理相关函数
// 手机号中间4位加* ------------>
export function addConfusionForTel (tel: string) {
  const reg = /^(\d{3})\d{4}(\d{4})$/
  return tel.replace(reg, '$1****$2')
}
// 手机号加空格 ------------>
export function addSpaceForTel (tel) {
  const regMap = {
    isConfuse: /^(\d{3})\*{4}(\d{4})$/,
    addSpace: /^(\d{3})(\d{4})(\d{4})$/
  }
  const confusion = regMap.isConfuse.test(tel)
  if (confusion) {
    return tel.replace(regMap.isConfuse, '$1 **** $2')
  } else {
    return tel.replace(regMap.addSpace, '$1 $2 $3')
  }
}

// 金额大写，链接：https://juejin.im/post/5a2a7a5051882535cd4abfce
// upDigit(1682) result："人民币壹仟陆佰捌拾贰元整"
// upDigit(-1693) result："欠壹仟陆佰玖拾叁元整"
export function upPrice (n) {
  const fraction = ['角', '分', '厘']
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟']
  ]
  // const head = n < 0 ? '欠人民币' : '人民币'
  const head = ''
  n = Math.abs(n)
  let s = ''
  for (let i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')
  }
  s = s || '整'
  n = Math.floor(n)
  for (let i = 0; i < unit[0].length && n > 0; i++) {
    let p = ''
    for (let j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p
      n = Math.floor(n / 10)
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
    // s = p + unit[0][i] + s;
  }
  return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整')
}

// 金额3位逗号分隔  ------------>
export function formatPrice (s, n = -1, comma = false) {
  if (n !== -1) n = n > 0 && n <= 20 ? n : 2
  const intS = parseInt(s)
  let point = '.'
  let left = []
  let right = ''
  s = parseFloat((s + '').replace(/[^\d.-]/g, ''))
  // 没传n或者n为-1，默认(如果为整数，则不保留小数。如果为浮点数，则保留两位小数)
  if (n === -1) {
    if (s === intS) {
      n = 0
      right = ''
      point = ''
    } else {
      n = 2
      s = s.toFixed(n)
      right = s.split('.')[1]
    }
    s = s + ''
    left = s.split('.')[0].split('').reverse()
  } else {
    s = parseFloat((s + '').replace(/[^\d.-]/g, '')).toFixed(n) + ''
    left = s.split('.')[0].split('').reverse()
    right = s.split('.')[1]
  }

  if (comma) {
    let t = ''
    for (let i = 0; i < left.length; i++) {
      t += left[i] + ((i + 1) % 3 === 0 && (i + 1) !== left.length ? ',' : '')
    }
    return t.split('').reverse().join('') + point + right
  }

  return left.reverse().join('') + point + right
}

// 时间格式化相关函数
/*
* 时间格式化函数(将时间格式化为，2019年08月12日，2019-08-12，2019/08/12的形式)
*   pattern参数（想要什么格式的数据就传入什么格式的数据）
*     · 'yyyy-MM-dd'  ---> 输出如2019-09-20
*     · 'yyyy-MM-dd HH:mm'  --->  输出如2019-09-20 18:20
*     · 'yyyy-MM-dd HH:mm:ss'  --->  输出如2019-09-20 06:20:23
*     · 'yyyy/MM/dd'  --->  输出如2019/09/20
*     · 'yyyy年MM月dd日'  --->  输出如2019年09月20日
*     · 'yyyy年MM月dd日 HH时mm分'  --->  输出如2019年09月20日 18时20分
*     · 'yyyy年MM月dd日 HH时mm分ss秒'  --->  输出如2019年09月20日 18时20分23秒
*     · 'yyyy年MM月dd日 HH时mm分ss秒 EE'  --->  输出如2019年09月20日 18时20分23秒 周二
*     · 'yyyy年MM月dd日 HH时mm分ss秒 EEE'  --->  输出如2019年09月20日 18时20分23秒 星期二
*  参考: https://www.cnblogs.com/mr-wuxiansheng/p/6296646.html
*/
export function dateFormatter (date, fmt = 'yyyy-MM-dd HH:mm:ss') {
  // 将传入的date转为时间对象
  if (!date) return ''
  date = new Date(moment(date).valueOf())
  const o = {
    'y+': date.getFullYear(),
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    // 12小时制
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
    // 24小时制
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
    'E+': date.getDay() // 周
  }
  const week = {
    0: '日',
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六'
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '星期' : '周') : '') + week[date.getDay() + ''])
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

// 时间戳转换 多少秒、多少分、多少小时前、多少天前  超出10天显示年月日
// 传入一个时间戳
export function dateFromNow (timestamp: number) {
  const date1 = new Date(timestamp) // 开始时间
  const date2 = new Date() // 结束时间
  const date3 = date2.getTime() - date1.getTime() // 时间差的毫秒数
  // 计算出相差天数
  const days = Math.floor(date3 / (24 * 3600 * 1000))
  // 计算出小时数
  const leave1 = date3 % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
  const hours = Math.floor(leave1 / (3600 * 1000))
  // 计算相差分钟数
  const leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
  const minutes = Math.floor(leave2 / (60 * 1000))
  // 计算相差秒数
  let td = '30秒前'
  if (days > 0) {
    if (days > 10) {
      const date1year = date1.getFullYear()
      const date2year = date2.getFullYear()
      let date1month: any = date1.getMonth() + 1
      let date1day: any = date1.getDate()
      if (date1month < 10) {
        date1month = '0' + date1month
      }
      if (date1day < 10) {
        date1day = '0' + date1day
      }
      if (date1year < date2year) {
        td = date1.getFullYear() + '-' + date1month + '-' + date1day
      } else {
        td = date1month + '-' + date1day
      }
    } else {
      td = days + '天前'
    }
  } else if (hours > 0) {
    td = hours + '小时前'
  } else if (minutes > 0) {
    td = minutes + '分钟前'
  }
  return td
}

// DOM操作相关函数
// 键盘抬起底部按钮隐藏
// 传入输入框的DOM对象 和 footer的DOM对象
export function inputFocusHideFooter (inputs: Array<any>, footer: any) {
  const isShowBtn = function (f) {
    if (f) {
      footer.style.display = ''
    } else {
      footer.style.display = 'none'
    }
  }

  const ua = window.navigator.userAgent.toLocaleLowerCase()
  const isIOS = /iphone|ipad|ipod/.test(ua)
  const isAndroid = /android/.test(ua)

  // 监听输入框的软键盘弹起和收起事件
  if (isIOS) {
    inputs.forEach((item, index) => {
      item.addEventListener('focus', function () {
        console.log('IOS 键盘弹出')
        // IOS 键盘弹起后操作
        isShowBtn(false)
      }, false)

      // IOS 键盘收起：IOS 点击输入框以外区域或点击收起按钮，输入框都会失去焦点，键盘会收起，
      item.addEventListener('blur', () => {
        console.log('IOS 键盘收起')
        // IOS 键盘收起后操作
        isShowBtn(true)
      })
    })
  }

  // Andriod 键盘收起：Andriod 键盘弹起或收起页面高度会发生变化，以此为依据获知键盘收起
  if (isAndroid) {
    const clientHeight = document.documentElement.clientHeight || document.body.clientHeight

    window.addEventListener('resize', function () {
      const nowClientHeight = document.documentElement.clientHeight || document.body.clientHeight
      if (clientHeight > nowClientHeight) {
        // 键盘弹出的事件处理
        console.log('Android 键盘弹出')
        isShowBtn(false)
      } else {
        // 键盘收起的事件处理
        isShowBtn(true)
        console.log('Android 键盘收起')
      }
    }, false)
  }
}
