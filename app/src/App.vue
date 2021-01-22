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
import Body from "@/components/Body";
import AppBar from "@/components/AppBar";
import {getAllZones, listeningAllZones} from "@/plugins/firebase"

let _zones;
listeningAllZones(
  function updateCallback(zones){
    console.log("Updated");
    console.log(zones)
    _zones = zones;
  }
)

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
      App: this,
      title: "$User",
      zones: _zones
    }
  },
  mounted: function () {
    let App = this;
    this.$nextTick(function () {
      getAllZones(function(zones) {
        console.log("Initial");
        console.log(zones)
        App.zones = zones;
      });
    });
  }
};

</script>
