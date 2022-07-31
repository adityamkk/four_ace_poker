//import { createApp } from 'vue'

//import Vue from 'vue'
//import VuePlayingCard from 'vue-playing-card'

//import App from './App.vue'

//Vue.config.productionTip = false

//Vue.use(VuePlayingCard);

//createApp(App).mount('#app')

import Vue from 'vue'
import VuePlayingCard from 'vue-playing-card';

import HomePage from './home-page.vue'

Vue.config.productionTip = false

Vue.use(VuePlayingCard);

new Vue({
  render: h => h(HomePage),
}).$mount('#app')
