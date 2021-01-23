<template>
  <v-card flat tile>
    <v-window v-model="carousel">
      <v-window-item v-for="item in items"
                     :key="item.id"
      >
        <v-card>
          <v-card-title>
            {{ item.name }}
          </v-card-title>

          <v-card-text>
            <!-- Periocdicity Slider -->
            <PeriodicitySetter
                v-bind:value="item.periodicity"
                v-on:update-periodicity="updatePeriodicityHandle($event, item)"
                :key="`slider-${item.id}`"
            />

            <v-row>
              <v-col>
                <v-divider/>
              </v-col>
            </v-row>

            <!-- Sparkline Graph DateTime Range Selection -->
            <v-row>
              <v-col class="col-12 col-sm-6">
                <v-datetime-picker v-model="startDate"
                                   label="Start Date">
                  <template slot="dateIcon">
                    <v-icon>mdi-calendar</v-icon>
                  </template>
                  <template slot="timeIcon">
                    <v-icon>mdi-clock</v-icon>
                  </template>
                </v-datetime-picker>
              </v-col>
              <v-col class="col-12 col-sm-6">
                <v-datetime-picker v-model="endDate"
                                   label="End Date">
                  <template slot="dateIcon">
                    <v-icon>mdi-calendar</v-icon>
                  </template>
                  <template slot="timeIcon">
                    <v-icon>mdi-clock</v-icon>
                  </template>
                </v-datetime-picker>
              </v-col>
            </v-row>

            <!-- Sparkline Graph -->
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

          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
    <v-card-actions class="justify-space-between">
      <v-btn
        text
        @click="prev"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-item-group
        v-model="carousel"
        class="text-center"
        mandatory
      >
        <v-item
          v-for="item in this.items"
          :key="`btn-${item.id}`"
          v-slot="{ active, toggle }"
        >
          <v-btn
            :input-value="active"
            icon
            @click="toggle"
          >
            <v-icon>mdi-record</v-icon>
          </v-btn>
        </v-item>
      </v-item-group>
      <v-btn
        text
        @click="next"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {zoneColors} from "@/assets/zone.colors"
import PeriodicitySetter from "@/components/PeriodicitySetter";

export default {
  name: "ZoneCarousel",
  components: {PeriodicitySetter},
  props: {
    items: undefined
  },
  data() {
    return {
      // Carousel
      carousel: 0,
      parsedItems: Object.values(JSON.parse(JSON.stringify(this.items))),

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

      // DateTime Picker
      startDate: new Date(),
      endDate: new Date()
    }
  },
  methods: {
    next () {
      console.log(this.parsedItems)
      this.carousel = this.carousel + 1 === this.parsedItems.length
        ? 0
        : this.carousel + 1
    },
    prev () {
      console.log(this.parsedItems)
      this.carousel = this.carousel - 1 < 0
        ? this.parsedItems.length - 1
        : this.carousel - 1
    },
    updatePeriodicityHandle: function(newPeriodicity, item){
      console.log("DEBUG ZoneCarousel>updatePeriodicityHandle");
      console.log(newPeriodicity);
      console.log(this.items);
      this.items[item.name].periodicity = newPeriodicity;
    }
  }
}
</script>

<style scoped>

</style>