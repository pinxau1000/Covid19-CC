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
          <v-row class="pt-4 pb-0 mb-0">
            <v-col>
              <v-text-field label="Name"
                            :value="this.temporaryZone.name"
              />
            </v-col>
          </v-row>

          <v-row justify="space-between">
            <v-col
                class="text-subtitle-1 col-auto align-self-center justify-start py-0"
            >
              Activated
            </v-col>
            <v-col class="col-auto align-self-center justify-end py-0 ">
              <v-switch v-model="temporaryZone.enabled"
                        color="primary"
                        :label="this.temporaryZone.enabled.toString()"

              />
            </v-col>
            <v-col class="col-12 col-sm pt-0">
              <v-text-field label="Maximum Capacity"
                            :value="this.temporaryZone.total"
              />
            </v-col>
          </v-row>

          <v-divider class="mt-2 mb-6"/>

          <v-row>
            <v-col class="col-12 col-sm-9 pb-0 mb-0">
              <v-slider v-model="temporaryZone.periodicityDoors"
                        label="Periodicity Doors"
                        thumb-label="always"
                        thumb-size="24"
                        min="0" :max="this.sliderMaxDoors"
              />
            </v-col>
            <v-col class="col- pt-0 mt-0">
              <v-select v-model="currentUnitsDoors"
                        :items="this.availableUnits"
                        return-object
                        dense
                        @change="updateMaxUnitsDoor"
              />
            </v-col>
          </v-row>

          <v-row class="mt-4">
            <v-col class="col-12 col-sm-9 pb-0 mb-0">
              <v-slider v-model="temporaryZone.periodicityLeds"
                        label="Periodicity Leds"
                        thumb-label="always"
                        thumb-size="24"
                        min="0" :max="this.sliderMaxLeds"
              />
            </v-col>
            <v-col class="col- pt-0 mt-0">
              <v-select v-model="currentUnitsLeds"
                        :items="this.availableUnits"
                        return-object
                        dense
                        @change="updateMaxUnitsLeds"
              />
            </v-col>
          </v-row>


          <v-divider class="mt-4 mb-2"/>


          <v-row class="align-center">

            <v-col
                class="text-subtitle-1 col-12 col-sm-auto pb-0 justify-start"
            >
              Range
            </v-col>

            <v-col class="col-sm justify-space-between">
              <v-menu :close-on-content-click="false">
                <v-card>
                  <v-date-picker v-model="dateStart"/>
                  <v-date-picker v-model="dateEnd"/>
                </v-card>
                <template v-slot:activator="{ on: click, attrs }">
                  <v-text-field v-model="dateFormatted"
                                label="Date"
                                readonly
                                append-icon="mdi-calendar"
                                v-on="click"
                                v-bind="attrs"
                  />
                </template>
              </v-menu>
            </v-col>

            <v-col class="col-sm justify-space-between">
              <v-menu :close-on-content-click="false">
                <v-card>
                  <v-time-picker v-model="timeStart"/>
                  <v-time-picker v-model="timeEnd"/>
                </v-card>
                <template v-slot:activator="{ on: click, attrs }">
                  <v-text-field v-model="timeFormatted"
                                label="Time"
                                readonly
                                append-icon="mdi-clock"
                                v-on="click"
                                v-bind="attrs"
                  />
                </template>
              </v-menu>
            </v-col>


          </v-row>

          <v-row>
            <v-carousel v-model="carousel" height="auto" hide-delimiters>
              <v-carousel-item v-for="item in this.temporaryZone.items"
                               :key="item.id"
              >
                <v-row class="align-center justify-start">
                  <v-col class="col-auto">
                    <v-card-subtitle class="title">
                      {{ item.name }}
                    </v-card-subtitle>
                  </v-col>
                </v-row>
                <v-row class="align-center justify-center">
                  <v-col>
                      <!-- smooth defaults to 8 -->
                      <v-sparkline :gradient="sparklineGradient"
                                   :value="sparklineValues()"
                                   :smooth="true"
                                   :fill="true"
                                   :labels="sparklineLabels()"
                      />
                  </v-col>
                </v-row>
              </v-carousel-item>
            </v-carousel>
          </v-row>

        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
let now = new Date().toISOString();
let [fullDateNow, fullTimeNow] = now.split('T');
let timeNow = fullTimeNow.split('.')[0];

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

import {zoneColors} from "@/assets/zone.colors";

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

      // Date Time
      dateStart: fullDateNow,
      dateEnd: fullDateNow,
      timeStart: timeNow,
      timeEnd: timeNow,

      // Sparkline
      sparklineGradient: zoneColors,
      carousel: 0,
      sparklineValues: function() {
        console.log("TODO Add items values!");
        return [0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0];
      },
      sparklineLabels: function() {
        console.log("TODO Add items timestamp!");
        return [0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0];
      }
    }
  },
  computed: {
      dateFormatted: function (){
        return this.dateStart + ' ~ ' + this.dateEnd;
      },
      timeFormatted: function(){
        return this.timeStart + ' ~ ' + this.timeEnd;
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
              this.temporaryZone.periodicityDoors);
    },
    updateMaxUnitsLeds: function(){
      [this.sliderMaxLeds, this.temporaryZone.periodicityLeds] =
          updateSliderMax(this.currentUnitsLeds,
              this.temporaryZone.periodicityLeds);
    }
  }
}

</script>
