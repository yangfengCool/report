export default [
  {
    path: '/test',
    name: 'test',
    component: () => import(/* webpackChunkName: "test" */ '@/views/Test.vue'),
    meta: {
      title: '测试页面'
    }
  },
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/main/Home.vue'),
    meta: {
      title: '数据报告',
      isBack: false
    }
  },
  {
    path: '/buy/:id',
    name: 'buy',
    component: () => import(/* webpackChunkName: "index" */ '@/views/buy/Buy.vue'),
    meta: {
      title: '数据报告'
    }
  },
  {
    path: '/introduce',
    name: 'introduce',
    component: () => import(/* webpackChunkName: "index" */ '@/views/main/IntroducePage.vue'),
    meta: {
      title: '数据报告',
      layoutConf: true
    }
  },
  {
    path: '/detail/:id',
    name: 'detail',
    component: () => import(/* webpackChunkName: "index" */ '@/views/main/ReportDetail.vue'),
    meta: {
      title: '数据报告'
    }
  },
  {
    path: '/pay',
    // 兼容微信端安全域名的别名
    alias: '/weixin/pay/datareport',
    name: 'pay',
    component: () => import(/* webpackChunkName: "pay" */ '@/views/pay/Pay.vue'),
    meta: {
      title: '支付'
    }
  },
  {
    path: '/pay-success/:ordercode',
    name: 'pay-success',
    component: () => import(/* webpackChunkName: "pay" */ '@/views/pay/PaySuccess.vue'),
    meta: {
      title: '支付结果'
    }
  },
  {
    path: '/order/detail/:ordercode',
    name: 'order-detail',
    component: () => import(/* webpackChunkName: "order" */ '@/views/order/detail.vue'),
    meta: {
      layoutConf: true,
      title: '订单详情'
    }
  },
  {
    path: '/order/deleted',
    name: 'order-deleted',
    component: () => import(/* webpackChunkName: "order" */ '@/views/order/no-data.vue'),
    meta: {
      title: '我的订单'
    }
  }
]
