<template>
  <div class="j-order-detail">
    <!-- 骨架屏 -->
    <div class="skeleton" v-if="loading">
      <div class="skeleton-main">
        <van-skeleton title title-width="100%" />
        <van-skeleton title title-width="100%" />
        <div class="card-desc">
          <div class="card-desc-l">
            <van-skeleton avatar avatar-size="55px" avatar-shape="square" />
          </div>
          <div class="card-desc-r">
            <van-skeleton :row="1" />
            <van-skeleton :row="1" />
          </div>
        </div>
        <div class="card-container">
          <van-skeleton title title-width="100%" />
          <van-skeleton title title-width="100%" />
          <van-skeleton title title-width="100%" />
          <van-skeleton title title-width="100%" />
          <van-skeleton title title-width="100%" />
        </div>
        <div class="card-container">
          <van-skeleton title title-width="100%" />
          <van-skeleton title title-width="100%" />
          <van-skeleton title title-width="100%" />
          <van-skeleton title title-width="100%" />
        </div>
      </div>
      <div class="skeleton-bottom">
        <van-skeleton title title-width="100%" />
        <van-skeleton title title-width="100%" />
        <van-skeleton title title-width="100%" />
      </div>
    </div>
    <div class="j-container content" v-else>
      <div class="j-main no-scrollbar">
        <div>
          <div class="header-pic arc-container" :class="orderStateMap[orderInfo.state].bgcClassName">
            <div class="order-state">{{ orderStateMap[orderInfo.state].text }}</div>
            <div class="surplus-time" v-if="orderStateMap[orderInfo.state].surplusTimeShow && orderInfo.surplusTime > 0">
              <span>剩余支付时间：</span>
              <van-count-down @finish="onCountdowFinish" :time="orderInfo.surplusTime * 1000" />
            </div>
          </div>
          <div class="card-list">
            <div class="j-card report-p">
              <span class="rp-left">
                <img class="card-l-pic" src="@/assets/image/order-shujubaogao.png">
              </span>
              <span class="rp-right">
                <span class="product-type">数据报告</span>
                <span class="pay-money">&yen; {{ orderInfo.payMoney | fen2Yuan | formatPrice(-1, true) }}</span>
              </span>
            </div>
            <div class="j-card product-info">
              <div class="j-card-title">购买信息</div>
              <div class="j-card-items">
                <div class="j-card-item">
                  <span class="card-item-l">报告名称：</span>
                  <span class="card-item-r">{{ productInfo.productName }}</span>
                </div>
                <div class="j-card-item">
                  <span class="card-item-l">邮箱地址：</span>
                  <span class="card-item-r">{{ productInfo.email }}</span>
                </div>
                <div class="j-card-item">
                  <span class="card-item-l">手机号：</span>
                  <span class="card-item-r">{{ productInfo.phone | addSpaceForTel }}</span>
                </div>
                <div class="j-card-item">
                  <span class="card-item-l">公司名称：</span>
                  <span class="card-item-r">{{ productInfo.entName }}</span>
                </div>
                <div class="j-card-item">
                  <span class="card-item-l">发布日期：</span>
                  <span class="card-item-r">{{ productInfo.releaseTime * 1000 | dateFormatter('yyyy/MM/dd') }}</span>
                </div>
              </div>
            </div>
            <div class="j-card report-info">
              <div class="j-card-title">订单信息</div>
              <div class="j-card-items">
                <div class="j-card-item">
                  <span class="card-item-l">订单编号：</span>
                  <span class="card-item-r">{{ orderInfo.ordercode }}</span>
                </div>
                <div class="j-card-item">
                  <span class="card-item-l">下单时间：</span>
                  <span class="card-item-r">{{ orderInfo.createTime * 1000 | dateFormatter('yyyy/MM/dd HH:mm:ss') }}</span>
                </div>
                <div class="j-card-item" v-if="orderInfo.payTime">
                  <span class="card-item-l">支付时间：</span>
                  <span class="card-item-r">{{ orderInfo.payTime * 1000 | dateFormatter('yyyy/MM/dd HH:mm:ss') }}</span>
                </div>
                <div class="j-card-item" v-if="orderInfo.payWay">
                  <span class="card-item-l">支付方式：</span>
                  <span class="card-item-r">{{ payWayMap[orderInfo.payWay] }}</span>
                </div>
                <div class="j-card-item" v-if="orderInfo.paymentId">
                  <span class="card-item-l">支付单号：</span>
                  <span class="card-item-r">{{ orderInfo.paymentId }}</span>
                </div>
                <div class="j-card-item">
                  <span class="card-item-l">产品类型：</span>
                  <span class="card-item-r">{{ orderInfo.productType }}</span>
                </div>
                <div class="j-card-item">
                  <span class="card-item-l">实付金额：</span>
                  <span class="card-item-r">&yen; {{ orderInfo.payMoney | fen2Yuan | formatPrice(-1, true) }} 元</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="j-button-group j-footer" v-if="orderStateMap[orderInfo.state].bottomButton.show">
        <button class="j-button-confirm" @click="onConfirm">{{ orderStateMap[orderInfo.state].bottomButton.text }}</button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Skeleton, CountDown } from 'vant'
