<template>
  <v-app>
    <AppBar app-bar-title="Group Name"/>

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
  }
};
</script>
