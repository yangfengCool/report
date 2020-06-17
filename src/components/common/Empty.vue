<template>
  <div class="empty-container">
    <div class="empty-content-position mt50">
      <div class="image" :class="stateClass"></div>
      <div class="empty-main">
        <slot name="default"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

// @ is an alias to /src
@Component
export default class Empty extends Vue {
  @Prop({ default: 'empty' }) state: string | any;

  typeSrc = {
    empty: 'empty-image'
  }

  get stateClass () {
    return this.typeSrc[this.state]
  }
}
</script>

<style lang="scss">
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
  background-color: rgba(245, 244, 249, 1);

  .empty-content-position {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }

  .mt50 {
    margin-top: -50px;
  }

  .empty-main {
    @extend .empty-content-position;
    text-align: center;
  }

  .max-width70 {
    width: 70%;
  }

  .max-width80 {
    width: 80%;
  }

  .tip-text {
    color: #5F5E64;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
  }
  .tip-sub-text {
    color: #9B9CA3;
    font-size: 13px;
    line-height: 20px;
    margin-top: 6px;
    text-align: center;
  }

  .image {
    width: 160px;
    height: 160px;
  }

  .empty-image {
    background: url(~@/assets/image/empty.png) no-repeat;
    background-size: contain;
  }
}
</style>
