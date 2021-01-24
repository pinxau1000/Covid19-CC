<template>
    <v-row>
      <v-col>
        <v-window>
            <!-- Sparkline Graph DateTime Range Selection -->
            <v-row>
              <v-col class="col-12 col-sm-6">
                <v-datetime-picker v-model="startDate"
                                   label="Start Date"
                                   :text-field-props=
                                       "{prependIcon:'mdi-calendar-arrow-right'}"
                                   @input="getSparklineValues()"
                >
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
                                   label="End Date"
                                   :text-field-props=
                                       "{prependIcon:'mdi-calendar-arrow-left'}"
                                   @input="getSparklineValues()"
                >
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
                               :value="sparklineValues"
                               :labels="sparklineLabels"
                               :smooth="true"
                               :fill="true"
                               height="100%"
                  />
                </v-sheet>
              </v-col>
            </v-row>

            <v-simple-table v-if="dataAndTimestamp"
                            fixed-header
                            height="300px"
                            dense
            >
              <thead>
                <tr>
                  <th class="text-left">
                    Value
                  </th>
                  <th class="text-left">
                    Date
                  </th>
                  <th class="text-left">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(data, idx) in dataAndTimestamp"
                  :key="`LogTable-${idx}`"
                >
                  <td>{{ data.value }}</td>
                  <td>{{ new Date(data.timestamp).toISOString().split('T')[0] }}</td>
                  <td>{{ new Date(data.timestamp).toISOString().split('T')[1].slice(0, -5) }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th class="text-left">
                    Total: {{ this.valuesSum }}
                  </th>
                </tr>
              </tfoot>
            </v-simple-table>

        </v-window>
      </v-col>
    </v-row>
</template>

<script>
import {zoneColorsReversed} from "@/assets/zone.colors"
import {getRangeValuesTimestamp} from "@/plugins/firebase";

function getSparklineValuesCallback(objects, context){
  // No Data on Firebase
  if (objects === null) {
    context.sparklineValues = [0, 0, 0]; // No Data on Firebase
    context.sparklineLabels = [" ", "No Data Found 😕", " "];
    context.valuesSum = 0;

  // Only one sample in Firebase
  } else if (Object.values(objects).length < 2) {
    context.sparklineValues = [0, 0, 0]; // No Data on Firebase
    context.sparklineLabels = [" ", "Insufficient Data to Plot  😒", " "];
    context.valuesSum = Object.values(objects)[0].value;
    context.dataAndTimestamp =
    Object.values(JSON.parse(JSON.stringify(objects)));

  // More than two samples on Firebase
  } else {
    let values = [];
    let timestamps = [];
    context.valuesSum = 0
    for (let obj of Object.values(objects)){
      // Gets value (to sparkline)
      values.push(obj.value);

      // Time stamp is hard to see, setting blank!
      timestamps.push(" ");

      context.valuesSum += obj.value;
    }

    // Gets al data for logging
    context.dataAndTimestamp =
        Object.values(JSON.parse(JSON.stringify(objects)));
    context.sparklineValues = values;
    context.sparklineLabels = timestamps;
  }
}

export default {
  name: "DataViewer",
  props: {
    item: undefined,
    zoneName: undefined
  },
  data() {
    return {
      itemLocal: this.item,
      zoneNameLocal: this.zoneName,

      // DateTime Picker
      endDate: undefined,
      startDate: undefined,

      // Sparkline
      sparklineGradient: zoneColorsReversed,
      sparklineValues: undefined,
      sparklineLabels: undefined,
      getSparklineValues: function() {
        getRangeValuesTimestamp(this.zoneNameLocal, this.itemLocal.name,
            this.startDate.getTime(), this.endDate.getTime(),
            objects => getSparklineValuesCallback(objects, this));
      },

      // Log
      dataAndTimestamp: undefined,
      valuesSum: undefined
    }
  },
  mounted() {
    this.$nextTick(() => {
      let now = new Date();
      this.endDate = now;
      this.startDate = new Date(now.getTime() - (1000*60*60)) // Last Hour

      getRangeValuesTimestamp(this.zoneNameLocal, this.itemLocal.name,
            this.startDate.getTime(), this.endDate.getTime(),
            objects => getSparklineValuesCallback(objects, this));
    });
  }
}
</script>

<style scoped>

</style>