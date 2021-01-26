<template>
    <v-row class="justify-space-between">
      <v-col class="col-auto justify-start">
        <v-icon small>
          mdi-minus
        </v-icon>
      </v-col>
      <v-col class="col text-center align-center justify-center">
        {{ item.name }}
      </v-col>
      <v-col class="col-auto text-right justify-end">
        {{ lastValue }}
      </v-col>
    </v-row>
</template>

<script>
import {listeningLastValues} from "@/plugins/firebase";

function successCallback(context, data){
  console.log(data)
  context.lastValue = (data === null) ?
      '?' :
      Math.round(Object.values(data)[0].value*100)/100;
}

export default {
  name: "ZoneItem",
  props: {
    item: Object,
    zoneName: String
  },
  data() {
    return {
      lastValue: undefined
    }
  },
  mounted() {
    this.$nextTick(() => {
      listeningLastValues(this.zoneName, this.item.name, 1,
          data => {successCallback(this, data)});

    });
  }
}
</script>
