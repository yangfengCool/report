import Vue from 'vue'
import WeiXinSDK from '@/utils/wx-js-sdk-register.ts'
import { isWeiXinBrowser } from '@/utils/globalFunctions.ts'
import { getWxSdkSign } from '@/api/pay.ts'

declare module 'vue/types/vue' {
  interface Vue {
    $env: any;
    $registerWxSdk: any;
    $wxSdk: any;
  }
}

const inWeiXinBrowser = isWeiXinBrowser()

// 全局变量
Vue.prototype.$env = {
  isWeiXinBrowser: inWeiXinBrowser,
  platform: inWeiXinBrowser ? 'wx' : 'app'
}

// 如果是微信浏览器, 注册一个微信SDK初始化函数
if (inWeiXinBrowser) {
  Vue.prototype.$registerWxSdk = () => {
    getWxSdkSign({ url: location.href.split('#')[0] }).then(result => {
      const res = result.data
      if (res && res.wxsdk && Array.isArray(res.wxsdk) && res.wxsdk !== 0) {
        const sdk = res.wxsdk
        Vue.prototype.$wxSdk = new WeiXinSDK({
          appId: sdk[0],
          timestamp: sdk[1],
          nonceStr: sdk[2],
          signature: sdk[3]
        })
      }
    }).catch(err => {
      console.log(err)
    })
  }
}
