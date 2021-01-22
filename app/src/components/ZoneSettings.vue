<template>
  <v-container justify="center">
    <v-dialog v-model="show"
              fullscreen
              persistent
              hide-overlay
              transition="dialog-bottom-transition"
    >
      <v-card>
        <!-- Toolbar -->
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

        <!-- Title -->
        <v-card-title>
          {{ temporaryZone.name }}
        </v-card-title>
        <v-card-text>
          <!-- Activated and Max People -->
          <v-row justify="space-between">
            <v-col
                class="text-subtitle-1 col-auto align-self-center justify-start py-0"
            >
              Activated
            </v-col>
            <v-col
                class="col col-sm-auto align-self-center py-0 ">
              <v-switch v-model="temporaryZone.enabled"
                        color="primary"
              />
            </v-col>
            <v-col class="col-12 col-sm pt-0">
              <v-text-field label="Maximum Capacity"
                            :value="this.temporaryZone.total"
              />
            </v-col>
          </v-row>

          <v-divider class="mt-2"/>

          <ZoneCarousel :items="temporaryZone.items"/>

        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import ZoneCarousel from "@/components/ZoneCarousel";

export default {
  name: "ZoneSettings",
  components: {
    ZoneCarousel
  },
  props: {
    temporaryZone: Object,
  },
  data() {
    return {
      show: Boolean,
    }
  },
  methods: {
    closeZoneSettingsDialog: function (){
      console.log("DEBUG: ZoneSettings>closeZoneSettingsDialog");
      this.show = false;
      this.$emit("close-zone-settings-dialog");
    }
  }
}

</script>
