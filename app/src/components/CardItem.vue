<template>
    <v-row>
      <v-col class="col-sm-1">
        <v-icon small>
          {{ item.icon }}
        </v-icon>
      </v-col>
      <v-col class="col-sm-7 text-center">
        {{ item.name }}
      </v-col>
      <v-col class="col-sm- text-right">
        <template v-if="item.action!=='switch'">
          {{ item.value }}
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
    item: Object
  }
}
</script>

<style scoped>

</style>