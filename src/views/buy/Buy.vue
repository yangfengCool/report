<template>
  <div class="report-buy">
    <div class="j-main">
      <van-cell-group title="请填写订单信息">
        <van-field
          v-model="userInfo.email"
          :formatter="formatter"
          class="field"
          center
          placeholder="输入邮箱地址"
          :disabled="sendedEmail && emailCodePass"
          :error-message="errorMsg.email"
          @blur="checkPass('email')"
        />
        <transition name="van-slide-right">
          <van-field
            v-show="showSendEmailCode"
            v-model="userInfo.code"
            :formatter="formatter"
            :disabled="sendedEmail && emailCodePass"
            :error-message="errorMsg.code"
            class="field"
            center
            maxlength="6"
            placeholder="输入邮箱验证码"
            @blur="checkPass('code')"
          >
            <template #button>
              <countdown-button
                ref="countdownButton"
                :countdown="300"
                :disabled="sendButtonDisabled"
                @click="sendCode"
              ></countdown-button>
            </template>
          </van-field>
        </transition>
        <van-field
          v-model="userInfo.phone"
          class="field"
          :formatter="formatter"
          center type="tel"
          placeholder="输入手机号"
          @blur="checkPass('phone')"
          :error-message="errorMsg.phone"
        />
        <van-field
          v-model="userInfo.company"
          class="field"
          :formatter="formatter"
          center
          autosize
          @blur="checkPass('company')"
          type="textarea" rows="1"
          maxlength="50"
          placeholder="输入公司名称"
          :error-message="errorMsg.company"
        />
      </van-cell-group>
      <div class="tips">
        <p v-for="(item, index) in tipText" :key="index">*&nbsp;&nbsp;{{item}}</p>
      </div>
    </div>
    <div class="j-footer" ref="footer">
      <div class="price-container">
        <div class="price-top">
          <span class="price-t-label">支付金额：</span>
          <span class="price-t-count-now">
            <span class="cn-l">&yen;</span>
            <span class="cn-r">{{ orderInfo.price | fen2Yuan | formatPrice(-1, true)  }}</span>
          </span>
        </div>
        <div class="price-bottom" v-if="orderInfo.before_price && orderInfo.before_price > orderInfo.price">
          <span class="price-b-label">原价：</span>
          <span class="price-b-count-o">
            <span class="co-l">&yen;</span>
            <span class="co-r">{{ orderInfo.before_price | fen2Yuan | formatPrice(-1, true)  }}</span>
          </span>
        </div>
      </div>
      <van-cell class="statement" clickable @click="toggleStatementState" center :border="false">
        <template #icon>
          <van-checkbox v-model="iAgree" icon-size="17" checked-color="#2ABED1" ref="iAgreeCheckbox" />
        </template>
        <template #title>
          <p class="state">
            <span>我已阅读，理解并接受</span>
            <a class="link highlight-text"
              @click.stop.prevent="toServiceTerms"
              :href="$env.isWeiXinBrowser ? '/front/staticPage/wx-serviceterms.html' : '/jyapp/front/staticPage/dataExport_serviceterms.html'"
            >
            《剑鱼标讯线上购买与服务条款》
            </a>
          </p>
        </template>
      </van-cell>
      <div class="j-button-group">
        <button class="j-button-confirm" @click="onSubmit" :disabled="confirmDisabled">提交订单</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Field, Cell, CellGroup, Checkbox, CheckboxGroup } from 'vant'
import { mapState, mapMutations, mapActions } from 'vuex'
import countdownButton from '@/components/common/CountDownButton.vue'
import { inputFocusHideFooter } from '@/utils/globalFunctions'

@Component({
  name: 'buy',
  components: {
    [Field.name]: Field,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    countdownButton
  },
  methods: {
    ...mapState('home', {
      buyState: (state: any) => state.buyState,
      reportInfo: (state: any) => state.reportInfo
    }),
    ...mapMutations({
      saveBuyState: 'home/saveBuyState',
      clearBuyState: 'home/clearBuyState'
    }),
    ...mapActions({
      getUserMsg: 'home/getUserMsg',
      orderSubmit: 'home/orderSubmit',
      sendEmailCode: 'home/sendEmailCode',
      checkEmailCode: 'home/checkEmailCode'
    })
  }
})

