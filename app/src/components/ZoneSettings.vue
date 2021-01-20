<template>
  <v-container justify="center">
    <v-dialog v-model="show"
              fullscreen
              persistent
              hide-overlay
              transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark
                   color="primary"
        >

          <v-btn icon
                 dark
                 @click.stop="closeZoneSettingsDialog"
          >
            <v-icon> mdi-close </v-icon>
          </v-btn>

          <v-toolbar-title> Settings </v-toolbar-title>

          <v-spacer/>

          <v-toolbar-items>
            <v-btn dark
                   text
                   @click.stop="closeZoneSettingsDialog"
            >
              Save
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-card-text>
          <v-row class="mt-0">
            <v-col>
              <v-text-field label="Name"
                            :value="this.temporaryZone.name"
              />
            </v-col>
          </v-row>

          <v-row justify="space-between">
            <v-col
                class="text-subtitle-1 align-self-center col-auto"
            >
              Activated
            </v-col>
            <v-col class="col-auto" align-self="end">
              <v-switch v-model="temporaryZone.enabled"
                        color="primary"
                        :label="this.temporaryZone.enabled.toString()"

              />
            </v-col>
            <v-col class="col-12 col-sm">
              <v-text-field label="Maximum Capacity"
                            :value="this.temporaryZone.total"
              />
            </v-col>
          </v-row>

          <v-row class="mt-2">
            <v-col class="col-12 col-sm-9 pb-0">
              <v-slider v-model="temporaryZone.periodicityDoors"
                        label="Periodicity Doors"
                        thumb-label="always"
                        thumb-size="24"
                        min="1" :max="this.sliderMaxDoors"
              />
            </v-col>
            <v-col class="col- pt-0">
              <v-select v-model="currentUnitsDoors"
                        :items="this.availableUnits"
                        return-object
                        dense
                        @change="updateMaxUnitsDoor"
              />
            </v-col>
          </v-row>

          <v-row class="mt-4">
            <v-col class="col-12 col-sm-9 pb-0">
              <v-slider v-model="temporaryZone.periodicityLeds"
                        label="Periodicity Leds"
                        thumb-label="always"
                        thumb-size="24"
                        min="1" :max="this.sliderMaxLeds"
              />
            </v-col>
            <v-col class="col- pt-0">
              <v-select v-model="currentUnitsLeds"
                        :items="this.availableUnits"
                        return-object
                        dense
                        @change="updateMaxUnitsLeds"
              />
            </v-col>
          </v-row>

          <v-divider/>

          <v-carousel v-model="carousel" height="auto" hide-delimiters>
            <v-carousel-item v-for="item in this.temporaryZone.items"
                             :key="item.id"
            >
              <v-card-subtitle class="title">
                {{ item.name }}
              </v-card-subtitle>
              <v-sheet color="transparent">
                <v-sparkline :gradient="sparklineGradient"
                             :value="sparklineValues()"
                             :smooth="true"
                             :fill="true"
                             auto-draw
                />
              </v-sheet>
            </v-carousel-item>
          </v-carousel>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
function setDefaultSliderMax(value) {
  if (value > 3600){
    return 24;
  } else {
    return 60;
  }
}

const _availableUnits = ["seconds", "minutes", "hours"];
function setDefaultUnits(value) {
  if (value > 3600){
    return _availableUnits[2];
  } else if (value > 60){
    return _availableUnits[1];
  } else {
    return _availableUnits[0];
  }
}

function updateSliderMax(units, value) {
  let max;
  if (units === _availableUnits[2]) {
    max = 24;
    if (value > 24) {
      value = 24;
    }
  } else {
    max = 60;
  }
  return [max, value]
}

const zoneColorsNoAlpha = [
    "#4CAF50", "#4CAF50", "#4CAF50", "#4CAF50",
    "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107",
    "#FF9800", "#FF5722", "#F44336"
];


export default {
  name: "ZoneSettings",
  props: {
    temporaryZone: Object,
  },
  data() {
    return {
      show: Boolean,
      availableUnits: _availableUnits,
      sliderMaxDoors: setDefaultSliderMax(this.temporaryZone.periodicityDoors),
      sliderMaxLeds: setDefaultSliderMax(this.temporaryZone.periodicityLeds),
      currentUnitsDoors: setDefaultUnits(this.temporaryZone.periodicityDoors),
      currentUnitsLeds: setDefaultUnits(this.temporaryZone.periodicityLeds),
      sparklineGradient: zoneColorsNoAlpha.reverse(),
      carousel: 0,
      sparklineValues: function() {
        console.log("TODO Add items values!");
        return [0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0];
      }
    }
  },
  methods: {
    closeZoneSettingsDialog: function (){
      console.log("DEBUG: ZoneSettings>closeZoneSettingsDialog");
      this.show = false;
      this.$emit("close-zone-settings-dialog");
    },
    updateMaxUnitsDoor: function(){
      [this.sliderMaxDoors, this.temporaryZone.periodicityDoors] =
          updateSliderMax(this.currentUnitsDoors,
              this.temporaryZone.periodicityDoors)
    },
    updateMaxUnitsLeds: function(){
      [this.sliderMaxLeds, this.temporaryZone.periodicityLeds] =
          updateSliderMax(this.currentUnitsLeds,
              this.temporaryZone.periodicityLeds)
    }
  }
}

</script>
