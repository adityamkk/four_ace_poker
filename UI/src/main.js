//import { createApp } from 'vue'

//import Vue from 'vue'
//import VuePlayingCard from 'vue-playing-card'

//import App from './App.vue'

//Vue.config.productionTip = false

//Vue.use(VuePlayingCard);

//createApp(App).mount('#app')

import Vue from 'vue'
import VuePlayingCard from 'vue-playing-card';

import router from './router';
import App from './App.vue';

Vue.config.productionTip = false

Vue.use(VuePlayingCard);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
