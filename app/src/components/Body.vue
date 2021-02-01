<template>
  <v-main>
      <v-container>
        <v-row class="justify-center">
          <v-col class="col-auto">
            <v-card class="teal lighten-3">
              <v-card-subtitle class="text-center">
                 PROJECT IS IN
              </v-card-subtitle>
              <v-card-title class="text-center">
                READ MODE
              </v-card-title>
            </v-card>
          </v-col>
            <!-- A Zone component is added for each zone in the zones array -->
            <Zone v-for="zone in zonesLocal"
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
import {listeningAllZones} from "@/plugins/firebase"

function openZoneSettingsHandle(zone) {
  this.showZoneSettingsDialog  = true;
  this.temporaryZone = JSON.parse(JSON.stringify(zone));  // Clones the Object!
}

function closeZoneSettingsHandle() {
  this.showZoneSettingsDialog  = false;

}

function listenRemoteZones(context){
  listeningAllZones(
      function(remoteZones){
        context.zonesLocal = remoteZones;
      },
      function (){

      }
  )
}

export default {
  name: 'Body',
  components: {
    Zone,
    ZoneSettings
  },
  props: {
    zones: undefined
  },
  methods: {
    openZoneSettingsHandle,
    closeZoneSettingsHandle
  },
  data() {
    return {
      zonesLocal: this.zones,
      showZoneSettingsDialog: false,
      temporaryZone: undefined
    }
  },
  mounted() {
    this.$nextTick(()=>{
      let App = this;
      listenRemoteZones(App);
    })
  }
}
</script>

<style scoped>
</style>
