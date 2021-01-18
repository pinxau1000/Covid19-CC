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
