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
                  @click.stop="openZoneSettingsDialog"
              >
                <v-icon>
                  mdi-dots-vertical
                </v-icon>
              </v-btn>
          </v-col>
          <v-col class="col-7">
            {{ zone.title }}
          </v-col>
          <v-col class="col- text-right">
            {{ zone.current }} / {{ zone.total }}
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <ZoneItem v-for="item in zone.items"
                  v-bind:key="item.id"
                  v-bind:item="item"
        />
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
import ZoneItem from "@/components/ZoneItem";

export default {
  name: "Zone",
  components: {
    ZoneItem
  },
  props: {
    zone: Object
  },
  computed: {
    warningColor: function (){
      if (this.zone.current > Math.floor(this.zone.total * 0.95)){
        return "red lighten-4";
      }
      if (this.zone.current > Math.floor(this.zone.total * 0.9)){
        return "orange lighten-4";
      }
      if (this.zone.current > Math.floor(this.zone.total * 0.8)){
        return "amber lighten-4";
      }
      if (this.zone.current > Math.floor(this.zone.total * 0.7)){
        return "yellow lighten-4";
      }
      return "light-green lighten-4";
    }
  },
  methods: {
    openZoneSettingsDialog: function () {
      // always use kebab-case for event names!
      // (https://vuejs.org/v2/guide/components-custom-events.html)
      this.$emit("open-zone-settings-dialog", this.zone);
    }
  }
}
</script>

<style scoped>
</style>