import Vue from 'vue'
import Vuex from 'vuex'
import cookies from 'vue-cookies'
// import axios from 'axios'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: cookies.get('token'),
    game: undefined,
    check_log: [],
    checkpoint: [],
    // used for the nav drawer
    drawer: null,
    tab_location: 1,
    tabs: false,
    check_token: undefined,
    title: 'Scavenger Hunt',
    // used for player page
    scoreboard: [],
    user_profile: [],
    user_score: [],
  },
  mutations: {
    update_token(state, payload) {
      cookies.set('token', payload)
      state.token = payload
    },
    update_game(state, payload) {
      state.game = payload
    },
    update_check_log(state, payload) {
      state.check_log = state.check_log.concat(payload)
    },
    update_checkpoint(state, payload) {
      state.checkpoint = payload
    },
    update_drawer(state, payload) {
      state.drawer = payload
    },
    update_tab_location(state, payload) {
      state.tab_location = payload
    },
    update_tabs(state, payload) {
      state.tabs = payload
    },
    update_check_token(state, payload) {
      state.check_token = payload
    },
    update_title(state, payload) {
      state.title = payload
    },
    update_scoreboard(state, payload) {
      state.scoreboard = payload
    },
    update_user_profile(state, payload) {
      state.user_profile = payload
    },
    update_user_score(state, payload) {
      state.user_score = payload
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