export default class BuyReport extends Vue {
  protected getUserMsg!: any
  protected orderSubmit!: any
  protected sendEmailCode!: any
  protected checkEmailCode!: any

  // 当前数据报告的信息
  protected reportInfo!: any

  // 保存恢复状态
  protected buyState!: any
  protected saveBuyState!: any
  protected clearBuyState!: any

  tipText = [
    '数据报告将以邮件形式发至您的邮箱',
    '数据报告一经购买不支持退货、退款',
    '购买、售后等问题，请联系剑鱼标讯客服电话：400-108-6670'
  ]

  // 订单金额等数据
  orderInfo = {
    reportId: '',
    price: 123,
    before_price: 2990
  }

  originInfo = {
    email: '',
    phone: '',
    company: ''
  }

  // 用户信息(需要提交)
  userInfo = {
    email: '',
    phone: '',
    code: '',
    company: ''
  }

  iAgree = false
  sendedEmail = false
  emailCodePass = false

  countdown = {
    count: 0,
    leaveTimeStamp: 0
  }

  // 错误提示信息
  errorMsg = {
    email: '',
    phone: '',
    code: '',
    company: ''
  }

  // 错误提示验证对照表
  errorMsgMap = {
    email: {
      reg: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
      text: '邮箱格式输入错误'
    },
    phone: {
      // 新增19*号段
      reg: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57]|19[0-9])[0-9]{8}$/,
      text: '手机号格式输入错误'
    },
    code: {
      reg: '',
      text: '验证码输入错误'
    },
    company: {
      reg: '',
      text: '必填项'
    }
  }

  get allRegPass () {
    const info = this.userInfo
    const regArr: any = []
    for (const key in info) {
      const r = this.errorMsgMap[key]
      let pass = true
      if (r.reg) {
        // 有正则的就根据正则替换
        pass = r.reg.test(info[key])
      } else {
        // 判断是不是company
        if (key === 'code') {
          // 如果显示输入验证码时候才判断code是否pass
          if (this.showSendEmailCode) {
            pass = this.sendedEmail && this.emailCodePass
          }
        } else if (key === 'company') {
          pass = !!info[key]
        }
      }
      // console.log(r, key, pass)
      regArr.push(pass)
    }
    return regArr.indexOf(false) === -1
  }

  get confirmDisabled () {
    return !this.iAgree || !this.allRegPass
  }

  get showSendEmailCode () {
    const oe = this.originInfo.email
    const ue = this.userInfo.email
    if (oe === '' || oe !== ue) {
      return true
    }
    return false
  }

  get sendButtonDisabled () {
    const type = 'email'
    const reg = this.errorMsgMap[type].reg
    const email = this.userInfo[type]
    return !reg.test(email) || (this.sendedEmail && this.emailCodePass)
  }

  created () {
    const reportInfo = this.reportInfo()
    this.orderInfo.reportId = this.$route.params.id
    this.orderInfo.price = reportInfo.price
    this.orderInfo.before_price = reportInfo.before_price
  }

  mounted () {
    const recover = this.recoverState()
    if (!recover) {
      this.getInfo()
    }
    const inputs: any = document.querySelectorAll('.field .van-field__control')
    inputFocusHideFooter(inputs, this.$refs.footer)
  }

  getInfo () {
    const toast = this.$toast.loading({
      message: '加载中...',
      forbidClick: true,
      duration: 0
    })
    this.getUserMsg().then(res => {
      if (res.error_code === 0) {
        toast.clear()
        if (res.data) {
          this.originInfo = res.data
          for (const key in res.data) {
            this.userInfo[key] = res.data[key]
          }
        }
      }
    })
  }

  formatter (value) {
    return value.replace(/\s+/, '')
  }

  toggleStatementState () {
    this.iAgree = !this.iAgree
  }

  async checkPass (type) {
    const r = this.errorMsgMap[type]
    const info = this.userInfo[type]
    // 数据为空不显示校验失败提示，直接认定校验失败
    if (!info) return false

    let pass = true
    if (r.reg) {
      // 有正则的就根据正则替换
      pass = r.reg.test(info)
    } else {
      // 判断是不是company
      if (type === 'code') {
        pass = await this.verifyCode()
      } else if (type === 'company') {
        // 判断是不是company
        pass = !!info
      }
    }

    if (pass) {
      this.errorMsg[type] = ''
    } else {
      this.errorMsg[type] = this.errorMsgMap[type].text
    }
    return pass
  }

  toServiceTerms (e) {
    this.saveState()
    location.href = e.target.href
  }

  sendCode (next) {
    const reg = this.errorMsgMap.email.reg
    const email = this.userInfo.email
    const emailPass = reg.test(email)
    if (!emailPass) return
    this.sendedEmail = true
    // 开启倒计时计时器
    next && next()
    this.sendEmailCode({ email: this.userInfo.email }).then(res => {
      if (res.error_code === 0 && res.data.status === 1) {
        this.$toast({
          message: '邮箱验证码发送成功',
          forbidClick: true,
          duration: 1500
        })
      }
    })
  }

  verifyCode () {
    return this.checkEmailCode({ email: this.userInfo.email, emailCode: this.userInfo.code }).then(res => {
      if (res.error_code === 0) {
        if (res.data.status === 1) {
          // 将错误提示清空
          this.errorMsg.code = ''
          this.emailCodePass = true
          this.sendedEmail = true
          this.$toast({
            message: '邮箱验证码验证成功',
            forbidClick: true,
            duration: 1000
          })
          return true
        } else {
          // 给出错误提示
          this.errorMsg.code = this.errorMsgMap.code.text
          return false
        }
      } else {
        return false
      }
    })
  }

  onSubmit () {
    const data = {
      email: this.userInfo.email,
      phone: this.userInfo.phone,
      company: this.userInfo.company,
      reportId: this.orderInfo.reportId
    }
    this.$toast.loading({
      message: '加载中...',
      forbidClick: true,
      duration: 0
    })
    this.orderSubmit(data).then(res => {
      if (res.error_code === 0 && res.data.ordercode) {
        this.$toast.clear()
        this.saveState()
        if (this.$env.isWeiXinBrowser) {
          location.href = `/weixin/pay/datareport?ordercode=${res.data.ordercode}`
        } else {
          this.$router.push(`/pay?ordercode=${res.data.ordercode}`)
        }
      }
    })
  }

  recoverState () {
    const buyState = this.buyState()
    if (Object.keys(buyState).length === 0) return false
    // 恢复数据
    for (const key in buyState) {
      this[key] = buyState[key]
    }

    // 求时间差
    const tDiff: any = +new Date() - this.countdown.leaveTimeStamp
    const timeDiff = Math.ceil(tDiff / 1000)

    if (timeDiff < this.countdown.count) {
      // 恢复倒计时
      const countdownButton: any = this.$refs.countdownButton
      countdownButton.startTimer(this.countdown.count - timeDiff)
    }
    return true
  }

  saveState () {
    // 保存当前秒数
    const countdownButton: any = this.$refs.countdownButton
    this.countdown.count = countdownButton.count
    // 保存当前时间戳
    this.countdown.leaveTimeStamp = +new Date()
    const pageState = {
      orderInfo: this.orderInfo,
      originInfo: this.originInfo,
      userInfo: this.userInfo,
      iAgree: this.iAgree,
      sendedEmail: this.sendedEmail,
      emailCodePass: this.emailCodePass,
      errorMsg: this.errorMsg,
      countdown: this.countdown
    }
    this.saveBuyState(pageState)
  }
}
</script>

<style lang="scss">
  .report-buy {
    .tips {
      padding: 8px 14px;
      color: #9B9CA3;
      font-size: 12px;
      line-height: 18px;
    }
    .field {
      // min-width: 54px;
      .van-field__body {
        min-height: 30px;
        font-size: 15px;
        color: #171826;
      }
    }
    .j-footer {
      .price-container {
        padding: 8px 16px 4px;
        background-color: #fff;
        .price-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .price-t-label {
          font-size: 13px;
          color: #9B9CA3;
        }
        .price-t-count-now {
          font-size: 20px;
          color: #FB483D;
          .cn-l {
            margin-right: 4px;
            font-size: 16px;
          }
        }

        .price-bottom {
          display: flex;
          justify-content: flex-end;
          margin-top: 3px;
          font-size: 11px;
          color: #9B9CA3;
          line-height: 14px;
          .co-r {
            margin-left: 4px;
            text-decoration: line-through;
          }
        }
      }

      .statement {
        padding-top: 0;
        padding-bottom: 0;
        border: none;
        font-size: 12px;
        .van-cell__title {
          margin-left: 8px;
        }
      }
    }
  }
</style>
