<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list-item>
        <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>## PlayerName ##</v-list-item-title>
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
      prominent
      v-if="tabs != false"
    >
      <template v-slot:img="{ props }">
        <v-img v-bind="props" gradient="to top right, rgba(19,84,122,.5), rgba(128,208,199,.8)"></v-img>
      </template>

      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title>Scavenger Hunt</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
      <template v-slot:extension>
        <v-tabs v-model="tab_location" fixed-tabs>
          <v-tabs-slider color="yellow"></v-tabs-slider>

          <v-tab v-for="tab in tabs" :key="tab.text">{{ tab.title }}</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-tabs-items v-model="tab_location">
      <v-tab-item v-for="tab in tabs" :key="tab.id">
        <v-card flat>
          <v-card-text v-text="tab.title"></v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>

    <v-main>
      <transition name="transition_page_flip" mode="out-in">
        <router-view @tab_info="get_tab_info" />
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
        { title: 'Trade', icon: 'mdi-swap-horizontal', to: '/trade' },
        { title: 'Checkpoint', icon: 'mdi-map-marker-check-outline', to: '/checkpoint' },
        { title: 'GM Panel', icon: 'mdi-shield-crown-outline', to: '/gamemaster' },
        { title: 'About Us', icon: 'mdi-information-outline', to: '/aboutus' }

      ],
      tab_location: null,
      tabs: false,
      right: null,
      drawer: null,
    }
  },
  methods: {
    get_tab_info(payload) {
      this.tabs = payload
      // set to middle tab when switching pages
      this.tab_location = 1
    }
  },
};
</script>
<style>
* {
  /* color: white; */
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
  /* background-color: black; */
}
</style>