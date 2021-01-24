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
                 @click.stop="closeZoneSettingsDialog(false)"
          >
            <v-icon> mdi-close </v-icon>
          </v-btn>
          <v-toolbar-title> Settings </v-toolbar-title>
          <v-spacer/>
          <v-progress-circular indeterminate
                               v-show="saveProgress.show"
          ></v-progress-circular>
          <v-toolbar-items>
            <v-btn dark
                   text
                   :disabled="saveBtn.disabled"
                   @click.stop="closeZoneSettingsDialog(true)"
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
              <v-text-field v-model="temporaryZone.max"
                            label="Maximum Capacity"
                            :rules="[textField.RuleNumber]"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-divider/>
            </v-col>
          </v-row>

          <ZoneCarousel :items.sync="temporaryZone.items"
                        :zone-name="temporaryZone.name"
          />

        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import ZoneCarousel from "@/components/ZoneCarousel";
import {zoneColors} from "@/assets/zone.colors";
import {updateZoneChilds, updatePeriodicitySensor} from "@/plugins/firebase";

function updateRemoteZoneSettings(context){
  context.saveProgress.show = true;

  let updateObject = {
    enabled: context.temporaryZone.enabled,
    max: Number(context.temporaryZone.max),
  }

  updateZoneChilds(context.temporaryZone.name, updateObject);

  Object.values(context.temporaryZone.items).forEach(function(value){
    updatePeriodicitySensor(context.temporaryZone.name, value.name,
        context.temporaryZone.items[value.name].periodicity);
  });
}

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
      saveProgress: {
        show: false
      },
      sparklineGradient: zoneColors,
      saveBtn: {
        disabled: true
      },
      textField: {
        RuleNumber: strValue => {
          if (isNaN(Number(strValue))){
            this.saveBtn.disabled = true;
            return "Invalid Number!";
          } else {
            if (Number(strValue) > 10000){
              this.saveBtn.disabled = true;
              return "Must be less than 10000!";
            } else {
              this.saveBtn.disabled = false;
              return true;
            }
          }
        }
      }
    }
  },
  methods: {
    closeZoneSettingsDialog: function (save){
      if (save) {
        updateRemoteZoneSettings(this);
      }
      this.show = false;
      this.$emit("close-zone-settings-dialog");
    }
  }
}

</script>
