// import EventBus from '@/config/event-bus'
import urlConfig from '@/config/urls'
import templateConfig from '@/config/templates'
import metaConfig from '@/config/meta'
import MetaHelper from '@/utils/metaHelper'

const baseApp = {
  watch: {
    page(val) {
      if (!val) return
      this.$store.dispatch('app/SET_STATE', { activePage: val })
    }
  },

  created() {
    const self = this
    let route = self.$store.state.route.path
    let locale = this.getLocale(route)

    self.$store.dispatch('app/SET_STATE', {
      locale: locale
    })

    // set locale
    self.setLocale(locale, false)
    self.$nextTick(() => {
      this.$store.dispatch('app/SET_STATE', {
        activePage: this.page
      })
    })
  },
  mounted() {
    const self = this
    self.$store.dispatch('app/SET_STATE', {
      width: window.innerWidth,
      height: window.innerHeight
    })

    self.resizeHandler()
    this.$validator.localize(this.locale)
    window.addEventListener('resize', self.resizeHandler)
  },
  head() {
    if (!this.page) return
    let headData = {
      meta: [],
      link: []
    }

    // Title
    headData.title = MetaHelper.getMetaTitle(this.page, metaConfig, this.locale)
    // Meta Description
    headData.meta.push(
      MetaHelper.getMetaDescription(this.page, metaConfig, this.locale)
    )
    // OG Title
    headData.meta.push(
      MetaHelper.getOGTitle(this.page, metaConfig, this.locale)
    )
    // OG Description
    headData.meta.push(
      MetaHelper.getOGDescription(this.page, metaConfig, this.locale)
    )
    // OG Image
    headData.meta.push(
      MetaHelper.getOGImage(this.page, metaConfig, this.locale)
    )
    // OG URL
    headData.meta.push(MetaHelper.getOGUrl(this.page))
    // OG Locale
    headData.meta.push(MetaHelper.getOGLocale(this.locale))
    // OG Type
    headData.meta.push(MetaHelper.getOGType(metaConfig))
    // OG Site Name
    headData.meta.push(MetaHelper.getOGSiteName(metaConfig, this.locale))

    // Twitter Title
    headData.meta.push(
      MetaHelper.getTwitterTitle(this.page, metaConfig, this.locale)
    )
    // Twitter Description
    headData.meta.push(
      MetaHelper.getTwitterDescription(this.page, metaConfig, this.locale)
    )
    // Twitter Image
    headData.meta.push(MetaHelper.getTwitterImage(this.page, metaConfig))
    // Twitter Url
    headData.meta.push(MetaHelper.getTwitterUrl(this.page))
    // Twitter Card
    headData.meta.push(MetaHelper.getTwitterCard(metaConfig))

    return headData

    // return {
    //   title: this.page.fields.meta_title,
    //   meta: [{
    //       name: 'description',
    //       hid: 'description',
    //       content: this.page.fields.meta_description
    //     },
    //     {
    //       name: 'og:image',
    //       content: this.getImageVersion(this.page, 'featured_image', 'medium')
    //     },
    //     {
    //       name: 'twitter:card',
    //       content: 'summary'
    //     },
    //     {
    //       name: 'twitter:url',
    //       content: 'http://maximus.asw.eu/'
    //     },
    //     {
    //       name: 'twitter:title',
    //       content: this.page.fields.meta_title
    //     },
    //     {
    //       name: 'twitter:description',
    //       content: this.page.fields.meta_description
    //     },
    //     {
    //       name: 'twitter:image',
    //       content: this.getImageVersion(this.page, 'featured_image', 'medium')
    //     }
    //   ]
    // }
  },
  computed: {
    locale() {
      return this.$store.getters['app/getState']('locale')
    },
    pages() {
      return this.$store.getters['pages/getPages']
    },
    parsedPages() {
      return this.$store.getters['pages/getParsedPages']
    },
    page() {
      return this.parseUrlPath()
    },
    pageTemplate() {
      if (!this.page) return

      let template

      for (const [rule, settings] of templateConfig) {
        switch (rule) {
          case 'template_keys':
            for (const templateField of settings) {
              if (
                templateField in this.page.fields &&
                _.isString(this.page.fields[templateField]) &&
                this.page.fields[templateField].length > 0
              ) {
                template = this.page.fields[templateField]
                break
              }
            }
            break
          case 'template_set_map':
            if (settings.has(this.page.attribute_set_code)) {
              template = settings.get(this.page.attribute_set_code)
              break
            }
            break
          case 'template_type_map':
            if (settings.has(this.page.entity_type)) {
              template = settings.get(this.page.entity_type)
              break
            }
            break
        }
      }

      // handle 404
      if (!template) {
        if (
          templateConfig.has('default_template') &&
          templateConfig.get('default_template').length > 0
        ) {
          return templateConfig.get('default_template')
        }
        return templateConfig.get('not_found_template')
      }

      template = this.capitalize(template)
      let templateExists = _.has(this.$options.components, template)

      // let mobileTemplate = template + "Mobile"
      // let mobileTemplateExists = _.has(this.$options.components, mobileTemplate)
      // return mobile template for mobile if such template exists
      // if (mobileTemplateExists && this.$device.isMobile){
      //   return mobileTemplate
      // }

      // handle 404
      if (!templateExists) {
        return templateConfig.get('not_found_template')
      }

      console.log(template + ' Template')
      return template
    }
  },
  methods: {
    parseUrlPath() {
      let route = this.$store.state.route.path
      // check if there is only locale present in the url
      let routeSegments = route.split('/')
      if (routeSegments[0] === '') {
        routeSegments.shift()
      }

      let onlyLocale = false

      // do we need to check for locale in url
      if (urlConfig.localized_url) {
        // check if we have only a locale in the path (e.g. "/en_US" )
        let firstSegment = routeSegments[0]
        onlyLocale = routeSegments.length === 1 && this.isLocale(firstSegment)
      }

      //  ['', '/', '/en_US'] should all go to home page
      if (!route.length || route.length < 2 || onlyLocale) {
        return this.$store.getters['pages/getByUrl'](
          '/' + urlConfig.get('home_url')
        )
      }
      let page = this.$store.getters['pages/getByUrl'](route)

      return page
    },
    resizeHandler() {
      const self = this

      self.$store.dispatch('app/SET_STATE', {
        width: window.innerWidth,
        height: window.innerHeight
      })

      self.$nextTick(() => {
        self.$bus.$emit('resize')
      })
    },
    setLocale(locale, fetch) {
      fetch && this.$store.dispatch('pages/LOAD_PAGES', locale)
      this.$validator.localize(locale)
      this.$i18n.locale = locale
    }
  }
}

export default baseApp
