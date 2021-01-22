<template>
  <v-card flat>
    <v-carousel v-model="carousel" height="auto" hide-delimiters>
      <v-carousel-item v-for="item in items"
                       :key="item.id"
      >
        <v-card-subtitle class="text-subtitle-1">
          {{ item.name }}
        </v-card-subtitle>
        <v-row>
          <v-col class="col-auto pb-0 mb-0">
            <v-slider v-model="item.periodicity"
                      label="Update Periodicity"
                      thumb-label="always"
                      thumb-size="24"
                      min="0" :max="sliderMax"
            />
          </v-col>
          <v-col class="col- pt-0 mt-0">
            <v-select v-model="currentUnits"
                      :items="availableUnits"
                      return-object
                      dense
                      @change="updateMaxUnits()"
            />
          </v-col>
        </v-row>

        <!-- Range Selection for Sparkline Row -->
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
          <v-col>
            <v-sheet class="transparent">
              <!-- smooth defaults to 8 -->
              <v-sparkline :gradient="sparklineGradient"
                           :value="sparklineValues()"
                           :smooth="true"
                           :fill="true"
                           :labels="sparklineLabels()"
              />
            </v-sheet>
          </v-col>
        </v-row>
      </v-carousel-item>
    </v-carousel>
  </v-card>
</template>

<script>
import {zoneColors} from "@/assets/zone.colors"

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

let now = new Date().toISOString();
let [fullDateNow, fullTimeNow] = now.split('T');
let timeNow = fullTimeNow.split('.')[0];
export default {
  name: "ZoneCarousel",
  props: {
    items: undefined
  },
  data() {
    return {
      // Carousel
      carousel: 0,
      // Sparkline
      sparklineGradient: zoneColors,
      sparklineValues: function() {
        console.log("TODO Add items values!");
        return [0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0];
      },
      sparklineLabels: function() {
        console.log("TODO Add items timestamp!");
        return [0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0];
      },
      // Date Time
      dateStart: fullDateNow,
      dateEnd: fullDateNow,
      timeStart: timeNow,
      timeEnd: timeNow,
      availableUnits: _availableUnits,
      sliderMax: setDefaultSliderMax(this.items.periodicity),
      currentUnits: setDefaultUnits(this.items.periodicity),
      updateMaxUnits: function(){
        [this.sliderMax, this.items.periodicity] =
            updateSliderMax(this.currentUnits,this.items.periodicity);
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
  }
}
</script>

<style scoped>

</style>