<template>
  <v-card>
    <v-app-bar
        app
        absolute
        color="primary"
        dark
        dense
    >
      <v-toolbar-title class="mr-4 mr-sm-12">
        {{ title }}
      </v-toolbar-title>

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
    </v-app-bar>
  </v-card>
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
