<template>
  <v-main>
    <v-container>
      <!--
      settingsDialog will be updated on the event update:settings-dialog with
      the value passed meaning that's the same as using
      v-on:update:settings-dialog and v-bind:show="settingsDialog" or
      v-bind:settingsDialog.sync="settingsDialog":
      <CardSettings v-bind:settingsDialog.sync="settingsDialog"/>
      -->
      <CardSettings v-model="settingsDialog"/>
      <v-row class="text-justify">
          <Card
              v-for="card in cards"
              :key="card.id"
              :card="card"
              @open-card-settings="openCardSettingsHandle($event)"
          />
      </v-row>
    </v-container>
  </v-main>
</template>


<script>
  import Card from "@/components/Card";
  import CardSettings from "@/components/CardSettings";

  export default {
    name: 'Body',
    components: {
      Card,
      CardSettings
    },
    data: () => ({
      cards: [
          {
            id: "b4b13f82-6c34-45b8-91e5-85b4c25ea2fc",
            title: "Title One",
            current: 1,
            total: 10,
            items: [
              {
                icon: "mdi-crown",
                name: "This is the first item.",
                value: 1
              },
              {
                icon: "mdi-cat",
                name: "This is the second item.",
                value: 2
              },
              {
                icon: "mdi-dog",
                name: "This is the thrid item.",
                value: 3
              },
              {
                icon: "mdi-pig",
                name: "This is the fourth item.",
                value: 4
              }
            ]
          },
          {
            id: "39eabb18-1597-41ef-9062-36dfc060ba01",
            title: "My Notes",
            current: 13,
            total: 13,
            items: [
              {
                icon: "mdi-plus",
                name: "Test!",
                value: 0
              },
              {
                icon: "mdi-plus",
                name: "This is a test!",
                value: -5
              },
              {
                icon: "mdi-plus",
                name: "Hello! Hello!",
                value: 300
              },
              {
                icon: "mdi-plus",
                name: "Foo Bar!",
                value: 1000000000
              }
            ]
          },
          {
            id: "50febbee-b78a-4a26-8dcf-872925779847",
            title: "3rd Room",
            current: -8,
            total: 90,
            items: [
              {
                icon: "mdi-plus",
                name: "Test!",
                value: 0
              },
              {
                icon: "mdi-plus",
                name: "This is a test!",
                value: -5
              },
              {
                icon: "mdi-plus",
                name: "Hello! Hello!",
                value: 300
              },
              {
                icon: "mdi-plus",
                name: "Foo Bar!",
                value: 100
              }
            ]
          },
          {
            id: "80f28ec0-e849-4a82-8b02-a6ce884ee222",
            title: "Room",
            current: 2,
            total: 35,
            items: [
              {
                icon: "mdi-door",
                name: "In",
                value: 2
              },
              {
                icon: "mdi-door",
                name: "Out",
                value: 0
              },
              {
                icon: "mdi-toggle-switch",
                name: "Actuator",
                action: "switch",
                value: "drain-ethanol-1425"
              }
            ]
          }
        ],
      settingsDialog: false,
      tempCard: undefined
    }),
    methods: {
      openCardSettingsHandle: function (card) {
        this.settingsDialog  = true;
        this.tempCard = card;
      }
    }
  }
</script>

<style scoped>
</style>