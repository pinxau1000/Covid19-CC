<template>
    <v-app-bar
        app
        absolute
        color="primary"
        dark
        dense
    >
      <v-row class="justify-space-between">
        <v-col class="col-auto align-self-center justify-start">
          <v-app-bar-nav-icon @click="globalSettings"></v-app-bar-nav-icon>
        </v-col>
        <v-col class="col-auto align-self-center  justify-start">
          <v-toolbar-title>{{ title }}</v-toolbar-title>
        </v-col>
        <v-col class="col justify-end align-self-center">
          <v-text-field v-model="searchQuery"
                        dense rounded outlined filled single-line
                        clearable
                        clear-icon="mdi-close-circle"
                        label="Search"
                        :append-outer-icon="'mdi-magnify'"
                        @click:append-outer="searchZones"
                        @keypress.enter="searchZones"
                        @click:clear="clearQuery"
                        hide-details
          />
        </v-col>
      </v-row>
    </v-app-bar>
</template>

<script>

export default {
  name: "AppBar",
  props: {
    title: String
  },
  data() {
    return {
      searchQuery: ""
    }
  },
  methods: {
    globalSettings: function() {
      console.log("TODO: Global Settings");
    },
    searchZones: function() {
      console.log("TODO: Search");
      this.clearQuery();
    },
    clearQuery: function() {
      this.searchQuery = "";
    }
  }
}
</script>

<style scoped>
</style>