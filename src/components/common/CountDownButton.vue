<template>
  <div class="countdown">
    <van-button
      class="countdown-button"
      size="small"
      :disabled="buttonDisabeld"
      :loading="sLoading"
      @click="buttonClick"
    >{{ buttonText }}</van-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Button } from 'vant'

// @ is an alias to /src
@Component({
  name: 'countdown-button',
  components: {
    [Button.name]: Button
  }
})
export default class CountdownButton extends Vue {
  @Prop({ default: '发送验证码' }) defaultText: string | undefined;
  @Prop({ default: false }) disabled: boolean | undefined;
  @Prop({ default: 60 }) countdown: number | undefined;
  @Prop({ default: false }) loading: boolean | undefined;

  timerId = 0

  count: any = 0

  get buttonText () {
    // const dText = `${this.timerId ? '重新' : ''}${this.defaultText}`
    const dText = this.defaultText
    return this.count <= 0 ? dText : `${this.count}s`
  }

  get sLoading () {
    return this.loading
  }

  get buttonDisabeld () {
    // 如果count不为0，则说明定时器一直在走
    return !!this.count || this.disabled
  }

  buttonClick () {
    this.$emit('click', this.startTimer)
  }

  startTimer (start = 0) {
    this.count = start || this.countdown
    this.timerId = setInterval(() => {
      this.count--
      if (this.count <= 0) {
        clearInterval(this.timerId)
      }
    }, 1000)
  }

  reset () {
    clearInterval(this.timerId)
    this.timerId = 0
    this.count = 0
  }
}
</script>

<style lang="scss">
.countdown {
  .countdown-button {
    color: #2ABED1;
    font-size: 14px;
    border: none;
    // height: 35Px;
    &[disabled] {
      color: #9B9CA3;
      opacity: 1;
    }
  }
}
</style>
