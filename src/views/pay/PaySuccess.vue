<template>
  <div class="j-pay-success">
    <div class="j-main">
      <div class="pay-success">
        <span class="j-icon icon-checkbox-choose"></span>
        <span class="pay-text">支付成功</span>
        <span class="pay-count">
          <span class="pc-l">&yen;</span>
          <span class="pc-r">{{ orderInfo.payMoney | fen2Yuan | formatPrice(-1, true)  }}</span>
        </span>
        <p class="pay-text-desc">我们会尽快将数据报告发送至</p>
        <p class="pay-text-desc">{{ orderInfo.email }}</p>
      </div>
      <van-cell-group class="order-info">
        <van-cell center title="支付方式" :value="payWayMap[orderInfo.payWay]" />
        <van-cell center title="支付时间" :value="dateFormatter(orderInfo.payTime * 1000, 'yyyy/MM/dd HH:mm:ss')" />
        <van-cell center title="订单编号" :value="ordercode" />
      </van-cell-group>
    </div>
    <div class="j-button-group j-footer">
      <button class="j-button-confirm" @click="onConfirm">查看订单</button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Cell, CellGroup } from 'vant'
import { mapActions } from 'vuex'
import { dateFormatter } from '@/utils/globalFunctions.ts'

@Component({
  name: 'pay-success',
  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup
  },
  methods: {
    dateFormatter,
    ...mapActions({
      getOrderDetail: 'pay/orderDetail'
    })
  }
})

export default class PaySuccess extends Vue {
  protected getOrderDetail!: any

  ordercode = ''

  orderInfo = {
    payMoney: '',
    payWay: '',
    payTime: '',
    email: ''
  }

  payWayMap = {
    wx_js: '微信支付',
    wx_app: '微信支付',
    ali_app: '支付宝支付',
    wx_pc: '微信支付',
    ali_pc: '支付宝支付'
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
    this.getOrderDetail({ ordercode: this.ordercode }).then(res => {
      if (res.error_code === 0) {
        toast.clear()
        if (res.data && Object.keys(res.data).length !== 0) {
          for (const key in this.orderInfo) {
            this.orderInfo[key] = res.data[key]
          }
        } else {
          this.$toast(res.error_msg || '查询订单信息失败')
        }
      }
    })
  }

  onConfirm () {
    this.$router.push(`/order/detail/${this.ordercode}`)
  }
}
</script>

<style lang="scss">
  .j-pay-success {
    .van-cell {
      height: 54px;
    }
    .icon-checkbox-choose {
      width: 80px;
      height: 80px;
    }
    .pay-success {
      display: flex;
      align-items: center;
      flex-direction: column;
      background-color: #fff;
      height: 316px;
      border-top: 1px solid transparent;
      .j-icon {
        margin-top: 50px;
        margin-bottom: 18px;
      }
      .pay-text {
        font-size: 18px;
        line-height: 26px;
        color: #2ABED1;
      }
      .pay-count {
        margin-top: 4px;
        margin-bottom: 24px;
        color: #171826;
        font-size: 17px;
        line-height: 30px;
        .pc-r {
          margin-left: 4px;
          font-size: 24px;
        }
      }
      .pay-text-desc {
        font-size: 13px;
        line-height: 20px;
        color: #5F5E64;
      }
    }

    .order-info {
      margin-top: 8px;
    }
  }
</style>
