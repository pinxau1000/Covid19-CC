<template>
  <v-main>
    <v-container>
      <v-row class="justify-center">
          <!-- A Zone component is added for each zone in the zones array -->
          <Zone v-for="zone in zones"
                :key="zone.id"
                :zone="zone"
                @open-zone-settings-dialog="openZoneSettingsHandle($event)"
          />
      </v-row>
    </v-container>
    <!-- A Component that build a dialog with the a specific zone settings -->
    <ZoneSettings v-if="showZoneSettingsDialog===true"
                  :show="showZoneSettingsDialog"
                  :temporary-zone="temporaryZone"
                  @close-zone-settings-dialog="closeZoneSettingsHandle"
    />
  </v-main>
</template>

<script>
import Zone from "@/components/Zone";
import ZoneSettings from "@/components/ZoneSettings";

function openZoneSettingsHandle(zone) {
  console.log("DEBUG Body>openZoneSettingsHandle")
  this.showZoneSettingsDialog  = true;
  this.temporaryZone = zone;
}

function closeZoneSettingsHandle() {
  console.log("DEBUG Body>closeZoneSettingsHandle")
  this.showZoneSettingsDialog  = false;
}

export default {
  name: 'Body',
  components: {
    Zone,
    ZoneSettings
  },
  props: {
    zones: Array
  },
  data() {
    return {
      showZoneSettingsDialog: false,
      temporaryZone: undefined
    }
  },
  methods: {
    openZoneSettingsHandle,
    closeZoneSettingsHandle
  }
}
</script>

<style scoped>
</style>