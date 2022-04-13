<template>
  <v-container>
    <v-row>
      <v-col>
        <h1> Trophies </h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
<Trophy :before="'\n\n\n'" :after="'Fastest speed run'"/>
      </v-col>
      <v-col>
<Trophy :after="' Best egg hunter'"/>
      </v-col>
      <v-col>
<Trophy :before="'\n\n\n'" :after="'    ?????????'"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import Trophy from "./Trophy";

export default {
  name: 'Trophies',


  data: () => ({
  }),

  components: {
    Trophy
  },

  props: [],

  mounted: function () {
  },

  computed: {
  },

  methods: {
  },
}
</script>

<style>
</style>
