<template>
  <v-app>
    <AppBar :title="title"/>

    <v-main>
      <Body v-if="fetched===true" :zones="zones"/>
    </v-main>

    <v-footer app>
    </v-footer>
  </v-app>
</template>

<script>
"use strict"

import Body from "@/components/Body";
import AppBar from "@/components/AppBar";
import {database} from "@/plugins/firebase"

export default {
  name: 'App',
  components: {
    AppBar,
    Body
  },
  data() {
    return {
      title: "$User",
      fetched: false,
      zones: []
    }
  },
  mounted: function () {
    let _zones = [];
    this.$nextTick(function () {
      database.ref().on("value", function(dataSnapshot){
            _zones = dataSnapshot.toJSON();
            console.log(_zones);
        }
      );
    });
    this.zones = _zones;
    console.warn(this.zones);
    console.error(JSON.parse(JSON.stringify(this.zones)));
  }
};

</script>
