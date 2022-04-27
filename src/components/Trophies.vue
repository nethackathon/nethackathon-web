<template>
  <v-container>
    <v-row>
      <v-col>
        <h1> Trophies </h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
<Trophy :before="'\n\n\n'" :after="'Fastest ascension\nluxidream (1:10:37)'"/>
      </v-col>
      <v-col>
<Trophy :after="' Best egg hunter\n   Krump_O (7)'"/>
      </v-col>
      <v-col>
<Trophy :before="'\n\n\n'" :after="' Best deaths (tie)\nHakurei_Deity (bisected) \n lidlraccoon (choked)'"/>
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
