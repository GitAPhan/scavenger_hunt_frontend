<template>
  <v-app>
    <nav-drawer />
    <nav-bar />
    <v-main>
      <transition name="transition_page_flip" mode="out-in">
        <router-view
        />
      </transition>
    </v-main>
  </v-app>
</template>

<script>
import NavDrawer from '@/components/NavDrawer.vue';
import NavBar from '@/components/NavBar.vue';


export default {
  components: { NavDrawer, NavBar },
  name: 'App',

  data() {
    return {
    }
  },
  methods: {
  },
  mounted() {
    // check cookie and compare to state
    if (this.$cookies.get('token') != undefined) {
      if (this.$store.state['token'] != this.$cookies.get('token')) {
        this.$store.dispatch('update_token_cookie')
      }
    }
  }
};
</script>
<style>
.v-main {
  padding: 50px 0px 0px;
}
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