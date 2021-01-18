<template>
  <v-main>
    <v-container>
      <v-row class="text-justify">
          <!-- A Zone component is added for each zone in the zones array -->
          <Zone v-for="z in zones"
                :key="z.id"
                :zone="z"
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
  this.showZoneSettingsDialog  = true;
  this.temporaryZone = zone;
}

function closeZoneSettingsHandle() {
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