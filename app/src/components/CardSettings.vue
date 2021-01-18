<template>
  <!-- v-model is two way bindings means: if you change input value, the
  bound data will be changed and vice versa.  v-bind:value is called one way
  binding that means: you can change input value by changing bound data but
  you can't change bound data by changing input value through the element.-->
  <v-dialog
      v-model="show"
      width="800px"
  >
    <v-card>
      <v-card-title class="headline grey lighten-2">
        Privacy Policy
      </v-card-title>
      <v-card-text>
        Some text
      </v-card-text>
      <v-divider/>
      <v-card-actions>
        <v-btn
            color="primary"
            text
            elevation="2"
            @click="closeSettingsDialog"
        >
          Close
        </v-btn>
        <v-btn
            color="primary"
            text
            elevation="2"
            @click="closeSettingsDialog"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "CardSettings",
  props: {
    show: Boolean,
    card: Object
  },
  model: {
    prop: "show",
    event: "card-settings"
  },
  methods: {
    closeSettingsDialog: function (){
      this.$emit("card-settings", false);
    }
  }
}
</script>