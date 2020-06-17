<template>
  <layout id="app">
    <template v-slot:main>
      <transition :name="transitionName" appear>
        <keep-alive :include="cashViews">
          <router-view class="router j-container" :class="env.platform" />
        </keep-alive>
      </transition>
    </template>
  </layout>
</template>
<script>
import layout from '@/components/layout.vue'
export default {
  name: 'App',
  components: {
    layout
  },
  computed: {
    transitionName () {
      return this.$store.state.direction
    }
  },
  data () {
    return {
      // 需要被缓存的组件，组件的name属性数组
      cashViews: ['home'],
      env: this.$env
    }
  }
}
</script>
<style lang="scss">
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    width: 100%;
    height: 100%;
    position: relative;
  }

  .router {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
