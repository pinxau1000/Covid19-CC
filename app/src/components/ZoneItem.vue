<template>
    <v-row class="justify-space-between">
      <v-col class="col-sm-auto justify-start">
        <v-icon small>
          mdi-minus
        </v-icon>
      </v-col>
      <v-col class="col-sm text-center justify-center">
        {{ item.name }}
      </v-col>
      <v-col class="col-sm-2 text-right justify-end">
        {{ item.value }}
      </v-col>
    </v-row>
</template>

<script>
export default {
  name: "ZoneItem",
  props: {
    item: Object
  }
}
</script>
