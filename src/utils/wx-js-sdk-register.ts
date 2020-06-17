declare const wx: any
declare const WeixinJSBridge: any

// 官方文档
// https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html

// 参考1: https://github.com/wxt365/JWeixinApi/blob/master/jweixinapi.js
// 参考2: https://my.oschina.net/u/2405644/blog/492396
class WeiXinSDK {
  env = {
    // 微信JSSDK版本
    version: '1.6.0',
    isWeiXinBrowser: navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
  }

  config = {
    // 是否开启调试
    WeiXinDebugMode: false,
    // 当前url(发送到后端进行注册的，包含参数)
    configUrl: location.href.split('#')[0],
    // 分享配置文件中的url
    shareUrl: location.href.split('?')[0],
    configData: {
      // 公众号的唯一标识
      appId: '',
      // 生成签名的时间戳
      timestamp: '',
      // 生成签名的随机串
      nonceStr: '',
      // 签名，见附录1
      signature: ''
    },
    jsApiList: [
      // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
      'updateAppMessageShareData',
      // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
      'updateTimelineShareData',
      // 获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
      // 'onMenuShareWeibo',
      // 图片预览
      // 'imagePreview',
      // 获取网络状态接口
      // 'getNetworkType',
      // 获取地理位置接口
      // 'getLocation',
      // 使用微信内置地图<查看>位置接口
      // 'openLocation',
      // 批量隐藏功能按钮接口
      // 'hideMenuItems',
      // 批量显示功能按钮接口
      // 'showMenuItems',
      // 隐藏所有非基础按钮接口
      // 'hideAllNonBaseMenuItem',
      // 显示所有功能按钮接口
      // 'showAllNonBaseMenuItem',
      // 调起微信扫一扫接口
      // 'scanQRCode',
      // 关闭当前网页窗口接口
      'closeWindow',
      // 发起一个微信支付请求
      'chooseWXPay'
    ]
  }

  currentLocation = {
    // 纬度，浮点数，范围为90 ~ -90
    latitude: 0,
    // 经度，浮点数，范围为180 ~ -180
    longitude: 0,
    // 速度，以米/每秒计
    speed: 0,
    // 位置精度
    accuracy: 0
  }

  defaultShareInfo = {
    // 分享标题
    title: '剑鱼标讯',
    // 分享描述
    desc: '全国招标信息免费看，不遮挡',
    // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    link: this.config.shareUrl,
    // 分享图标
    imgUrl: 'https://cdn-ali.jianyu360.com/images/appext/fixed-sm.jpg'
  }

  constructor (data: object) {
    if (!this.env.isWeiXinBrowser) return
    this.initSignature(data)
  }

  initSignature (data: object) {
    this.setConfigData(data)
    this.setConfig()
  }

  // 将constructor中传入的值赋值到全局
  setConfigData (data) {
    for (const key in this.config.configData) {
      this.config.configData[key] = data[key]
    }
  }

  // wxJSSDK注册
  setConfig () {
    wx.config({
      // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      debug: this.config.WeiXinDebugMode,
      // // 必填，公众号的唯一标识
      // appId: data.appId,
      // // 必填，生成签名的时间戳
      // timestamp: data.timestamp,
      // // 必填，生成签名的随机串
      // nonceStr: data.nonceStr,
      // // 必填，签名，见附录1
      // signature: data.signature,
      ...this.config.configData,
      // 必填，需要使用的JS接口列表
      jsApiList: this.config.jsApiList
    })
  }

  // 将分享数据整理
  getShareInfo (data) {
    // 如果是null或者空对象
    if (!data || (data && Object.keys(data).length === 0)) {
      return this.defaultShareInfo
    } else {
      const shareInfo = JSON.parse(JSON.stringify(this.defaultShareInfo))
      for (const key in shareInfo) {
        if (data[key]) {
          shareInfo[key] = data[key]
        }
      }
      return shareInfo
    }
  }

  // 检查微信api是否可用
  checkJsApi (apiList: any = [], callback?: Function) {
    apiList = apiList.length === 0 ? this.config.jsApiList : apiList
    wx.checkJsApi({
      // 需要检测的JS接口列表
      jsApiList: apiList,
      success: res => {
        // 以键值对的形式返回，可用的api值true，不可用为false
        // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
        console.log(res)
        callback && callback(res)
      }
    })
  }

