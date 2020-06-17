<template>
  <div class="report-detail">
    <!-- 骨架屏 -->
    <div class="skeleton" v-if="skeletonShow">
      <div class="skeleton-main">
        <div style="padding:20px 0">
          <van-skeleton :row="2" />
        </div>
        <div style="display: flex;justify-content: space-between;align-items: center;">
          <van-skeleton :row="1" row-width="80" />
          <van-skeleton :row="1" row-width="140" />
        </div>
        <div style="height:8px;background-color:#f2f3f5;margin:20px 0"></div>
        <div>
          <van-skeleton title :row="10" />
        </div>
      </div>
      <div class="skeleton-bottom">
        <van-skeleton title title-width="100%" />
        <van-skeleton title title-width="100%" />
        <van-skeleton title title-width="100%" />
      </div>
    </div>
    <!-- 内容 -->
    <div class="content" v-else>
      <div class="c-main">
        <div class="top">
          <div class="title">{{detail.title}}</div>
          <div class="info">
            <div class="i-left">{{detail.publishtime* 1000 | dateFormatter('yyyy/MM/dd')}}</div>
            <div class="i-right">
              <span class="before-price" v-if="detail.before_price && detail.before_price > detail.price">原价: &yen; <em>{{detail.before_price | fen2Yuan}}</em></span>
              <span class="current-price">&yen; <em>{{detail.price| fen2Yuan}}</em></span>
            </div>
          </div>
        </div>
        <div class="middle">
          <div class="m-title">详情</div>
          <div class="m-html" v-html="detail.content"></div>
        </div>
      </div>
      <div class="j-footer">
        <div class="j-button-group">
            <button class="j-button-confirm" @click="goBuy(detail.id)">立即购买</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapMutations, mapActions } from 'vuex'
import { Skeleton } from 'vant'
@Component({
  name: 'detail',
  components: {
    [Skeleton.name]: Skeleton
  },
  methods: {
    ...mapMutations({
      saveReportInfo: 'home/saveReportInfo',
      clearBuyState: 'home/clearBuyState'
    }),
    ...mapActions({
      getDetail: 'home/getReportDetail'
    })
  }
})

export default class Home extends Vue {
  protected getDetail!: any
  protected saveReportInfo!: any
  protected clearBuyState!: any

  skeletonShow = true
  // detail = {
  //   id: 12,
  //   title: '2019-2020年城际高速铁路和城际轨道交通市场研究报告',
  //   img: '/upload/datareport/2020051500263.png',
  //   price: 199,
  //   before_price: 299,
  //   pushtime: 1577780169,
  //   content: '<p>城际高速铁路是指在人口稠密的都市圈或者城市带（城市群）中，规划和修建的高速铁路客运专线运输系统，主要运营于城市群或城市带，线路总长一般不超过200千米，允许列车行驶的最大速度在250km/h以上。城际轨道交通是指以城际运输为主的轨道交通客运系统，相当于低速版的城际高铁。凭借人均能耗低、承载量大、互通互联等诸多优点，成为助力绿色出行、创建智慧城市、缓解拥堵等的重要手段。<br> 城际高速铁路和城际轨道交通产业链可分为上游（施工准备）、中游（建设施工）以及下游（运营维护）。上游施工准备主要包括设计咨询、原材料、机械设备；中游建设施工主要包括建筑施工和智能化设备；下游运营维护主要包括运营维护，产业应用于检修设备及运营。</p>'
  // }

  detail = {
    id: 12,
    title: '',
    img: '',
    price: 0,
    before_price: 0,
    pushtime: 0,
    content: ''
  }

  mounted () {
    // 清除购买页面用户填写的信息
    this.clearBuyState()
    this.getDetail(`id=${this.$route.params.id}`).then((res: any) => {
      if (res.error_code === 0 && res.data) {
        this.detail = res.data
        this.skeletonShow = false
      }
    })
  }

  goBuy (id) {
    this.saveReportInfo(this.detail)
    this.$router.push(`/buy/${id}`)
  }
}
</script>
<style lang="scss">
  .report-detail {
    height: 100%;
    .skeleton{
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background-color: #fff;
      .skeleton-main{
        flex: 1;
        overflow-y: scroll;
      }
      .skeleton-bottom{
        padding: 20px 0;
      }
    }
    .content{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      overflow: hidden;
      .c-main{
        flex: 1;
        overflow-y: scroll;
      }
      .top{
        padding: 20px 16px;
        background-color: #fff;
        .title{
          font-size: 20px;
          line-height: 30px;
          color: #171826;
        }
        .info{
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 13px;
          .i-left{
            font-size: 12px;
            line-height: 18px;
            color: #9B9CA3;
          }
          .i-right{
            display: flex;
            align-items: center;
            .before-price{
              margin-right: 6px;
              font-size: 12px;
              line-height: 18px;
              color: #9B9CA3;
              em{
                text-decoration: line-through;
              }
            }
            .current-price{
              display: flex;
              align-items: center;
              font-size: 16px;
              color: #FB483D;
              em{
                margin-left: 4px;
                font-size: 20px;
                line-height: 30px;
              }
            }
          }
        }
      }
      .middle{
        margin-top: 8px;
        padding: 16px 16px 20px;
        background-color: #fff;
        .m-title{
          position: relative;
          display: flex;
          align-items: center;
          padding: 0 8px;
          font-size: 18px;
          line-height: 26px;
          color: #171826;
          font-weight: bold;
          box-sizing: border-box;
          &:after{
            position: absolute;
            box-sizing: border-box;
            content: ' ';
            pointer-events: none;
            width: 3px;
            height: 16px;
            background: #2ABED1;
            border-radius: 8px;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            margin-top: -1px;
          }
        }
        .m-html{
          padding-top: 14px;
          font-size: 15px;
          line-height: 22px;
          color: #5F5E64;
          text-align: justify;
          .c-title{
            font-size: 18px;
            line-height: 26px;
          }
        }
      }
    }
  }
</style>
