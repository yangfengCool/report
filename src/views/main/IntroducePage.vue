<template>
  <div class="introduce">
    <div style="flex:1;overflow-y:scroll;">
      <div class="banner"></div>
      <ul class="list">
        <li class="item" v-for="(item,index) in list" :key='index'>
          <div class="item_icon">
            <img :src="item.src" alt="">
          </div>
          <div class="item_txt">
            <p class="title">{{item.title}}</p>
            <p class="desc">{{item.desc}}</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="j-footer">
      <div class="j-button-group">
            <button class="j-button-confirm" @click="$router.push('/home')">立即使用</button>
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapMutations } from 'vuex'
import { hiddenBottomBar } from '@/utils/globalFunctionsForApp.ts'

@Component({
  name: 'introduce',
  methods: {
    ...mapMutations({
      updateHeader: 'updateLayoutConfig',
      clearReportList: 'home/clearReportList'
    })
  }
})

export default class Introduce extends Vue {
  protected updateHeader!: any
  protected clearReportList!: any
  list = [
    { src: require('../../assets/image/dujiafabu.png'), title: '独家发布', desc: '剑鱼标讯官方独家跟进剑鱼标讯数据，定期制作 高质量的行业数据报告' },
    { src: require('../../assets/image/hongguanjiaodu.png'), title: '宏观视角', desc: '剑鱼标讯参照政治、经济、文化等多角度宏观视角去分析行业特性和未来趋势' },
    { src: require('../../assets/image/shangjijiazhi.png'), title: '商机价值', desc: '通过剑鱼标讯数据报告分析，针对每个行业的独特视角，寻找适合企业发展的商机价值' }
  ]

  mounted () {
    this.updateHeader({
      transparentHeader: true,
      titleStyle: {
        'font-size': 0
      }
    })
    this.clearReportList()

    // 隐藏app底部导航
    hiddenBottomBar(0)
  }
}
</script>

<style lang="scss">
  .introduce{
    background-color: #fff;
    overflow: hidden!important;
    .banner{
      position: relative;
      width: 100%;
      height: 300px;
      background: url(~@/assets/image/data_report_bg.png) no-repeat center center #fff;
      background-size: cover;
      .text{
        position: absolute;
        top: 35px;
        left: 30px;
        width: 148px;
      }
    }
    .list{
      padding-top: 24px;
      background: #fff;
      .item{
        display: flex;
        align-items: center;
        padding: 0 36px 32px 39px;
        .item_icon{
          display: flex;
          justify-content: center;
          align-items: center;
          width: 56px;
          height: 56px;
          margin-right: 25px;
          border-radius: 28px;
          background-color: rgba(208, 222, 252, 0.3);
          img{
            width: 32px;
            height: 32px;
          }
        }
        .item_txt{
          flex: 1;
          .title{
            font-size: 18px;
            line-height: 26px;
            color: #171826;
          }
          .desc{
            margin-top: 4px;
            font-size: 13px;
            line-height: 20px;
            color: #5F5E64;
          }
        }
      }
    }
  }
</style>