import { mapMutations, mapActions } from 'vuex'
import { dateFormatter } from '@/utils/globalFunctions.ts'

@Component({
  name: 'order-detail',
  components: {
    [Skeleton.name]: Skeleton,
    [CountDown.name]: CountDown
  },
  methods: {
    dateFormatter,
    ...mapMutations({
      updateHeader: 'updateLayoutConfig'
    }),
    ...mapActions({
      getOrderDetail: 'pay/orderDetail',
      checkInvokeIsOver: 'pay/invokeIsOver'
    })
  }
})

export default class OrderDetail extends Vue {
  protected updateHeader!: any
  protected getOrderDetail!: any
  protected checkInvokeIsOver!: any

  loading = true

  ordercode = ''

  orderStateMap = {
    0: {
      text: '待付款',
      bgcColor: '',
      bgcClassName: 'orange',
      surplusTimeShow: true,
      bottomButton: {
        show: true,
        url: '',
        text: '立即支付'
      }
    },
    1: {
      text: '已完成',
      bgcColor: '',
      bgcClassName: 'blue',
      surplusTimeShow: false,
      bottomButton: {
        show: true,
        url: '',
        text: '开发票'
      }
    },
    '-2': {
      text: '已取消',
      bgcColor: '',
      bgcClassName: 'grey',
      surplusTimeShow: false,
      bottomButton: {
        show: false,
        url: '',
        text: ''
      }
    }
  }

  invokeUrlMap = {}

  payWayMap = {
    wx_js: '微信支付',
    wx_app: '微信支付',
    ali_app: '支付宝支付',
    wx_pc: '微信支付',
    ali_pc: '支付宝支付'
  }

  productInfo = {
    picImg: '',
    productName: '',
    email: '',
    phone: '',
    entName: '',
    releaseTime: ''
  }

  orderInfo = {
    // 0:待支付 1:已完成 -2:已取消
    state: 1,
    applybillStatus: 1,
    ordercode: '',
    createTime: '',
    payTime: 0,
    payWay: '',
    paymentId: '',
    productType: '',
    payMoney: '',
    // 单位: 秒(s)
    surplusTime: null
    // surplusTime: 60 * 60 * 24 * 3
  }

  created () {
    this.updateHeader({
      transparentHeader: true,
      titleStyle: {
        color: '#fff',
        left: '22%'
      }
    })
  }

  mounted () {
    this.ordercode = this.$route.params.ordercode
    this.getInfo()
  }

  getInfo () {
    const toast = this.$toast.loading({
      message: '加载中...',
      forbidClick: true,
      duration: 0
    })
    this.getOrderDetail({ ordercode: this.ordercode, all: 1 }).then(res => {
      if (res.error_code === 0) {
        this.loading = false
        toast.clear()
        if (res.data && Object.keys(res.data).length !== 0) {
          // this.productInfo = res.data.productInfo
          // this.orderInfo = res.data.orderInfo
          for (const key in res.data.productInfo) {
            this.productInfo[key] = res.data.productInfo[key]
          }
          for (const key in res.data.orderInfo) {
            this.orderInfo[key] = res.data.orderInfo[key]
          }
          this.correctPageState()
        } else {
          this.$toast(res.error_msg || '查询订单信息失败')
        }
      } else if (res.error_code === -1) {
        this.$router.replace('/order/deleted')
      }
    })
  }

