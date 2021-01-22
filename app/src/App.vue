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
import {getAllZones} from "@/plugins/firebase"

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
      getAllZones(function(zones) {
        App.zones = zones;
      },
      function (error){
        console.error(error)
      });
    });
  }
};

</script>
