<template>
  <v-app>
    <AppBar :title="name"/>

    <v-main>
      <Body :zones="zones"/>
    </v-main>

    <v-footer app>
    </v-footer>
  </v-app>
</template>

<script>
import Body from "@/components/Body";
import AppBar from "@/components/AppBar";

export default {
  name: 'App',
  components: {
    AppBar,
    Body
  },
  data: () => ({
    name: "Group Name",
    zones: [
      {
        id: "b4b13f82-6c34-45b8-91e5-85b4c25ea2fc",
        title: "Title One",
        current: 1,
        total: 10,
        updateInterval: 59,
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
        updateInterval: 60,
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
        updateInterval: 61,
        items: [
          {
            icon: "mdi-plus",
            name: "Entrada Norte",
            value: 30
          },
          {
            icon: "mdi-plus",
            name: "Entrada Sul",
            value: 2
          },
          {
            icon: "mdi-plus",
            name: "Saída Norte",
            value: 60
          },
          {
            icon: "mdi-plus",
            name: "Dispensador",
            value: 2
          }
        ]
      },
      {
        id: "80f28ec0-e849-4a82-8b02-a6ce884ee222",
        title: "Room",
        current: 2,
        total: 35,
        updateInterval: 3601,
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
            value: "30"
          }
        ]
      }
    ],
  })
};
</script>
