import {
  isWeiXinBrowser
} from './globalFunctions'
declare const JyObj: any

const inWeiXinBrowser = isWeiXinBrowser()

// 是否是微信浏览器
// 参数0隐藏底部导航，参数1，显示底部导航
export function hiddenBottomBar (params = 0) {
  // 如果是app端，隐藏底部导航
  if (!inWeiXinBrowser) {
    try {
      JyObj.hiddenBottom(params + '')
    } catch (error) {
      console.log(error)
    }
  }
}
