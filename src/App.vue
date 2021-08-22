<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row class="mt-5">
          <v-col offset-md="2" md="8" cols="12">
            <v-img
                alt="NetHackathon Logo"
                src="./assets/logo1.png"
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
          </v-col>
        </v-row>
        <v-row>
          <v-col offset-md="2" md="8" cols="12">
            <Schedule v-if="schedule && startDate && endDate" :schedule="schedule" :startDate="startDate" :endDate="endDate" :currentlyStreaming="currentlyStreaming"/>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

import Streamer from "./components/Streamer";
import Countdown from "./components/Countdown";
import {DateTime, Interval} from "luxon";
import Schedule from "./components/Schedule";
import CurrentlyStreaming from "./components/CurrentlyStreaming";

export default {
  name: 'App',

  components: {
    Schedule,
    Countdown,
    Streamer,
    CurrentlyStreaming
  },

  created: function () {
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
    streamers: [
      {
        channel: 'ToneHack',
        featured: false
      },
      {
        channel: 'JJvanTheMan',
        featured: false
      },
      {
        channel: 'Cloudmillion',
        featured: false
      },
      {
        channel: 'LythariDrow',
        featured: false
      },
      {
        channel: 'kougyoku_gentou',
        featured: false
      },
      {
        channel: 'Priestess_of_Athe',
        featured: false
      },
      {
        channel: 'ichbinmiah',
        featured: false
      },
      {
        channel: 'AmericanElm',
        featured: false
      },
      {
        channel: 'KitsukoKi',
        featured: false
      },
      {
        channel: 'MeatPowersTV',
        featured: false
      },
      {
        channel: 'aoeixsz4',
        featured: false
      },
      {
        channel: 'PeteGoz',
        featured: false
      },
      {
        channel: 'Antigulp',
        featured: false
      },
      {
        channel: 'Diggitysc',
        featured: false
      },
      {
        channel: 'toddrafter',
        featured: false
      },
      {
        channel: 'ashpooljohn',
        featured: false
      },
      {
        channel: 'finitelycraig',
        featured: false
      },
      {
        channel: 'QueenXerxes',
        featured: false
      },
      {
        channel: 'luxidream',
        featured: false
      },
      {
        channel: 'theyflower',
        featured: false
      },
      {
        channel: 'd_i_s_p_e_r_s_e',
        featured: false
      },
      {
        channel: 'shadowrider38',
        featured: false
      },
    ],
    schedule: [
      {
        channel: 'ToneHack',
        starting: '2021-09-10T17:00:00Z',
        duration: 4,
        featured: false
      },
      {
        channel: 'JJvanTheMan',
        starting: '2021-09-10T21:00:00Z',
        duration: 3,
        featured: false
      },
      {
        channel: 'Cloudmillion',
        starting: '2021-09-11T00:00:00Z',
        duration: 2,
        featured: false
      },
      {
        channel: 'LythariDrow',
        starting: '2021-09-11T02:00:00Z',
        duration: 3,
        featured: false
      },
      {
        channel: 'kougyoku_gentou',
        starting: '2021-09-11T05:00:00Z',
        duration: 1,
        featured: false
      },
      {
        channel: 'Priestess_of_Athe',
        starting: '2021-09-11T06:00:00Z',
        duration: 1,
        featured: false
      },
      {
        channel: 'ichbinmiah',
        starting: '2021-09-11T07:00:00Z',
        duration: 3,
        featured: false
      },
      {
        channel: 'AmericanElm',
        starting: '2021-09-11T10:00:00Z',
        duration: 3,
        featured: false
      },
      {
        channel: 'KitsukoKi',
        starting: '2021-09-11T13:00:00Z',
        duration: 3,
        featured: false
      },
      {
        channel: 'MeatPowersTV',
        starting: '2021-09-11T16:00:00Z',
        duration: 3,
        featured: false
      },
      {
        title: 'Speed run semi-finals featuring shadowrider38 and aoeixsz4!',
        channel: 'luxidream',
        starting: '2021-09-11T19:00:00Z',
        duration: 3,
        featured: false
      },
      {
        channel: 'PeteGoz',
        starting: '2021-09-11T22:00:00Z',
        duration: 2,
        featured: false
      },
      {
        channel: 'Antigulp',
        starting: '2021-09-12T00:00:00Z',
        duration: 3,
        featured: false
      },
      {
        channel: 'Diggitysc',
        starting: '2021-09-12T03:00:00Z',
        duration: 2,
        featured: false
      },
      {
        channel: 'toddrafter',
        starting: '2021-09-12T05:00:00Z',
        duration: 3,
        featured: false
      },
      {
        channel: 'ashpooljohn',
        starting: '2021-09-12T08:00:00Z',
        duration: 3,
        featured: false
      },
      {
        channel: 'finitelycraig',
        starting: '2021-09-12T11:00:00Z',
        duration: 3,
        featured: false
      },
      {
        channel: 'QueenXerxes',
        starting: '2021-09-12T14:00:00Z',
        duration: 3,
        featured: false
      },
      {
        title: 'Speed run finals featuring luxidream and the winner of the semi-finals!',
        channel: 'luxidream',
        starting: '2021-09-12T17:00:00Z',
        duration: 3,
        featured: false
      },
      {
        channel: 'theyflower',
        starting: '2021-09-12T20:00:00Z',
        duration: 2,
        featured: false
      },
      {
        channel: 'd_i_s_p_e_r_s_e',
        starting: '2021-09-12T22:00:00Z',
        duration: 3,
        featured: false
      },
      {
        channel: 'shadowrider38',
        starting: '2021-09-13T01:00:00Z',
        duration: 3,
        featured: false
      },
    ]
  }),

  computed: {
    streamersByName () {
      return this.streamers.slice().sort((a, b) => {
        if (a.channel < b.channel) {
          return -1
        }
        if (b.channel < a.channel) {
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
