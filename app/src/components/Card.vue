<template>
  <!-- 1 column per line on extra small devices; 2 columns per line on small
  devices; 3 columns per line on medium size devices.-->
    <v-col class="col-12 col-sm-6 col-md-4">
    <v-card v-bind:color="warningColor">
      <v-card-title>
        <v-row>
          <v-col class="col-2">
            <v-btn
                color="primary"
                icon
                small
                elevation="1"
                @click="cardSettings"
            >
              <v-icon>
                mdi-dots-vertical
              </v-icon>
            </v-btn>
          </v-col>
          <v-col class="col-7">
            {{ title }}
          </v-col>
          <v-col class="col- text-right">
            {{ current }} / {{ total }}
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <CardItem v-for="item in items"
                  v-bind:key="item.id"
                  v-bind:icon="item.icon"
                  v-bind:name="item.name"
                  v-bind:action="item.action"
                  v-bind:value="item.value"/>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
import CardItem from "@/components/CardItem";

export default {
  name: "Card",
  components: {
    CardItem
  },
  props: {
    title: String,
    current: Number,
    total: Number,
    items: Array
  },
  computed: {
    warningColor: function (){
      if (this.current > Math.floor(this.total * 0.8)){
        return "red lighten-4";
      }
      if (this.current > Math.floor(this.total * 0.6)){
        return "orange lighten-4";
      }
      if (this.current > Math.floor(this.total * 0.4)){
        return "amber lighten-4";
      }
      if (this.current > Math.floor(this.total * 0.2)){
        return "yellow lighten-4";
      }
      return "";
    }
  },
  methods: {
    cardSettings: function (){
      console.log("Enable Template")
    }
  }
}
</script>

<style scoped>
</style>