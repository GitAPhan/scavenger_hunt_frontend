import Vue from 'vue'
import VueRouter from 'vue-router'
import LandingPage from '@/views/LandingPage.vue'
import PlayerPage from '@/views/PlayerPage.vue'
import StorePage from '@/views/StorePage.vue'
import GameMasterPage from '@/views/GameMasterPage.vue'
import CheckpointPage from '@/views/CheckpointPage.vue'
import PageNotFound from '@/views/PageNotFound.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'landing-page',
    component: LandingPage
  },
  {
    path: '/player',
    name: 'PlayerPage',
    component: PlayerPage
  },
  {
    path: '/gamemaster',
    name: 'GameMasterPage',
    component: GameMasterPage
  },
  // add /trade
  // add /aboutus
  // add /profile
  {
    path: '/checkpoint',
    name: 'CheckpointPage',
    component: CheckpointPage
  },
  {
    path: '/store',
    name: 'StorePage',
    component: StorePage
  },
  // PAGE NOT FOUND REDIRECT
  {
    path: '*',
    name: 'PageNotFound',
    component: PageNotFound
  }
]

const router = new VueRouter({
  routes
})

export default router
