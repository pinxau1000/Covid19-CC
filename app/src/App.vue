<template>
  <v-app>
    <AppBar :title="title"/>

    <v-main>
      <Body v-if="zones.length !== 0" :zones="zones"/>
    </v-main>

    <v-footer app>
    </v-footer>
  </v-app>
</template>

<script>
"use strict"

import Body from "@/components/Body";
import AppBar from "@/components/AppBar";
import {acquireZones} from "@/plugins/firebase"

export default {
  name: 'App',
  firebase:{

  },
  components: {
    AppBar,
    Body
  },
  data() {
    return {
      title: "$User",
      zones: []
    }
  },
  mounted: function () {
    let App = this;
    this.$nextTick(function () {
      acquireZones(function(zones) {
        App.zones = zones;
      },
      function (error){
        console.error(error)
      });
    });
  }
};

</script>
