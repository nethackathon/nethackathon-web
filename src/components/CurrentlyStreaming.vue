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
  import {DateTime, Interval} from "luxon";
  import Streamer from "./Streamer";

  export default {
    name: 'CurrentlyStreaming',


    data: () => ({
      currentlyStreaming: undefined,
      upNext: undefined
    }),

    components: {
      Streamer
    },

    props: ['schedule'],

    mounted: function () {
      this.updateCurrentlyStreaming()
      this.updateStreaming()
    },

    methods: {
      updateStreaming() {
        setInterval(() => {
          this.updateCurrentlyStreaming()
        }, 15000)
      },
      updateCurrentlyStreaming: function () {
        for (let i = 0; i < this.schedule.length; i++) {
          let s = this.schedule[i]
          let streamerStarting = DateTime.fromISO(s.starting)
          let streamerSlot = Interval.fromDateTimes(streamerStarting, streamerStarting.plus({ hours: s.duration }))
          if (streamerSlot.contains(DateTime.now())) {
            this.currentlyStreaming = s
            this.upNext = (this.schedule.length > (i + 1)) ? this.schedule[i + 1] : undefined
          }
        }
      },
      toSimpleTime(starting) {
        return DateTime.fromISO(starting).toLocal().toLocaleString(DateTime.TIME_SIMPLE)
      }
    },
  }
</script>

<style>
</style>
