<template>
  <div class="app-footer">
  </div>
</template>

<script>

export default {
  name: 'AppFooter',
  components: {
  },
  data () {
    return {}
  },
  computed: {
    year () {
      return (new Date()).getFullYear()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.app-footer {
  
}

</style>
