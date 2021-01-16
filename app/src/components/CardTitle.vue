<template>
    <v-row>
      <v-col class="col-1">
        <v-icon medium :color="setIconColor">
          mdi-checkbox-blank-circle
        </v-icon>
      </v-col>
      <v-col class="col-7">
        {{ title }}
      </v-col>
      <v-col class="col- text-right">
        {{ current }} / {{ total }}
      </v-col>
    </v-row>
</template>

<script>
export default {
  name: "CardTitle",
  props: {
    title: String,
    current: Number,
    total: Number
  },
  computed: {
    setIconColor: function(){
      // 'this' is the Vue instance
      return this.current >= this.total ? "red" : "green";
    }
  }
}

</script>

<style scoped>

</style>