  ready (callback?: Function) {
    wx.ready(() => {
      if (typeof callback === 'function') {
        // callback && callback.call(this)
        callback && callback()
      }
    })
  }

  // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
  shareToFriendAndQQ (options: any = {}) {
    // 如果不传配置，就使用默认的配置
    const config = this.getShareInfo(options.config)
    // 执行分享
    this.ready(() => {
      wx.updateAppMessageShareData({
        ...config,
        // title: config.title,
        // desc: config.desc,
        // link: config.link,
        // imgUrl: config.imgUrl,
        success: () => {
          // 用户确认分享后执行的回调函数
          options && options.success && options.success()
        },
        cancel: () => {
          // 用户取消分享后执行的回调函数
          options && options.cancel && options.cancel()
        },
        fail: () => {
          // 接口调用失败时执行的回调函数
          options && options.fail && options.fail()
        },
        complete: () => {
          // 接口调用完成时执行的回调函数，无论成功或失败都会执行。
          options && options.complete && options.complete()
        }
      })
    })
  }

  // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
  shareToFriendsAndQZone (options: any = {}) {
    // 如果不传配置，就使用默认的配置
    const config = this.getShareInfo(options.config)
    // 执行分享
    this.ready(() => {
      wx.updateTimelineShareData({
        ...config,
        // title: config.title,
        // desc: config.desc,
        // link: config.link,
        // imgUrl: config.imgUrl,
        success: () => {
          // 用户确认分享后执行的回调函数
          options && options.success && options.success()
        },
        cancel: () => {
          // 用户取消分享后执行的回调函数
          options && options.cancel && options.cancel()
        },
        fail: () => {
          // 接口调用失败时执行的回调函数
          options && options.fail && options.fail()
        },
        complete: () => {
          // 接口调用完成时执行的回调函数，无论成功或失败都会执行。
          options && options.complete && options.complete()
        }
      })
    })
  }

  // 自定义“分享到微博”
  shareToWeiBo (options: any = {}) {
    // 如果不传配置，就使用默认的配置
    const config = this.getShareInfo(options.config)
    // 执行分享
    wx.onMenuShareWeibo({
      ...config,
      // title: config.title,
      // desc: config.desc,
      // link: config.link,
      // imgUrl: config.imgUrl,
      success: () => {
        // 用户确认分享后执行的回调函数
        options && options.success && options.success()
      },
      cancel: () => {
        // 用户取消分享后执行的回调函数
        options && options.cancel && options.cancel()
      },
      fail: () => {
        // 接口调用失败时执行的回调函数
        options && options.fail && options.fail()
      },
      complete: () => {
        // 接口调用完成时执行的回调函数，无论成功或失败都会执行。
        options && options.complete && options.complete()
      }
    })
  }

  // 微信js-sdk支付
  chooseWXPay (options: any) {
    // 执行支付
    wx.chooseWXPay({
      // appId: this.config.configData.appId,
      ...options.config,
      // timestamp: config.timestamp,
      // nonceStr: config.nonceStr,
      // package: config.package,
      // signType: config.signType,
      // paySign: config.paySign,
      success: () => {
        // 用户确认支付后执行的回调函数
        options && options.success && options.success()
      },
      cancel: () => {
        // 用户取消支付后执行的回调函数
        options && options.cancel && options.cancel()
      },
      fail: () => {
        // 接口调用失败时执行的回调函数
        options && options.fail && options.fail()
      },
      complete: () => {
        // 接口调用完成时执行的回调函数，无论成功或失败都会执行。
        options && options.complete && options.complete()
      }
    })
  }

