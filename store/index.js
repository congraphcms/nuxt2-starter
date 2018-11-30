import Vuex from 'vuex'
import app from './modules/app'
import pages from './modules/pages'
import getLocaleFromRoute from '@/utils/getLocaleFromRoute'
import state from './state'
import getters from './getters'

// Vue.use(Vuex)

export default () => {
  return new Vuex.Store({
    actions: {
      async nuxtServerInit({ dispatch, state }) {
        let route = state.route.path
        let locale = getLocaleFromRoute(route)
        await dispatch('pages/LOAD_PAGES', locale)
      }
    },
    state,
    getters,
    modules: {
      app,
      pages
    }
  })
}
