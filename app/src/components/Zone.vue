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
        <span v-if="zone.enabled === false" class="text-caption">
           - disabled
        </span>
      </span>
      <v-spacer/>
      <span class="justify-end">
        {{ zone.current }} / {{ zone.max }}
      </span>
      </v-card-title>
      <v-card-text>
        <ZoneItem v-for="item in zone.items"
                  v-bind:key="item.id"
                  v-bind:item="item"
                  v-bind:zone-name="zone.name"
        />
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
import ZoneItem from "@/components/ZoneItem";
import {zoneColorsAlpha, zoneColorDisabled} from "@/assets/zone.colors"

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
      if (this.zone.enabled === false){
          return zoneColorDisabled;
      }

      if (this.zone.max === 0){
          return zoneColorsAlpha[0];
      }

      let idx = Math.round(
          this.zone.current*zoneColorsAlpha.length/this.zone.max
      );

      return (idx >= zoneColorsAlpha.length) ?
          zoneColorsAlpha[zoneColorsAlpha.length-1] : zoneColorsAlpha[idx];
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