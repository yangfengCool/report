<template>
  <div class="j-pay">
    <div class="j-main">
      <div class="price-info">
        <span class="info-text">需支付金额</span>
        <span class="price-count">
          <span class="pc-l">&yen;</span>
          <span class="pc-r">{{ orderInfo.payMoney | fen2Yuan | formatPrice(-1, true) }}</span>
        </span>
      </div>
      <van-radio-group v-model="payWay">
        <van-cell-group>
          <van-cell v-for="(item, index) in payPlatFormWayMap[env.platform]" :key="index" center clickable :title="item.title" @click="radioCheck(item.type)">
            <template #icon>
              <div class="label-icon j-icon" :class="item.iconClass"></div>
            </template>
            <template #right-icon>
              <van-radio :name="item.type">
                <template #icon>
                  <div class="radio-icon j-icon icon-duihao"></div>
                </template>
              </van-radio>
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </div>
    <div class="j-button-group j-footer">
      <button class="j-button-confirm" @click="confirmPay">确认支付</button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Cell, CellGroup, Radio, RadioGroup } from 'vant'
import { mapActions } from 'vuex'

declare const JyObj: any

@Component({
  name: 'pay',
  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup
  },
  methods: {
    ...mapActions({
      getOrderDetail: 'pay/orderDetail',
      getPaySign: 'pay/paySign',
      isPaySuccess: 'pay/isPaySuccess'
    })
  }
})

export default class Pay extends Vue {
  protected getOrderDetail!: any
  protected getPaySign!: any
  protected isPaySuccess!: any

  orderInfo = {
    ordercode: '',
    payMoney: ''
  }

  // 将原型的全局变量提出来
  env = this.$env

  payPlatFormWayMap = {
    wx: [
      {
        title: '微信支付',
        type: 'wx_js',
        iconClass: 'icon-wx-pay'
      }
    ],
    app: [
      {
        title: '微信支付',
        type: 'wx_app',
        iconClass: 'icon-wx-pay'
      },
      {
        title: '支付宝支付',
        type: 'ali_app',
        iconClass: 'icon-ali-pay'
      }
    ]
  }

  payWay = this.payPlatFormWayMap[this.env.platform][0].type

  checkPaySuccessTimer = 0

  beforeRouteLeave (to, from, next) {
    clearInterval(this.checkPaySuccessTimer)
    next()
  }

  created () {
    const query: any = this.$route.query
    this.orderInfo.ordercode = query.ordercode
    if (this.env.isWeiXinBrowser) {
      // 微信端注册wxjsSdk
      this.$registerWxSdk()
    }
  }

  mounted () {
    this.getInfo()
  }

  radioCheck (type) {
    this.payWay = type
  }

  // 获取订单金额
  getInfo () {
    const toast = this.$toast.loading({
      message: '加载中...',
      forbidClick: true,
      duration: 0
    })
    this.getOrderDetail({ ordercode: this.orderInfo.ordercode }).then(res => {
      toast.clear()
      if (res.error_code === 0) {
        if (res.data && Object.keys(res.data).length !== 0) {
          this.orderInfo.payMoney = res.data.payMoney
        } else {
          this.$toast(res.error_msg || '查询订单信息失败')
        }
      }
    })
  }

  // 确认支付
  confirmPay () {
    this.$toast.loading({
      message: '加载中...',
      forbidClick: true,
      duration: 0
    })
    const data = {
      payway: this.payWay,
      ordercode: this.orderInfo.ordercode
    }
    this.getPaySign(data).then(res => {
      if (res.error_code === 0) {
        this.$toast.clear()
        if (res.data && Object.keys(res.data).length !== 0) {
          // 获取参数成功，判断是微信h5还是非微信h5
          if (this.env.isWeiXinBrowser) {
            this.wxPayCallBack(res.data.payStr)
          } else {
            this.appPayCallBack(res.data.payStr)
          }
        } else {
          this.$toast(res.error_msg || '获取支付信息失败')
        }
      }
    })
  }

  // https://web-jydev-ws.jianyu360.cn/weixin/pay/datareport/131659488644
  // 微信h5支付逻辑
  wxPayCallBack (paySign: string) {
    const sign = paySign ? JSON.parse(paySign) : {}
    if (!this.$wxSdk) {
      return this.$toast({
        message: '微信Sdk初始化失败',
        forbidClick: true,
        duration: 1000
      })
    }
    // 进行支付
    this.$wxSdk.chooseWXPayForWeiXinJSBridge({
      config: {
        timestamp: sign.timestamp,
        nonceStr: sign.nonceStr,
        signType: sign.signType,
        package: sign.prepayId,
        paySign: sign.sign,
        appId: sign.appId
      },
      success: () => {
        const ordercode = this.orderInfo.ordercode
        // 查询订单，是否支付完成
        this.isPaySuccess({ ordercode }).then(res => {
          if (res.error_code === 0 && res.data.status === 1) {
            this.$router.replace(`/pay-success/${ordercode}`)
          }
        })
      }
    })
  }

  // app支付逻辑
  appPayCallBack (paySign: string) {
    if (this.payWay === 'wx_app') {
      // 调微信支付
      try {
        JyObj.wxPay(paySign)
      } catch (error) {
        console.log('请在指定环境运行', error)
      }
    } else if (this.payWay === 'ali_app') {
      // 调支付宝支付
      try {
        JyObj.aliPay(paySign)
      } catch (error) {
        console.log('请在指定环境运行', error)
      }
    }
    this.checkAppPaySuccess()
  }

  // 开启定时任务，3s查询一次是否支付成功
  checkAppPaySuccess () {
    const ordercode = this.orderInfo.ordercode
    this.checkPaySuccessTimer = setInterval(() => {
      this.isPaySuccess({ ordercode }).then(res => {
        if (res.error_code === 0 && res.data.status === 1) {
          // 支付完成订单，关闭定时器
          clearInterval(this.checkPaySuccessTimer)
          this.$router.replace(`/pay-success/${ordercode}`)
        }
      })
    }, 3000)
  }
}
</script>

<style lang="scss">
  .j-pay {
    .price-info {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      margin-bottom: 8px;
      height: 80px;
      background-color: #fff;
      .info-text {
        color: #9B9CA3;
        font-size: 12px;
        line-height: 18px;
        margin-bottom: 4px;
      }
      .price-count {
        color: #FB483D;
        font-size: 18px;
        line-height: 30px;
        .pc-r {
          margin-left: 4px;
          font-size: 22px;
        }
      }
    }

    .van-cell {
      height: 54px;
    }

    .van-radio-group {
      .label-icon {
        width: 28px;
        height: 28px;
      }
      .van-cell__title {
        margin-left: 14px;
        font-size: 15px;
        line-height: 22px;
        color: #171826;
      }
      .radio-icon {
        display: none;
      }
      .van-radio__icon--checked {
        .radio-icon {
          display: inline-block;
        }
      }
    }
  }
</style>
