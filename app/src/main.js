// Importing Vue
import Vue from "vue"
// Importing Main App Component
import App from "./App.vue"
// Import Vuetify
import vuetify from "./plugins/vuetify";

// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import * as firebase from "firebase/app";
// Add the Firebase services that you want to use
import "firebase/auth";

// Import .env
require("dotenv").config({ path: "../.env" })

// TODO: Production Tip is False
Vue.config.productionTip = false

// Create a Vue instance, adds vuetify and render App component in element
// with the ID "app" (#app).
new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')

// TODO: Replace the following with your app's Firebase project configuration
// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
var firebaseConfig = {
  host: process.env.DB_CONFIG
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);