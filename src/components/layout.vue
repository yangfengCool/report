<template>
  <div class="j-container" :class="{'transparent-header': headerInfo.transparentHeader}">
    <div class="j-header jy-app-header" v-if="!weixinBrowser" :class="{hideBorder: headerInfo.hideBorder}">
      <van-icon class="header-left" :style="headerInfo.actionLeftStyle" :class="{ hide: headerInfo.actionLeftHide }" name="arrow-left" @click="goBack" />
      <span class="header-title" :style="headerInfo.titleStyle">{{ headerInfo.title }}</span>
      <span class="header-right" :style="headerInfo.actionRightStyle" @click="actionRight">{{ headerInfo.actionRightText }}</span>
    </div>
    <div class="j-main">
      <slot name="main"></slot>
    </div>
    <div class="j-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { mapState, mapMutations } from 'vuex'
import { Icon } from 'vant'

// @ is an alias to /src
@Component({
  name: 'layout',
  components: {
    [Icon.name]: Icon
  },
  methods: {
    ...mapState([
      'layoutConf',
      'defaultLayoutConf'
    ]),
    ...mapMutations({
      updateLayoutConfig: 'updateLayoutConfig',
      clearLayoutConfig: 'clearLayoutConfig'
    })
  }
})

export default class Layout extends Vue {
  protected layoutConf!: any
  protected defaultLayoutConf!: any
  protected updateLayoutConfig!: any
  protected clearLayoutConfig!: any

  useConf = false

  @Watch('$route.path')
  onRouterChange () {
    this.useConf = this.$route.meta.layoutConf
    // console.log('headerConfig', this.conf)
  }

  get weixinBrowser () {
    return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
  }

  get conf () {
    if (this.useConf) {
      return this.layoutConf()
    } else {
      return this.defaultLayoutConf()
    }
  }

  get headerInfo () {
    return {
      title: this.conf.title || this.$route.meta.title,
      transparentHeader: this.conf.transparentHeader,
      actionLeftHide: this.conf.actionLeftHide,
      actionRightText: this.conf.actionRightText,
      titleStyle: this.conf.titleStyle,
      actionLeftStyle: this.conf.actionLeftStyle,
      actionRightStyle: this.conf.actionRightStyle,
      hideBorder: this.$route.meta.hideBorder || false
    }
  }

  mounted () {
    // console.log('layout mounted')
  }

  goBack () {
    window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
  }

  actionRight () {
    this.conf.actionRightCallback && this.conf.actionRightCallback()
  }
}
</script>

<style lang="scss">
.j-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  &.transparent-header {
    .j-header {
      position: absolute;
      width: 100%;
      background-color: transparent;
      &:after {
        height: 0;
      }
      .header-left {
        color: #fff;
      }
    }
  }
}

// 全局布局样式
.j-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 17px;
  min-height: 20px;
  background-color: #fff;
  z-index: 2;

  // app头部样式
  &.jy-app-header {
    height: 80px;
    padding: 40px 12px 0 12px;
    box-sizing: border-box;
    background: #fff;
    font-family: "Avenir", Helvetica, Arial, sans-serif;
  }
  &.hideBorder {
    &::after {
      content: unset;
    }
  }
  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1Px;
    background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.1) 65%, transparent 35%);
  }
  .header-left,
  .header-title,
  .header-right {
    display: flex;
    align-items: center;
  }
  .header-left.hide,
  .header-right.hide {
    visibility: hidden;
  }

  .header-left {
    color: #5f5e64;
    color: #444;
    font-size: 20px;
  }
  .header-title {
    position: absolute;
    left: 50%;
    color: #171826;
    transform: translateX(-50%);
  }
  .header-right {
    height: 100%;
    min-width: 20px;
    font-size: 15px;
    color: #2ABED1;
  }
}

.j-main {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: scroll;
  overflow-x: hidden;
  font-size: 16px;
  // 所有都j-main开启ios-touch
  -webkit-overflow-scrolling: touch;
  .calc-height-1px {
    height: calc(100% + 1Px);
  }

  // 单独关闭ios惯性滑动
  &.no-ios-touch {
    -webkit-overflow-scrolling: auto;
  }

  // &.ios-touch {
  //   // 开启ios惯性滑动，列表的 item 必须由一个根div元素包括
  //   -webkit-overflow-scrolling: touch;
  //   // 解决ios滑动白屏问题
  //   &>.calc-height-1px,
  //   &>div {
  //     height: calc(100% + 1px);
  //   }
  // }
}

.j-footer {
  box-shadow: 0px -2Px 8Px rgba(54, 147, 179, 0.051);
}
</style>
