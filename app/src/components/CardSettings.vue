<template>
  <v-dialog
      v-model="dialog"
      width="500px"
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
        <v-btn-toggle
            color="primary"
            text
            @click="dialog = false"
        >
          Close
        </v-btn-toggle>
      </v-card-actions>
    </v-card>


  </v-dialog>
</template>

<script>
export default {
  name: "CardSettings",
  data () {
    return {
      dialog: false,
    }
  }
}
</script>