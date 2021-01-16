<template>
  <!-- 1 column per line on extra small devices; 2 columns per line on small
  devices; 3 columns per line on medium size devices.-->
    <v-col class="col-12 col-sm-6 col-md-4">
    <v-card>
      <v-card-title>
        <CardTitle :title="title" :current="current" :total="total"/>
      </v-card-title>
      <v-card-text>
        <CardItem v-for="item in items"
                  v-bind:key="item.id"
                  v-bind:icon="item.icon"
                  v-bind:name="item.name"
                  v-bind:action="item.action"
                  v-bind:value="item.value"/>
        <v-row>
          <v-col align="center">
            <v-btn
                color="primary"
                elevation="2"
                icon
                x-small
                class="align-center">
              <v-icon x-small>
                mdi-plus
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
import CardItem from "@/components/CardItem";
import CardTitle from "@/components/CardTitle";
export default {
  name: "Card",
  components: {CardTitle, CardItem},
  props: {
    title: String,
    current: Number,
    total: Number,
    items: Array
  }
}
</script>

<style scoped>
</style>