  // https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=7_7&index=6
  chooseWXPayForWeiXinJSBridge (options: any) {
    // 调用WeixinJSBridge支付
    WeixinJSBridge.invoke('getBrandWCPayRequest', {
      appId: options.config.appId,
      timeStamp: options.config.timestamp,
      nonceStr: options.config.nonceStr,
      package: options.config.package,
      signType: options.config.signType,
      paySign: options.config.paySign
    }, (res) => {
      if (res.err_msg === 'get_brand_wcpay_request:ok') {
        // 使用以上方式判断前端返回,微信团队郑重提示：
        // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
        options && options.success && options.success()
      } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
        options && options.cancel && options.cancel()
      } else {
        options && options.fail && options.fail()
      }
    })
  }

  closeWindow () {
    wx.closeWindow()
  }

  hideOptionMenu () {
    wx.hideOptionMenu()
  }

  showOptionMenu () {
    wx.showOptionMenu()
  }

  hideMenuItems (menuList = []) {
    // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
    wx.hideMenuItems({
      menuList
    })
  }

  showMenuItems (menuList = []) {
    // 要显示的菜单项，所有menu项见附录3
    wx.showMenuItems({
      menuList
    })
  }

  hideAllNonBaseMenuItem () {
    wx.hideAllNonBaseMenuItem()
  }

  showAllNonBaseMenuItem () {
    wx.showAllNonBaseMenuItem()
  }

  getNetworkType (options: any) {
    wx.getNetworkType({
      success: (res) => {
        // 用户确认支付后执行的回调函数
        // 返回网络类型2g，3g，4g，wifi
        options && options.success && options.success(res)
      },
      cancel: () => {
        // 用户取消支付后执行的回调函数
        options && options.cancel && options.cancel()
      },
      fail: () => {
        // 接口调用失败时执行的回调函数
        options && options.fail && options.fail()
      },
      complete: () => {
        // 接口调用完成时执行的回调函数，无论成功或失败都会执行。
        options && options.complete && options.complete()
      }
    })
  }

  /**
   * 调起微信Native的图片播放组件。
   * 这里必须对参数进行强检测，如果参数不合法，直接会导致微信客户端crash
   *
   * @param {String} curSrc 当前播放的图片地址
   * @param {Array} srcList 图片地址列表
   */
  imagePreview (curSrc: string, srcList: Array<string>) {
    if (!curSrc || !srcList || srcList.length === 0) {
      return
    }
    wx.previewImage({
      // 当前显示图片的http地址
      current: curSrc,
      // 需要预览的图片http地址列表
      urls: srcList
    })
  }

  getLocation (options: any) {
    wx.getLocation({
      // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
      type: options.type === undefined ? 'wgs84' : options.type,
      success: (res) => {
        // for (const key in this.currentLocation) {
        //   this.currentLocation[key] = res[key]
        // }
        this.currentLocation = res
        options && options.success && options.success(res)
      },
      cancel: (res) => {
        // 用户取消支付后执行的回调函数
        options && options.cancel && options.cancel(res)
      },
      fail: (res) => {
        // 接口调用失败时执行的回调函数
        options && options.fail && options.fail(res)
      },
      complete: () => {
        // 接口调用完成时执行的回调函数，无论成功或失败都会执行。
        options && options.complete && options.complete()
      }
    })
  }

  openLocation (data: object) {
    wx.openLocation({
      ...data
      // latitude: 0, // 纬度，浮点数，范围为90 ~ -90
      // longitude: 0, // 经度，浮点数，范围为180 ~ -180。
      // name: '', // 位置名
      // address: '', // 地址详情说明
      // scale: 1, // 地图缩放级别,整形值,范围从1~28。默认为最大
      // infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
    })
  }

  // 调起微信扫一扫接口
  scanQRCode (options: any) {
    wx.scanQRCode({
      needResult: options.needResult === undefined ? 0 : options.needResult, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果
      scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
      success: (res) => {
        // 当needResult 为 1 时，扫码返回的结果
        console.log(res.resultStr)
        options && options.success && options.success(res)
      },
      cancel: (res) => {
        // 用户取消支付后执行的回调函数
        options && options.cancel && options.cancel(res)
      },
      fail: (res) => {
        // 接口调用失败时执行的回调函数
        options && options.fail && options.fail(res)
      },
      complete: () => {
        // 接口调用完成时执行的回调函数，无论成功或失败都会执行。
        options && options.complete && options.complete()
      }
    })
  }
}

export default WeiXinSDK
