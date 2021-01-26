// Importing Vue
import Vue from "vue"
// Importing Main App Component
import App from "./App.vue"
// Import Vuetify
import vuetify from "./plugins/vuetify";

// TODO: Production Tip is False
Vue.config.productionTip = false

// Create a Vue instance, adds vuetify and render App component in element
// with the ID "app" (#app).
new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
