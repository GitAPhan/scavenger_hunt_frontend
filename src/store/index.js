import Vue from 'vue'
import Vuex from 'vuex'
import cookies from 'vue-cookies'
// import axios from 'axios'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: cookies.get('token'),
    session: undefined,
    game: undefined,
    check_log: [],
    checkpoint: []
  },
  mutations: {
    update_token(state, payload) {
      state.token = payload
    },
    update_session(state, payload) {
      state.session = payload
    },
    update_game(state, payload) {
      state.game = payload
    },
    update_check_log(state, payload) {
      state.check_log = state.check_log.concat(payload)
    },
    update_checkpoint(state, payload) {
      state.checkpoint = payload
    }
  },
  actions: {
    update_token_cookie(store) {
      store.commit('update_token', cookies.get('token'))
      console.log('------------- token store -------------')
      console.log(cookies.get('token'))
      console.log('------------- token store -------------')
    },
  },
})
