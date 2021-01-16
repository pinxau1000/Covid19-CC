<template>
    <v-row>
      <v-col class="col-sm-1">
        <v-icon small>
          {{ icon }}
        </v-icon>
      </v-col>
      <v-col class="col-sm-7 text-center">
        {{ name }}
      </v-col>
      <v-col class="col-sm- text-right">
        <template v-if="action!=='switch'">
          {{ value }}
        </template>
        <template v-else>
          <v-btn color="primary"
                 elevation="2"
                 icon
                 small
          >
            <v-icon>mdi-power</v-icon>
          </v-btn>
        </template>
      </v-col>
    </v-row>
</template>

<script>
export default {
  name: "CardItem",
  props: {
    icon: String,
    name: String,
    action: String,
    value: [Number, String]
  }
}
</script>

<style scoped>

</style>