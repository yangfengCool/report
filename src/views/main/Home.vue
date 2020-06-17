<template>
  <div class="report-home" ref="wrapper">
    <div v-if="listState.list.length && listState.list.length > 0">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="listState.loading"
        :finished="listState.finished"
        :immediate-check="false"
        finished-text="没有更多了"
        @load="onLoad"
        :offset="50"
      >
        <ul class="list">
          <li class="item" v-for="item in listState.list" :key="item.id" @click="goDetail(item)">
            <div class="item-img">
              <j-image :src="item.img" />
            </div>
            <div class="item-cont">
              <p class="ellipsis-2 title">{{item.title}}</p>
              <div class="desc">
                <div class="left">{{item.publishtime* 1000 | dateFormatter('yyyy/MM/dd')}}</div>
                <div class="right">
                  <span class="before-price" v-if="item.before_price && item.before_price > item.price">&yen; <em>{{item.before_price | fen2Yuan}}</em></span>
                  <span class="current-price">&yen; <em>{{item.price | fen2Yuan}}</em> </span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </van-list>
      </van-pull-refresh>
    </div>
    <Empty v-else>
      <div class="tip-sub-text">暂无数据</div>
    </Empty>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapState, mapMutations, mapActions } from 'vuex'
import { PullRefresh, List, Toast } from 'vant'
import Empty from '@/components/common/Empty.vue'
import JImage from '@/components/common/Image.vue'
@Component({
  name: 'home',
  components: {
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
    Empty,
    JImage
  },
  methods: {
    ...mapState('home', {
      reportList: (state: any) => state.reportList
    }),
    ...mapMutations({
      saveList: 'home/saveReportList',
      clearList: 'home/clearReportList'
    }),
    ...mapActions({
      getList: 'home/getReportList'
    })
  }
})

export default class Home extends Vue {
  protected reportList!: any
  protected getList!: any
  protected saveList!: any
  protected clearList!: any

  isLoading = false
  listState = {
    list: [],
    loading: false,
    finished: false,
    currentPage: 1,
    totalPage: 0,
    scroll: 0
  }

  defaultListState = {
    list: [],
    loading: false,
    finished: false,
    currentPage: 1,
    totalPage: 0,
    scroll: 0
  }

  beforeRouteEnter (to, from, next) {
    if (from.name === 'detail') {
      to.meta.isBack = true
    } else {
      to.meta.isBack = false
    }
    next()
  }

  activated () {
    if (!this.$route.meta.isBack) {
      for (const key in this.defaultListState) {
        this.listState[key] = this.defaultListState[key]
      }
      return this.getReportList()
    }

    // 恢复数据
    this.$route.meta.isBack = false
    const storeListState = this.reportList()
    for (const key in storeListState) {
      this.listState[key] = storeListState[key]
    }
    this.$nextTick(() => {
      ;(this.$refs.wrapper as any).scrollTop = storeListState.scroll
    })
  }

  beforeRouteLeave (to, form, next) {
    this.listState.scroll = (this.$refs.wrapper as any).scrollTop
    this.saveList(this.listState)
    next()
  }

  getReportList (type = 'load') {
    this.listState.loading = true
    this.getList(`page_index=${this.listState.currentPage}`).then((res: any) => {
      if (res.error_code === 0 && res.data.list) {
        const rows = res.data.list
        this.listState.loading = false
        this.listState.totalPage = res.data.page_count
        if (rows === null || rows.length === 0) {
          this.listState.finished = true
          return
        }
        if (this.listState.currentPage >= this.listState.totalPage) {
          this.listState.finished = true
        }
        if (this.listState.currentPage === 1) {
          if (type === 'refresh') {
            this.isLoading = false
            Toast({ message: '刷新成功', duration: 1000 })
          }
          this.listState.list = rows
        } else {
          this.listState.list = this.listState.list.concat(rows)
        }
      } else {
        this.listState.finished = true
      }
    }).catch(() => {
      this.listState.finished = true
    })
  }

  onLoad () {
    if (this.listState.currentPage < this.listState.totalPage) {
      this.listState.currentPage++
      this.getReportList()
    }
  }

  goDetail (item) {
    this.$router.push(`/detail/${item.id}`)
  }

  onRefresh () {
    this.clearList(this.listState)
    this.listState.loading = false
    this.listState.finished = false
    this.listState.currentPage = 1
    this.listState.totalPage = 0
    this.listState.scroll = 0
    this.$nextTick(() => {
      this.getReportList('refresh')
    })
  }
}
</script>
<style lang="scss">
  .report-home {
    .list{
      .item{
        position: relative;
        display: flex;
        padding: 20px 16px;
        background-color: #fff;
        &:after{
          position: absolute;
          box-sizing: border-box;
          content: ' ';
          pointer-events: none;
          right: 16px;
          bottom: 0;
          left: 16px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.02);
          // -webkit-transform: scaleY(0.5);
          // transform: scaleY(0.5);
        }
        .item-img{
          width: 80px;
          height: 80px;
          margin-right: 16px;
          overflow: hidden;
        }
        .item-cont{
          flex: 1;
          .title{
            font-size: 16px;
            line-height: 24px;
            color: #171826;
          }
          .desc{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 13px;
            .left{
              font-size: 12px;
              line-height: 18px;
              color: #9B9CA3;
            }
            .right{
              display: flex;
              align-items: center;
            }
            .before-price{
              font-size: 12px;
              line-height: 18px;
              color: #9B9CA3;
              margin-right: 6px;
              em{
                text-decoration: line-through;
              }
            }
            .current-price{
              display: flex;
              align-items: center;
              color: #FB483D;
              font-size: 14px;
              line-height: 20px;
              em{
                margin-left: 2px;
                font-size: 16px;
                line-height: 24px;
              }
            }
          }
        }
      }
    }
  }
</style>
