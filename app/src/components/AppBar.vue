<template>
    <v-app-bar
        app
        absolute
        color="blue lighten-1"
        dark
        dense
    >
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>{{ title }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon v-on:click="searchZone">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon v-on:click="addZone">
        <v-icon>mdi-plus</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>
</template>

<script>

function searchZone(){
  console.log("TODO: Search");
}

function addZone() {
  console.log("TODO: Add");
}

export default {
  name: "AppBar",
  props: {
    title: String
  },
  methods: {
    searchZone,
    addZone
  }
}
</script>

<style scoped>
</style>