  // 修正页面的展示数据
  correctPageState () {
    // 已完成支付，并且发票已开
    if (this.orderInfo.state === 1) {
      if (this.orderInfo.applybillStatus === 0) {
        this.orderStateMap[this.orderInfo.state].bottomButton.text = '开发票'
      } else {
        this.orderStateMap[this.orderInfo.state].bottomButton.text = '查看发票'
      }
    }

    // 设置开发票跳转url
    // orderInfo.applybillStatus 0:未开票 1:已开票
    this.invokeUrlMap = {
      // 0:未开票 -> 去开发票
      0: {
        wx: {
          can: `/front/invoice/showpage?order_code=${this.ordercode}`,
          cannot: '/front/invoice/cantInvoice'
        },
        app: {
          can: `/jyapp/front/invoice/showpage?order_code=${this.ordercode}`,
          cannot: '/jyapp/front/cantInvoice'
        }
      },
      // 1:已开票 -> 查看发票
      1: {
        wx: {
          can: `/front/invoice/check_invoice.html?order_code=${this.ordercode}`
        },
        app: {
          can: `/jyapp/front/invoice/check_invoice.html?order_code=${this.ordercode}`
        }
      }
    }
  }

  onCountdowFinish () {
    console.log('onCountdowFinish')
    this.orderInfo.state = -2
  }

  onConfirm () {
    // orderInfo 0:待支付 1:已完成 -2:已取消
    const payUrl = {
      app: `/pay?ordercode=${this.ordercode}`,
      wx: `/weixin/pay/datareport?ordercode=${this.ordercode}`
    }
    if (this.orderInfo.state === 0) {
      // 去支付, 微信需要跳转到指定路径
      if (this.$env.isWeiXinBrowser) {
        location.href = payUrl[this.$env.platform]
      } else {
        this.$router.push(payUrl[this.$env.platform])
      }
    } else if (this.orderInfo.state === 1) {
      // 已完成状态是否已开发票
      if (this.orderInfo.applybillStatus === 0) {
        // 0:未开票 -> 去开发票
        this.checkInvokeIsOverFn()
      } else {
        // 1:已开票 -> 查看发票
        location.href = this.invokeUrlMap[this.orderInfo.applybillStatus][this.$env.platform].can
      }
    }
  }

  checkInvokeIsOverFn () {
    const toast = this.$toast.loading({
      message: '加载中...',
      forbidClick: true,
      duration: 0
    })
    this.checkInvokeIsOver({ order_code: this.ordercode }).then(res => {
      toast.clear()
      if (res) {
        if (res.status === 1) {
          // 可以开发票
          location.href = this.invokeUrlMap[this.orderInfo.applybillStatus][this.$env.platform].can
        } else {
          // 开票时间过期
          location.href = this.invokeUrlMap[this.orderInfo.applybillStatus][this.$env.platform].cannot
        }
      } else {
        this.$toast(res.error_msg || '查询发票状态失败')
      }
    })
  }
}
</script>

