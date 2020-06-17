<template>
  <div class="order-404">
    <div class="j-main">
      <empty>{{ tipTextMap.deleted }}</empty>
    </div>
    <div class="j-footer"></div>
  </div>
</template>
<script>
import { Component, Vue } from 'vue-property-decorator'
import empty from '@/components/common/Empty.vue'

@Component({
  name: 'order404',
  components: {
    empty
  }
})

export default class Order404 extends Vue {
  tipTextMap = {
    deleted: '该订单记录已删除'
  }
}
</script>

<style lang="scss">
  .order-404 {
    .empty-container {
      margin-top: -100px;
    }
  }
</style>
