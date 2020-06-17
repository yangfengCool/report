import Vue from 'vue'

// Vue自定义指令文档：https://cn.vuejs.org/v2/guide/custom-directive.html
Vue.directive('auto-focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    const autoFocusArr = ['input', 'textarea']
    const tagName = el.nodeName.toLowerCase()
    const isTag = autoFocusArr.find((item) => {
      return item === tagName
    })

    setTimeout(() => {
      if (isTag) {
        el.focus()
      } else {
        const dom: any = el.querySelector('.van-field__control')
        dom.focus()
      }
    }, 30)
  }
})
