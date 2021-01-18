<template>
    <v-dialog v-model="show"
              fullscreen
              persistent
              hide-overlay
              transition="dialog-bottom-transition"
    >
      <v-toolbar dark
                 color="primary"
      >
        <v-btn icon
               dark
               @click="dialog = false"
        >
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
        <v-toolbar-title>
          Settings
        </v-toolbar-title>
        <v-spacer/>
        <v-toolbar-items>
          <v-btn dark
                 text
                 @click="dialog = false"
          >
            Save
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card>
        <v-card-title class="justify-center">
          Settings
        </v-card-title>
        <v-card-text>
          <v-text-field
              label="Name"
              :value="this.temporaryZone.title"
          />
          <v-text-field
              label="Maximum Capacity"
              :value="this.temporaryZone.total"
          />
          <v-text-field
              label="Periodicity Doors"
              :value="this.temporaryZone.periodicityDoors"
          />
          <v-text-field
              label="Periodicity Leds"
              :value="this.temporaryZone.periodicityLeds"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn text
                 elevation="2"
                 @click.stop="closeZoneSettingsDialog(false)"
          >
            discard
          </v-btn>
          <v-btn text
                 elevation="2"
                 color="primary"
                 @click.stop="closeZoneSettingsDialog(true)"
          >
            save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
function pushData(){
  console.log("TODO PushData")
}

/*
setUpdateIntervalUnitsAndMax: function() {
  if (this.temporaryZone.updateInterval > 3600) {
    this.currentUpdateIntervalUnits = 'h';
    this.maxUpdateInterval = 24;
    return;
  }
  if (this.temporaryZone.updateInterval > 60) {
    this.currentUpdateIntervalUnits = 'm';
  } else {
    this.currentUpdateIntervalUnits = 's';
  }
  this.maxUpdateInterval = 60;
}
*/

export default {
  name: "ZoneSettings",
  props: {
    temporaryZone: Object,
  },
  data() {
    return {
      show: Boolean
    }
  },
  methods: {
    closeZoneSettingsDialog: function (save){
      this.show = false;
      this.$emit("close-zone-settings-dialog")
      if (save) {
        pushData(this.temporaryZone);
      }
    }
  }
}

</script>