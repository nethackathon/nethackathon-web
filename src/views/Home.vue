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
        <Tagline />
        <v-row>
          <v-col offset-md="2" md="8" cols="12">
            <Countdown v-if="startDate && timeLeft && timeLeft.length('milliseconds') > 0" :timeLeft="timeLeft" />
            <CurrentlyStreaming v-else :schedule="schedule" :currentlyStreaming="currentlyStreaming" :upNext="upNext" />
          </v-col>
        </v-row>
        <v-row>
          <v-col offset-md="2" md="8" cols="12">
            <h3 class="lead mb-4 text-justify">
              On <strong>April 15 - 17, 2022</strong>, twenty-three Twitch content creators will stream NetHack continuously
              for over 48 hours!
            </h3>
            <h2 v-if="tbd"><router-link :to="'/signup'">Streamers, sign up today!</router-link></h2>
            <p class="lead mb-4 text-justify">
              Streamers include, <Streamer
                v-for="(streamer, index) in streamersByName"
                v-bind:key="streamer.username"
                :streamer="streamer"
                :index="index"
                :concatenate="true"
                :streamersLength="streamers.length"/>.
            </p>
            <p v-if="!tbd">Don't want to read a schedule? The current streamer is also hosted at <a href="https://twitch.tv/nethackathon">https://twitch.tv/nethackathon</a></p>
          </v-col>
        </v-row>
        <v-row>
          <v-col offset-md="2" md="4" cols="12">
            <h2 v-if="tbd">Schedule TBD</h2>
            <Schedule
                v-if="!tbd && schedule && startDate && endDate"
                :schedule="schedule"
                :startDate="startDate"
                :endDate="endDate"
                :currentlyStreaming="currentlyStreaming"
            />
          </v-col>
          <v-col md="4" cols="12">
            <Deaths :ascensions="true" :livelog="endedGames" />
            <Deaths :ascensions="false" :livelog="endedGames" />
            <Livelog :livelog="livelog" />
          </v-col>
        </v-row>
        <v-row>
          <v-col offset-md="2" md="8" cols="12">
            <Trophies/>
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
import Tagline from "../components/Tagline";
import {
  getTwitchStreamers,
  getSchedule,
  getLivelogs,
  getEndedGames,
} from "../services/base.service";
import Livelog from "../components/Livelog";
import Deaths from "../components/Deaths";
import Trophies from "../components/Trophies";

export default {
  name: 'Home',

  components: {
    Schedule,
    Countdown,
    Streamer,
    CurrentlyStreaming,
    Tagline,
    Livelog,
    Deaths,
    Trophies
  },

  created: function () {
    this.startDate = DateTime.fromISO('2022-04-15T19:00:00.000', {zone: 'utc'})
    this.endDate = DateTime.fromISO('2022-04-17T21:00:00.000', {zone: 'utc'})
    this.timeLeft = Interval.fromDateTimes(DateTime.now(), this.startDate)
    getSchedule().then((response) => {
      this.schedule = response.data
    })
    getTwitchStreamers().then((response) => {
      this.streamers = response.data.streamers
    })
    getLivelogs().then(this.updateLiveLogs)
    setInterval(() => {
      getLivelogs(this.lastlogs).then(this.updateLiveLogs)
    }, 2500)
    getEndedGames().then((response) => { this.endedGames = response.flatMap((r) => r.data) })
    setInterval(() => {
      getEndedGames().then((response) => { this.endedGames = response.flatMap((r) => r.data) })
    }, 10000)
  },

  data: () => ({
    lastlogs: undefined,
    livelog: [],
    endedGames: [],
    tbd: false, // set to false once schedule is set up
    startDate: undefined,
    endDate: undefined,
    timeLeft: undefined,
    currentlyStreaming: undefined,
    upNext: undefined,
    streamers: [],
    schedule: {streamers: []},
  }),

  computed: {
    streamersByName () {
      return this.streamers.slice().sort((a, b) => {
        if (a.username.toLowerCase() < b.username.toLowerCase()) {
          return -1
        }
        if (b.username.toLowerCase() < a.username.toLowerCase()) {
          return 1
        }
        return 0
      })
    },
  },

  methods: {
    lastlogReducer: function (prev, curr) {
      const cv = (curr !== undefined && curr.time) ? curr.time : 0
      return (prev > cv) ? prev : cv
    },
    updateLiveLogs: function (response) {
      this.livelog = [...this.livelog, ...(response.flatMap((r) => r.data))]
      if (this.livelog.length > 0)
        this.lastlogs = this.livelog.reduce(this.lastlogReducer, 0)
    },
    startCountDown: function () {
      setInterval(() => {
        if (this.startDate && this.timeLeft) {
          this.timeLeft = Interval.fromDateTimes(DateTime.now(), this.startDate)
        }
      }, 1000)
    },
    updateStreaming() {
      this.updateCurrentlyStreaming()
      setInterval(() => {
        this.updateCurrentlyStreaming()
      }, 15000)
    },
    updateCurrentlyStreaming: function () {
      for (let i = 0; i < this.schedule.streamers.length; i++) {
        let s = this.schedule.streamers[i]
        let streamerStarting = DateTime.fromMillis(parseInt(s.start_time))
        // console.log(streamerStarting)
        let streamerSlot = Interval.fromDateTimes(streamerStarting, streamerStarting.plus({ hours: s.duration }))
        if (streamerSlot.contains(DateTime.now())) {
          this.currentlyStreaming = s
          console.log('this.currentlyStreaming', this.currentlyStreaming)
          this.upNext = (this.schedule.streamers.length > (i + 1)) ? this.schedule.streamers[i + 1] : undefined
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
