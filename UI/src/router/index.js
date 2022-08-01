import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '../home-page.vue'
import PokerGame from '../poker-game.vue'

Vue.use(Router)

export default new Router({
    routes: [
      { path: '/', component: HomePage },
      { path: '/game', component: PokerGame},
    ]
})