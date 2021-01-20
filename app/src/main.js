// Importing Vue
import Vue from "vue"
// Importing Main App Component
import App from "./App.vue"
// Import Vuetify
import vuetify from "./plugins/vuetify";

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

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.DB_APIKEY,
  authDomain: process.env.DB_AUTHDOMAIN,
  databaseURL: process.env.DB_DATABASEURL,
  projectId: process.env.DB_PROJECTID,
  storageBucket: process.env.DB_STORAGEBUCKET,
  messagingSenderId: process.env.DB_MESSAGINGSENDERID,
  appId: process.env.DB_APPID,
  measurementId: process.env.DB_MEASUREMENTID
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
