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
                  @click="openSettings"
              >
                <v-icon>
                  mdi-dots-vertical
                </v-icon>
              </v-btn>
          </v-col>
          <v-col class="col-7">
            {{ card.title }}
          </v-col>
          <v-col class="col- text-right">
            {{ card.current }} / {{ card.total }}
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <CardItem v-for="item in card.items"
                  v-bind:key="item.id"
                  v-bind:item="item"
        />
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
    card: Object
  },
  computed: {
    warningColor: function (){
      if (this.card.current > Math.floor(this.card.total * 0.8)){
        return "red lighten-4";
      }
      if (this.card.current > Math.floor(this.card.total * 0.6)){
        return "orange lighten-4";
      }
      if (this.card.current > Math.floor(this.card.total * 0.4)){
        return "amber lighten-4";
      }
      if (this.card.current > Math.floor(this.card.total * 0.2)){
        return "yellow lighten-4";
      }
      return "light-green lighten-4";
    }
  },
  methods: {
    openSettings: function () {
      // always use kebab-case for event names!
      // (https://vuejs.org/v2/guide/components-custom-events.html)
      this.$emit("RandomName", this.card)
      console.log("event")
    }
  }
}
</script>

<style scoped>
</style>