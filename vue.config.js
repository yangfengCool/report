// eslint-disable-next-line @typescript-eslint/no-var-requires
const merge = require('webpack-merge')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const tsImportPluginFactory = require('ts-import-plugin')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const autoprefixer = require('autoprefixer')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pxtorem = require('postcss-pxtorem')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pxtoviewport = require('postcss-px-to-viewport')

const externals = {
  vue: 'Vue',
  'vue-router': 'VueRouter',
  vuex: 'Vuex',
  axios: 'axios',
  'js-cookie': 'Cookies',
  vant: 'vant',
  moment: 'moment'
}

// cdn地址获取访问(国外): https://www.jsdelivr.com/
// cdn地址获取访问(国内): https://www.bootcdn.cn/
const cdn = {
  css: [
    // '//unpkg.com/element-ui@2.10.1/lib/theme-chalk/index.css'
  ],
  js: [
    '//cdn.bootcss.com/axios/0.19.2/axios.min.js',
    '//cdn.bootcss.com/js-cookie/2.2.1/js.cookie.min.js',
    '//cdn.bootcdn.net/ajax/libs/moment.js/2.24.0/moment.min.js',
    '//cdn.bootcss.com/vue/2.6.11/vue.min.js',
    '//cdn.jsdelivr.net/npm/vue-router@3.1.5/dist/vue-router.min.js',
    '//cdn.jsdelivr.net/npm/vuex@3.4.0/dist/vuex.min.js',
    '//cdn.jsdelivr.net/npm/vant@2.8.2/lib/vant.min.js',
    '//res.wx.qq.com/open/js/jweixin-1.6.0.js'
  ]
}

module.exports = {
  publicPath: process.env.BASE_URL,
  parallel: false,
  productionSourceMap: false,
  devServer: {
    port: '8080',
    open: false,
    disableHostCheck: true,
    proxy: {
      '^/datareport/api': {
        target: 'http://web2-jytest.jianyu360.cn',
        changeOrigin: true,
        logLevel: 'debug',
        pathRewrite: {
          '^/datareport/api': '/datareport/api'
        }
      },
      '^/jypay': {
        target: 'http://web2-jytest.jianyu360.cn',
        changeOrigin: true,
        logLevel: 'debug',
        pathRewrite: {
          '^/jypay': '/jypay'
        }
      },
      '^/subscribepay': {
        target: 'http://web2-jytest.jianyu360.cn',
        changeOrigin: true,
        logLevel: 'debug',
        pathRewrite: {
          '^/subscribepay': '/subscribepay'
        }
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "@/style/_mixin.scss";@import "@/style/_variables.scss";@import "@/style/base.scss";@import "@/style/common.scss";' // 全局引入
      },
      postcss: {
        plugins: [
          autoprefixer(),
          pxtoviewport(({
            unitToConvert: 'px',
            viewportWidth: 375,
            unitPrecision: 5,
            propList: [
              '*'
            ],
            viewportUnit: 'vw',
            fontViewportUnit: 'vw',
            selectorBlackList: [],
            minPixelValue: 1,
            mediaQuery: false,
            replace: true,
            exclude: /(\/|\\)(node_modules)(\/|\\)/
          }))
          // pxtorem({
          //   rootValue: 37.5,
          //   propList: ['*']
          // })
        ]
      }
    }
  },
  chainWebpack: config => {
    // 防止多页面打包卡顿
    // eslint-disable-next-line no-unused-expressions
    // config.plugins.delete('named-chunks')
    if (process.env.NODE_ENV === 'production') {
      // 打包时需要执行，开发环境运行不需要执行
      config.externals(externals)

      // 如果使用多页面打包，使用vue inspect --plugins查看html是否在结果数组中
      config.plugin('html').tap(args => {
        // html中添加cdn
        args[0].cdn = cdn
        // console.log(JSON.stringify(args))

        // 修复 Lazy loading routes Error
        // args[0].chunksSortMode = 'none'
        return args
      })
    } else {
      config.plugin('html').tap(args => {
        // html中添加wxjsssk的cdn
        args[0].cdn = {
          js: [
            cdn.js[cdn.js.length - 1]
          ]
        }
        return args
      })
    }

    // 分析静态资源
    if (process.env.use_analyzer) {
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }

    // 修复HMR
    config.resolve.symlinks(true)

    config.module
      .rule('ts')
      .use('ts-loader')
      .tap(options => {
        options = merge(options, {
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory({
                libraryName: 'vant',
                libraryDirectory: 'es',
                style: true
              })
            ]
          }),
          compilerOptions: {
            module: 'es2015'
          }
        })
        return options
      })
    // return config
  }
}
