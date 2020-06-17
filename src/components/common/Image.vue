<template>
  <van-image class="j-image" :src="src" lazy-load>
    <template v-slot:loading>
      <van-loading type="spinner" size="20" />
    </template>
    <template v-slot:error>
      <img src="@/assets/image/img-404.jpg" />
    </template>
  </van-image>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Image as VanImage, Loading } from 'vant'

// @ is an alias to /src
@Component({
  components: {
    [VanImage.name]: VanImage,
    [Loading.name]: Loading
  }
})
export default class Empty extends Vue {
  @Prop({ default: '' }) src: string | any;
}
</script>

<style lang="scss">
.j-image {
  width: 100%;
  height: 100%;
  border-radius: 6px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
