// import $ from 'jquery'
// import imagesLoaded from 'imagesloaded'

const basePage = {
  // components: {},
  // mixins: [],
  props: [
    'model'
  ],
  computed: {
    pageComponents () {
      return this.getAttribute(this.model, 'page_components')
    },
    transitioning () {
      return this.$store.getters['app/getState']('transitioning')
    }
  },
  // created () {},
  mounted () {
    const self = this

    // this.initSmooth(this.$el)
    this.$nextTick(() => {
      this.resizeHandler()
    })

    if (!this.preventEvents) {
      this.$store.dispatch('app/SET_STATE', { scrollTop: 0 })
    }

    // imagesLoaded(this.$el, () => {
    //   self.resizeHandler()
    // })

    this.$bus.$on('resize', self.resizeHandler)
  },
  beforeDestroy () {

    if (!this.preventEvents) {
      this.$store.dispatch('app/SET_STATE', { scrollTop: 0 })
    }
  },
  destroyed () {},
  methods: {
    resizeHandler () {
      if (!this.$refs.wrapper) return
      this.$store.dispatch('app/SET_STATE', {
        pageHeight: this.$refs.wrapper.clientHeight,
        pageWidth: this.$refs.wrapper.clientWidth
      })
    },
    onScroll (e) {
      this.$store.dispatch('app/SET_STATE', { scrollTop: e.target.scrollTop })
    }
  }
}

export default basePage
