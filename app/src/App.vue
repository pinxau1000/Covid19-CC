<template>
  <v-app>
    <AppBar app-bar-title="JTEK"/>

    <v-main>
      <Body/>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
import Body from "@/components/Body";
import AppBar from "@/components/AppBar";

export default {
  name: 'App',
  components: {
    AppBar,
    Body
  },
  data: () => ({
    companyName: "JTEK"
  })
};
</script>