<style lang="scss">
  .j-order-detail {
    // wx微信端样式自定义
    &.wx {
      .content .header-pic {
        margin-top: -40px;
        &:after {
          height: 240px;
          top: -20px;
        }
      }
    }
    // 骨架屏
    .skeleton {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      background-color: #fff;
      .skeleton-main {
        flex: 1;
        overflow-y: scroll;
        &>.van-skeleton:nth-of-type(1) {
          margin: 100px auto 8px;
          width: 18%;
          .van-skeleton__title {
            height: 30px;
          }
        }
        &>.van-skeleton:nth-of-type(2) {
          margin: 0 auto 11px;
          width: 45%;
          height: 24px;
        }
        .card-desc,
        .card-container {
          display: flex;
          margin: 0 16Px 16px;
          padding: 10px 0;
          background-color: #fafafa;
          box-shadow: 0px 2px 8px rgba(54, 147, 179, 0.051);
          border-radius: 8px;
          box-sizing: border-box;
        }
        .card-desc {
          // height: 80px;
          .card-desc-l {
            .van-skeleton {
              padding-right: 0;
            }
          }
          .card-desc-r {
            flex: 1;
            .van-skeleton {
              padding-left: 0;
            }
            .van-skeleton:nth-of-type(1) {
              margin-bottom: 12px;
            }
            .van-skeleton:nth-of-type(2) {
              .van-skeleton__row {
                height: 25px;
              }
            }
          }
        }
        .card-container {
          align-items: center;
          justify-content: space-around;
          flex-direction: column;
          .van-skeleton {
            width: 90%;
            margin: 3px 0;
          }
        }
        &>.card {
          margin-bottom: 16px;
          .van-skeleton__title {
            height: 80px;
            box-shadow: 0px 2px 8px rgba(54, 147, 179, 0.051);
            border-radius: 8px;
          }
        }
      }
      .skeleton-bottom {
        padding: 20px 0;
      }
    }
    // content 部分
    // 头部使用header-mask实现
    // 参考: https://www.sunzhongwei.com/css-div-arc-at-bottom
    .arc-container {
      position: relative;
      &:after {
        content: '';
        width: 150%;
        height: 260px;
        position: absolute;
        left: 50%;
        top: -40px;
        background: url(~@/assets/image/order-detail-header-mask3x.png) no-repeat top center;
        background-size: contain;
        border-radius: 0 0 50% 50%;
        transform: translateX(-50%);
      }

      &.blue:after {
        background-color: #2ABED1;
      }
      &.orange:after {
        background-color: #FF9F40;
      }
      &.grey:after {
        background-color: #C0C4CC;
      }

      &>div {
        position: relative;
        z-index: 2;
      }

      // &.blue {
      //   background: transparent url(~@/assets/image/order-detail-bg-blue2x.png) no-repeat top left;
      //   background-size: cover;
      // }
      // &.orange {
      //   background: transparent url(~@/assets/image/order-detail-bg-orange2x.png) no-repeat top left;
      //   background-size: cover;
      // }
      // &.grey {
      //   background: transparent url(~@/assets/image/order-detail-bg-grey2x.png) no-repeat top left;
      //   background-size: cover;
      // }
    }

    .content .header-pic {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 220px;
      color: #F7F9FA;
      box-sizing: border-box;

      .order-state {
        margin-top: 30px;
        margin-bottom: 8px;
        font-size: 22px;
        line-height: 32px;
      }
      .surplus-time {
        display: flex;
        font-size: 14px;
        line-height: 20px;
        .van-count-down {
          color: #F7F9FA;
        }
      }
    }
    .card-list {
      margin-top: -50px;
      .report-p {
        position: relative;
        flex-direction: row;
        align-items: center;
        .rp-right {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-left: 12px;
          flex: 1;
          .product-type {
            margin-bottom: 8px;
            font-size: 14px;
            line-height: 20px;
            color: #5F5E64;
            word-break: break-all;
          }
          .pay-money {
            font-weight: bold;
            font-size: 18px;
            line-height: 26px;
            color: #171826;
          }
        }
        .card-l-pic {
          width: 54px;
          height: 54px;
        }
      }
    }

    .j-card {
      display: flex;
      flex-direction: column;
      margin: 0 12px 16px;
      padding: 16px;
      box-shadow: 0px 2px 8px rgba(54, 147, 179, 0.051);
      border-radius: 8px;
      background-color: #fff;
      // &:not(:last-of-type) {
      //   margin-bottom: 16px;
      // }
      .j-card-title {
        margin-bottom: 6px;
        font-weight: bold;
        font-size: 18px;
        line-height: 26px;
        color: #171826;
      }
      .j-card-item {
        position: relative;
        display: flex;
        padding: 6px 0;
        &:not(:last-of-type):after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 1Px;
          background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.1) 65%, transparent 35%);
        }
        .card-item-l {
          margin-right: 4px;
          font-size: 13px;
          line-height: 20px;
          color: #5F5E64;
          min-width: 66px;
        }
        .card-item-r {
          flex: 1;
          font-size: 13px;
          line-height: 20px;
          color: #171826;
          word-break: break-all;
        }
      }
    }
  }
</style>
