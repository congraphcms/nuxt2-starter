// const pkg = require('./package')
const webpack = require('webpack')
require('dotenv').config()

const vendorList = ['vee-validate', 'vue-i18n', 'babel-polyfill']

module.exports = {
  mode: 'universal',

  server: {
    port: process.env.APP_PORT, // default: 3000
    host: process.env.APP_HOST // default: localhost
  },

  /*
  ** Headers of the page
  */
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/png',
        href: '/fav/favicon.png'
      },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Poppins:400,500|Roboto+Mono|Roboto:400,500,700'
      }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: ['assets/scss/bootstrap.scss' /*, 'swiper/dist/css/swiper.css'*/],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~plugins/vee-validate.js',
    '~/plugins/common',
    '~/plugins/vuex-router-sync',
    '~/plugins/framework',
    '~/plugins/i18n.js',
    // '~/plugins/siteConfig.js',
    '~/plugins/eventBus.js',
    '~/plugins/gmaps.js',
    // '~/plugins/axios',
    // '~/plugins/cachedApi',
    // '~/plugins/autoload-pages.js',
    '~/plugins/global-components.js',
    '~plugins/filters.js',
    {
      src: '~/plugins/nonssr.js',
      ssr: false
    },
    {
      src: '~plugins/ga.js',
      ssr: false
    }
    /*
    {
      src: '~/plugins/nuxt-swiper-plugin.js',
      ssr: false
    },
    */
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    'nuxt-device-detect',
    // 'bootstrap-vue/nuxt',
    ['nuxt-sass-resources-loader', ['@/assets/scss/design.scss']],
    ['@nuxtjs/dotenv', {}]
    // ['@nuxtjs/google-tag-manager', { id: 'GTM-5FK7GT2' }],
    // '@nuxtjs/axios',
    // '@nuxtjs/pwa',
  ],

  /*
   ** Build configuration
   */
  router: {
    extendRoutes(routes, resolve) {
      // @TODO here we may fetch the pages and create the custom routes
      routes.push({
        name: 'custom',
        path: '*',
        component: resolve(__dirname, 'pages/_page.vue')
      })
    }
  },

  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
  ** Build configuration
  */
  build: {
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: new RegExp(
              `[\\/]node_modules[\\/](${vendorList.join('|')})[\\/]`
            ),
            chunks: 'initial',
            name: 'vendors',
            enforce: true
          }
        }
      }
    },

    transpile: [/^vue2-google-maps($|\/)/],

    /**
     * Run ESLint on save
     */
    extend(config /*, { isDev, isClient }*/) {
      // console.log(config);
      const urlLoader = config.module.rules.find(rule =>
        rule.test.test('file.svg')
      )

      urlLoader.test = /\.(png|jpe?g|gif|webp)$/

      config.module.rules.push({
        test: /\.svg$/,
        loader: 'vue-svg-loader',
        exclude: /node_modules/
      })

      // if (isDev && isClient) {
      //   config.module.rules.push({
      //     enforce: "pre",
      //     test: /\.(js|vue)$/,
      //     loader: "eslint-loader",
      //     exclude: /(node_modules)/,
      //     options: {
      //       fix: true
      //     }
      //   })
      // }
    },

    plugins: [
      new webpack.ProvidePlugin({
        _: 'lodash',
        moment: 'moment'
      })
    ]
  }
}
