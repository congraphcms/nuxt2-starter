<template>
  <div class="app-header">
    <router-link to="/" class="logo-wrapper">
      <logo />
    </router-link>
  </div>
</template>

<script>
import Logo from '@/components/Logo'

export default {
  name: 'AppHeader',
  components: {
    Logo
  },
  data () {
    return {}
  },
  computed: {
    scrollTop () {
      return this.$store.getters['app/getState']('scrollTop')
    }
  },
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.app-header {

}
</style>
