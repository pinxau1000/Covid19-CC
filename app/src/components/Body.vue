<template>
  <v-main>
    <v-container>
      <v-row class="text-justify">
          <Card
              v-for="card in cards"
              :key="card.id"
              :icon="card.icon"
              :title="card.title"
              :current="card.current"
              :total="card.total"
              :items="card.items"
          />
      </v-row>
    </v-container>
  </v-main>
</template>


<script>
  import Card from "@/components/Card";
  export default {
    name: 'Body',
    components: {
      Card
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
            title: "Sala A.1.12",
            current: 2,
            total: 35,
            items: [
              {
                icon: "mdi-door",
                name: "Entrada",
                value: 2
              },
              {
                icon: "mdi-door",
                name: "Saída",
                value: 0
              },
              {
                icon: "mdi-toggle-switch",
                name: "Desinfetante",
                action: "switch",
                value: "drain-ethanol-1425"
              }
            ]
          }
        ]
    })
  }
</script>

<style scoped>
</style>