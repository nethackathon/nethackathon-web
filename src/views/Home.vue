<template>
  <v-layout>
      <v-container>
        <v-row class="mt-5">
          <v-col offset-md="2" md="8" cols="12">
            <v-img
                alt="NetHackathon Logo"
                src="../assets/logo1.png"
                width="100%"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col offset-md="2" md="8" cols="12">
            <Countdown v-if="startDate && timeLeft && timeLeft.length('milliseconds') > 0" :timeLeft="timeLeft" />
            <CurrentlyStreaming v-else :schedule="schedule" :currentlyStreaming="currentlyStreaming" :upNext="upNext" />
          </v-col>
        </v-row>
        <v-row>
          <v-col offset-md="2" md="8" cols="12">
            <h3 class="lead mb-4 text-justify">
              On <strong>September 10 - 12</strong>, twenty-two Twitch content creators will stream NetHack continuously
              for over 56 hours!
            </h3>
            <p class="lead mb-4 text-justify">
              Streamers include, <Streamer
                v-for="(streamer, index) in streamersByName"
                v-bind:key="streamer.channel"
                :streamer="streamer"
                :index="index"
                :concatenate="true"
                :streamersLength="streamers.length"/>.
            </p>
            <p>Don't want to read a schedule? The current streamer is also hosted at <a href="https://twitch.tv/nethackathon">https://twitch.tv/nethackathon</a></p>
          </v-col>
        </v-row>
        <v-row>
          <v-col offset-md="2" md="8" cols="12">
            <Schedule v-if="schedule && startDate && endDate" :schedule="schedule" :startDate="startDate" :endDate="endDate" :currentlyStreaming="currentlyStreaming"/>
          </v-col>
        </v-row>
      </v-container>
  </v-layout>
</template>

<script>
import Streamer from "../components/Streamer";
import Countdown from "../components/Countdown";
import {DateTime, Interval} from "luxon";
import Schedule from "../components/Schedule";
import CurrentlyStreaming from "../components/CurrentlyStreaming";
import streamers from "../data/streamers"
import schedule from "../data/schedule"

export default {
  name: 'Home',

  components: {
    Schedule,
    Countdown,
    Streamer,
    CurrentlyStreaming
  },

  created: function () {
    this.$vuetify.theme.dark = (localStorage.getItem('dark') === undefined) ? true : (localStorage.getItem('dark') === 'off')
    this.startDate = DateTime.fromISO('2021-09-10T17:00:00.000', {zone: 'utc'})
    this.endDate = DateTime.fromISO('2021-09-13T04:00:00.000', {zone: 'utc'})
    this.timeLeft = Interval.fromDateTimes(DateTime.now(), this.startDate)
  },

  data: () => ({
    startDate: undefined,
    endDate: undefined,
    timeLeft: undefined,
    currentlyStreaming: undefined,
    upNext: undefined,
    streamers: streamers,
    schedule: schedule,
  }),

  computed: {
    streamersByName () {
      return this.streamers.slice().sort((a, b) => {
        if (a.channel.toLowerCase() < b.channel.toLowerCase()) {
          return -1
        }
        if (b.channel.toLowerCase() < a.channel.toLowerCase()) {
          return 1
        }
        return 0
      })
    },
  },

  methods: {
    startCountDown: function () {
      setInterval(() => {
        if (this.startDate && this.timeLeft) {
          this.timeLeft = Interval.fromDateTimes(DateTime.now(), this.startDate)
        }
      }, 1000)
    },
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
  },

  mounted: function () {
    this.startCountDown()
    this.updateCurrentlyStreaming()
    this.updateStreaming()
  },

};
</script>
