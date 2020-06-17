<template>
  <div class="j-test">
    <!-- 项目内部页面导航 -->
    <van-cell-group v-for="(conf, index) in confPageArr" :key="index" :title="conf.title">
      <van-cell
        v-for="(item, iindex) in conf.urls"
        :key="iindex"
        :title="item.pathName"
        :to="item.path"
        is-link
       />
    </van-cell-group>

    <!-- 测试环境跳转开发环境导航 -->
    <van-cell-group v-for="(conf, index) in confTestArr" :key="index" :title="conf.title + ' - ' + conf.subTitle">
      <van-cell
        v-for="(item, iindex) in conf.urls"
        :key="iindex"
        :title="conf.subTitle + ' -> ' + item.path"
        :url="conf.baseUrl + item.path + querySESSIONID"
        value=""
        is-link
       />
    </van-cell-group>

    <!-- SESSIONID -->
    <van-cell-group :title="'SESSIONID  (' + SIDTITLE + ')'">
      <van-cell :value="SESSIONID ? SESSIONID : '无SESSIONID'" />
    </van-cell-group>

    <div class="loader-container">
      <div class="loader">
        <div class="arc"></div>
        <div class="arc"></div>
        <div class="arc"></div>
      </div>
      <div class="text">loading...</div>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Cell, CellGroup } from 'vant'
import Cookies from 'js-cookie'

@Component({
  name: 'test',
  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup
  }
})
export default class Test extends Vue {
  // 项目内部页面导航
  confPageArr = [
    {
      title: '页面导航',
      baseUrl: '',
      subTitle: '',
      urls: [
        {
          pathName: '列表页面',
          path: '/home'
        }
      ]
    }
  ]

  // 测试环境跳转开发环境导航
  confTestArr = [
    {
      title: '开发环境',
      baseUrl: 'http://192.168.20.216:8080/datareport/page',
      subTitle: '20.216',
      urls: [
        {
          path: '/home'
        },
        {
          path: '/test'
        }
      ]
    }
  ]

  SESSIONID: any = ''
  SIDTITLE = ''

  get querySESSIONID () {
    return `?SESSIONID=${this.SESSIONID}`
  }

  mounted () {
    this.getAndSetSessionId()
  }

  // 获取或者设置SESSIONID
  getAndSetSessionId () {
    // 从地址栏获取参数
    const sId = this.$route.query.SESSIONID
    if (sId) {
      // 设置sessionId到浏览器
      this.SESSIONID = sId
      this.SIDTITLE = '设置SESSIONID'
      Cookies.set('SESSIONID', sId, { expires: 7, path: '/' })
    } else {
      // 获取sessionId到浏览器
      this.SIDTITLE = '获取SESSIONID'
      this.SESSIONID = Cookies.get('SESSIONID')
    }
  }
}
</script>

<style lang="scss">
.j-test {
  .loader-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 150px;
  }

  .loader {
    position: relative;
    transform-style: preserve-3d;
    perspective: 800;

    display: flex;
    flex-wrap: wrap;
    width: 36px;
    height: 36px;

    --primary-color: #4ec0e9;

    .arc {
      position: absolute;
      content: "";
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border-bottom: 3px solid var(--primary-color);

      @for $i from 1 through 3 {
        &:nth-child(#{$i}) {
          animation: rotate#{$i} 1.15s linear infinite;
        }
      }

      &:nth-child(1) {
        animation-delay: -0.8s;
      }

      &:nth-child(2) {
        animation-delay: -0.4s;
      }

      &:nth-child(3) {
        animation-delay: 0s;
      }
    }
  }

  @keyframes rotate1 {
    from {
      transform: rotateX(35deg) rotateY(-45deg) rotateZ(0);
    }

    to {
      transform: rotateX(35deg) rotateY(-45deg) rotateZ(1turn);
    }
  }

  @keyframes rotate2 {
    from {
      transform: rotateX(50deg) rotateY(10deg) rotateZ(0);
    }

    to {
      transform: rotateX(50deg) rotateY(10deg) rotateZ(1turn);
    }
  }

  @keyframes rotate3 {
    from {
      transform: rotateX(35deg) rotateY(55deg) rotateZ(0);
    }

    to {
      transform: rotateX(35deg) rotateY(55deg) rotateZ(1turn);
    }
  }
}
</style>
