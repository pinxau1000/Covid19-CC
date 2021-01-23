<template>
  <v-row>
    <v-col class="col-12 col col-sm pb-0 mb-0">
      <v-slider v-model="periodicityShow"
                label="Update Periodicity"
                thumb-label="always"
                min="0" :max="sliderMax()"
                v-on:end="updateParentSlider($event)"
      />
    </v-col>
    <v-col class="col-12 col-sm-4 col-md-auto pt-0 mt-0">
      <v-select v-model="units"
                :items="availableUnits"
                dense
                v-on:change="updateParentSelect($event)"
      />
    </v-col>
  </v-row>
</template>

<script>

export default {
  name: "PeriodicitySetter",
  props: {
    value: Number
  },
  data() {
    return {
      availableUnits: ["seconds", "minutes", "hours"],
      periodicityLocal: this.value,
      units: undefined,
      periodicityShow: undefined,
      sliderMax: function(){
        if (this.units === this.availableUnits[2]){
          return 24;
        } else {
          return 60;
        }
      },
    updateParentSlider: function (value) {
        if (this.units === this.availableUnits[2]){
          this.$emit("update-periodicity", value*3600);
        } else if (this.units  === this.availableUnits[1]){
          this.$emit("update-periodicity", value*60);
        } else {
          this.$emit("update-periodicity", value);
        }
      },
    updateParentSelect: function (units) {
        if (units === this.availableUnits[2]){
          this.$emit("update-periodicity", this.periodicityShow*3600);
        } else if (units === this.availableUnits[1]){
          this.$emit("update-periodicity", this.periodicityShow*60);
        } else {
          this.$emit("update-periodicity", this.periodicityShow);
        }
      },
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.periodicityLocal > 3600) {
        this.units = this.availableUnits[2];
      } else if (this.periodicityLocal > 60) {
        this.units = this.availableUnits[1];
      } else {
        this.units = this.availableUnits[0];
      }

      if (this.units === this.availableUnits[2]) {
        this.periodicityShow = Math.round(this.periodicityLocal/3600);
      } else if (this.units === this.availableUnits[1]) {
        this.periodicityShow = Math.round(this.periodicityLocal/60);
      } else {
        this.periodicityShow = this.periodicityLocal;
      }
    })
  }
}
</script>

<style scoped>

</style>