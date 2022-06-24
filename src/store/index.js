import Vue from 'vue'
import Vuex from 'vuex'
import cookies from 'vue-cookies'
import axios from 'axios'
import router from '@/router'


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
    user_top_score: undefined,
    // error message
    error_message: undefined
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
      let checkLog = state.check_log
      // find best performance 
      if (JSON.stringify(checkLog) != '[]') {
        const max_points = Math.max.apply(Math, checkLog.map(function (o) { return o.pointsWon }))
        const index = checkLog.map(item => item.pointsWon).indexOf(max_points)
        state.user_top_score = checkLog[index]
      }
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
    // update_scoreboard(state, payload) {
    //   state.scoreboard = payload
    // },
    // update_user_profile(state, payload) {
    //   state.user_profile = payload
    // },
    update_user_score(state, payload) {
      state.user_score = payload
    },
    update_error_message(state, payload) {
      state.error_message = payload
      setTimeout(() => { state.error_message = undefined }, 4000)
    },
    logout_clear(state) {
      state.token = undefined
      state.game = undefined
      state.check_log = []
      state.checkpoint = []
      state.tabs = false
      state.check_token = undefined
      state.title = 'Scavenger Hunt'
      state.scoreboard = []
      state.user_profile = []
      state.user_score = []
      state.user_top_score = undefined
    }
  },
  actions: {
    update_token_cookie(store) {
      store.commit('update_token', cookies.get('token'))
    },
    logout(store) {
      var request_data = {}
      var token = store.state.token
      // request data
      if ('loginToken' in token) {
        request_data['loginToken'] = token.loginToken
      } else if ('playerToken' in token) {
        request_data['playerToken'] = token.playerToken
      } else if ('masterToken' in token) {
        request_data['masterToken'] = token.masterToken
      }
      // request
      axios.request({
        url: 'http://localhost:5000/api/login',
        method: 'DELETE',
        data: request_data
      }).then((res) => {
        cookies.remove('token')
        if (router.currentRoute.name != 'LandingPage') {
          router.push({
            name: 'LandingPage'
          })
        }
        store.commit('logout_clear')
        store.commit('update_error_message', res.data)

      }).catch((err) => {
        store.commit('update_error_message', err.response.data)
        // error message
      })
    },
    get_user_profile: function (store) {
      // request
      axios.request({
        url: "http://localhost:5000/api/users",
        params: {
          userId: store.state.token.userId,
        },
      })
        .then((res) => {
          store.state.user_profile = res.data;
        })
        .catch((err) => {
          store.commit("update_error_message", err.response.data);
          // error message
        });
    },
    get_check_log: function (store) {
      // request
      axios.request({
        url: "http://localhost:5000/api/check-in/log",
        params: {
          "userId": store.state.token.userId
        }
      }).then((res) => {
        // update check_log state
        let checkLog = res.data
        store.state.check_log = checkLog
        // find best performance 
        if (JSON.stringify(checkLog) != '""') {
          const max_points = Math.max.apply(Math, checkLog.map(function (o) { return o.pointsWon }))
          const index = checkLog.map(item => item.pointsWon).indexOf(max_points)
          store.state.user_top_score = checkLog[index]
        }
      }).catch((err) => {
        // display error message
        store.state.error_message = err.response.data
        setTimeout(() => { store.state.error_message = undefined }, 6000)
      })
    },
    get_scoreboard(store) {
      // request
      axios.request({
        url: 'http://localhost:5000/api/check-in/standing',
        params: {
          "gameToken": store.state.token.gameToken
        }
      }).then((res) => {
        store.state.scoreboard = res.data
      }).catch((err) => {
        store.commit('update_error_message', err.response.data)
      })
    },
    login_success(store) {
      // update user profile if state is empty
      if (JSON.stringify(store.state.user_profile) === "[]") {
        store.dispatch("get_user_profile");
      }
      // update scoreboard if empty
      if (JSON.stringify(store.state.scoreboard) === '[]') {
        store.dispatch("get_scoreboard");
      }
      // update check log if state is empty
      if (JSON.stringify(store.state.check_log) === '[]') {
        store.dispatch("get_check_log");
      }
    },
  },
})
