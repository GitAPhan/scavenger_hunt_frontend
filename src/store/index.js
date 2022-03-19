import Vue from 'vue'
import Vuex from 'vuex'
import cookies from 'vue-cookies'
import axios from 'axios'

axios
cookies

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: cookies.get('token'),
    session: undefined,
    game: undefined,
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
    }
  },
  actions: {
    update_token_cookie(store) {
      store.commit('update_token',cookies.get('token'))
      console.log('------------- token store -------------')
      console.log(cookies.get('token'))
      console.log('------------- token store -------------')      
    },
    update_session_cookie(store) {
      store.commit('update_session', cookies.get('session'))
      console.log('------------- session store -------------')
      console.log(cookies.get('session'))
      console.log('------------- session store -------------')
    },
    update_game_cookie(store) {
      store.commit('update_game', cookies.get('game'))
      console.log('------------- game store -------------')
      console.log(cookies.get('game'))
      console.log('------------- game store -------------')
    }
  },
})
