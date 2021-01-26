<template>
  <v-card flat tile>
    <v-window v-model="carousel">
      <!-- Eager is needed to prevent data loading on switch -->
      <v-window-item v-for="item in items"
                     :key="item.id"
                     eager
      >
        <v-card>
          <v-card-title>
            {{ item.name }}
          </v-card-title>

          <v-card-text>
            <!-- Periocdicity Slider -->
            <PeriodicitySetter :key="`Slider-${item.id}`"
                                v-bind:value="item.periodicity"
                                v-on:update-periodicity="updatePeriodicityHandle($event, item)"
            />

            <!-- Divider -->
            <v-row>
              <v-col>
                <v-divider/>
              </v-col>
            </v-row>

            <DataViewer :key="`DataViewer-${item.id}`"
                        :item="item"
                        :zone-name="zoneName"
            />

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
import PeriodicitySetter from "@/components/PeriodicitySetter";
import DataViewer from "@/components/DataViewer";

export default {
  name: "ZoneCarousel",
  components: {DataViewer, PeriodicitySetter},
  props: {
    items: undefined,
    zoneName: undefined
  },
  methods: {
    next () {
      this.carousel = this.carousel + 1 === this.parsedItems.length
        ? 0
        : this.carousel + 1
    },
    prev () {
      this.carousel = this.carousel - 1 < 0
        ? this.parsedItems.length - 1
        : this.carousel - 1
    },
    updatePeriodicityHandle: function(newPeriodicity, item){
      this.items[item.name].periodicity = newPeriodicity;
    }
  },
  data() {
    return {
      // Carousel
      carousel: 0,
      parsedItems: Object.values(JSON.parse(JSON.stringify(this.items)))
    }
  }
}
</script>

<style scoped>

</style>