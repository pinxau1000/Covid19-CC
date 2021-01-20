<template>
  <v-app>
    <AppBar :title="title"/>

    <v-main>
      <Body :zones="zones"/>
    </v-main>

    <v-footer app>
    </v-footer>
  </v-app>
</template>

<script>
import Body from "@/components/Body";
import AppBar from "@/components/AppBar";

// Import Firebase Config (Already Initialized!)
import firebase from "../firebase.config"

export default {
  name: 'App',
  firebase: {

  },
  components: {
    AppBar,
    Body
  },
  data() {
    return {
      title: "$User",
      zones: [{name: "test"}]
    }
  },
  mounted: function () {
    let App = this;
    this.$nextTick(function () {
      // Get a reference to the database service
      let database = firebase.database();
      let baseRef = database.ref();
      let _zones = []
      baseRef.on("value",function(snapshot) {
        snapshot.forEach(function (child){
          _zones.push(child.toJSON())
        })
        App.zones = [_zones[0]];
      });
    })
  }
};
</script>
