<template>
  <!--
  1 column per line on extra small devices; 2 columns per line on small
  and medium size devices, 3 columns on large and 4 on extra large view ports.
   -->
    <v-col class="col-12 col-sm-6 col-lg-4 col-xl-3">
    <v-card v-bind:color="warningColor">
      <v-card-title>
        <v-btn class="mr-2 mr-sm-4"
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
      <span class="justify-start">
        {{ zone.name }}
      </span>
      <v-spacer/>
      <span class="justify-end">
        {{ zone.current }} / {{ zone.total }}
      </span>
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

// https://stackoverflow.com/a/28481374/14643807
const alpha = 40;
const zoneColors = [
          `#4CAF50${alpha}`, `#4CAF50${alpha}`, `#4CAF50${alpha}`, `#4CAF50${alpha}`,
          `#8BC34A${alpha}`, `#CDDC39${alpha}`, `#FFEB3B${alpha}`, `#FFC107${alpha}`,
          `#FF9800${alpha}`, `#FF5722${alpha}`, `#F44336${alpha}`, `#FF0000${alpha}`
      ];

export default {
  name: "Zone",
  components: {
    ZoneItem
  },
  props: {
    zone: Object
  },
  data() {
    return {
    }
  },
  computed: {
    warningColor: function (){
      let idx = Math.round(
          this.zone.current*zoneColors.length/this.zone.total
      );
      return (idx >= zoneColors.length) ?
          zoneColors[zoneColors.length-1] : zoneColors[idx];

      /*
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
      */
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