<template>
  <div class="page-404">
    <div class="j-main">
      <empty>这里什么也没有</empty>
    </div>
    <div class="j-button-group j-footer">
      <router-link tag="button" class="j-button-confirm" replace to="/" >返回首页</router-link>
    </div>
  </div>
</template>
<script>
import { Component, Vue } from 'vue-property-decorator'
import empty from '@/components/common/Empty.vue'

@Component({
  name: 'page404',
  components: {
    empty
  }
})

export default class Page404 extends Vue {
  created () {
    const route = this.$route
    const redirectedFrom = route.redirectedFrom
    if (redirectedFrom) {
      console.log('路由:%c %s %c未找到', 'color: red', redirectedFrom, 'color: #000')
    }
  }
}
</script>

<style lang="scss">
  .page-404 {}
</style>
