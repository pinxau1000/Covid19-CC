<template>
    <v-app-bar
        app
        absolute
        color="blue lighten-1"
        dark
        dense
    >
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>{{ appBarTitle }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon v-on:click="searchCards">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon v-on:click="addCard">
        <v-icon>mdi-plus</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>
</template>

<script>
export default {
  name: "AppBar",
  props: {
    appBarTitle: String
  },
  methods: {
    searchCards: function (){
      console.log("TODO: Search");
    },
    addCard: function () {
      console.log("TODO: Add");
    }
  }
}
</script>

<style scoped>
</style>