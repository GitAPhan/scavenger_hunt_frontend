<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list-item>
        <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{this.$store.state['token'].username}}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item v-for="item in items" :key="item.title" :to="item.to" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      color="primary"
      dark
      src="http://unsplash.it/300?random&gravity=center"
      short
      v-if="tabs != 0"
    >
      <template v-slot:img="{ props }">
        <v-img v-bind="props" gradient="to top right, rgba(19,84,122,.5), rgba(128,208,199,.8)"></v-img>
      </template>

      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title>{{header_title}}</v-app-bar-title>

      <v-spacer></v-spacer>


      <v-btn icon>
        <v-icon v-if="tab_location%2===0">mdi-logout-variant</v-icon>
        <v-icon v-else>mdi-skull-scan-outline</v-icon>
      </v-btn>
      <template v-slot:extension>
        <v-tabs v-model="tab_location" fixed-tabs>
          <v-tabs-slider color="yellow"></v-tabs-slider>

          <v-tab v-for="tab in tabs" :key="tab.text">{{ tab.title }}</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-tabs-items id="v-main" v-model="tab_location">
      <v-tab-item v-for="tab in tabs" :key="tab.id">
        <v-card flat>
          <v-card-text v-text="tab.text"></v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>

    <v-main>
      <transition name="transition_page_flip" mode="out-in">
        <router-view :tab="tab_location" @unauthorized_access="unauthorized_access" @tab_info="get_tab_info" />
      </transition>
    </v-main>
  </v-app>
</template>

<script>


export default {
  name: 'App',

  data() {
    return {
      items: [
        { title: 'Dashboard', icon: 'mdi-shield-home-outline', to: '/player' },
        { title: 'Store', icon: 'mdi-shopping-outline', to: '/store' },
        { title: 'Checkpoint', icon: 'mdi-map-marker-check-outline', to: '/checkpoint' },
        { title: 'GM Panel', icon: 'mdi-shield-crown-outline', to: '/gamemaster' },

      ],
      tab_location: 1,
      tabs: false,
      right: null,
      drawer: null,
      header_title: undefined //title to change per page
    }
  },
  methods: {
    get_tab_info: function (payload) {
      this.tabs = payload
      // set to middle tab when switching pages
      this.tab_location = 1
    },
    unauthorized_access: function () {
      this.tabs = false
    },
    react_to_cookie_update: function () {
      // new cookie has been set
      this.$store.commit('update_token_cookie')
    },
    request_alert: function() {
      // an alert regarding a request has been broadcasted
      console.log(this.tabs)
    },
    change_tab: function(num) {
      this.tab_location = num
    }
  },
  mounted () {
    // check cookie and compare to state
    if (this.$cookies.get('token') != undefined) {
      if (this.$store.state['token'] != this.$cookies.get('token')) {
        this.$store.dispatch('update_token_cookie')
      }
    }
    this.$root.$on('tokenSet', this.react_to_cookie_update);
    this.$root.$on('requestAlert', this.request_alert)
    this.$root.$on('changeTab', this.change_tab)
  },
};
</script>
<style>
* {
  color: #3d1a6b;
}
/* // transition settings // */
.transition_page_flip-enter-active,
.transition_page_flip-leave-active {
  transition: all 0.45s ease-in-out;
}

.transition_page_flip-leave-to {
  opacity: 0;
  transform: translateX(-20vw);
}

.transition_page_flip-enter {
  opacity: 0;
  transform: translateX(20vw);
}

.transition_page_flip-enter-to,
.transition_page_flip-leave {
  opacity: 1;
  transform: translateX(0);
}

#app {
  overflow: hidden;
  max-height: 100vh;
  background-color: rgb(156, 236, 255);
}
</style>