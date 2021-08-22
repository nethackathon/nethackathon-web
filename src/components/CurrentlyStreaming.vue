<template>
  <v-container>
    <v-row>
      <v-col v-if="currentlyStreaming !== undefined">
        <h2 class="align-self-center">Currently streaming:
          <Streamer :streamer="currentlyStreaming"/>
        </h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col offset="2" v-if="upNext !== undefined">
        <h4>Up next:
          <Streamer :streamer="upNext"/>
          @{{toSimpleTime(upNext.starting)}}
        </h4>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import {DateTime} from "luxon";
  import Streamer from "./Streamer";

  export default {
    name: 'CurrentlyStreaming',


    data: () => ({
    }),

    components: {
      Streamer
    },

    props: ['schedule', 'currentlyStreaming', 'upNext'],

    mounted: function () {
    },

    methods: {
      toSimpleTime(starting) {
        return DateTime.fromISO(starting).toLocal().toLocaleString(DateTime.TIME_SIMPLE)
      }
    },
  }
</script>

<style>
</style>
