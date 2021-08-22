<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="2"></v-col>
          <v-col cols="8">
            <v-img
                alt="NetHackathon Logo"
                src="./assets/logo1.png"
                width="100%"
            />
          </v-col>
          <v-col cols="2"></v-col>
        </v-row>
        <v-row>
          <v-col cols="2"></v-col>
          <v-col cols="8">
            <Countdown />
          </v-col>
          <v-col cols="2"></v-col>
        </v-row>
        <v-row>
          <v-col cols="2"></v-col>
          <v-col cols="8">
            <h3 class="lead mb-4 text-justify">
              On <strong>September 10 - 12</strong>, twenty-two Twitch content creators will stream NetHack continuously
              for over 56 hours!
            </h3>
            <p class="lead mb-4 text-justify">
              Streamers include, <Streamer
                v-for="(streamer, index) in sortedStreamers"
                v-bind:key="streamer.channel"
                :streamer="streamer"
                :index="index"
                :concatenate="true"
                :streamersLength="streamers.length"/>.
            </p>
          </v-col>
          <v-col cols="2"></v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

import Streamer from "./components/Streamer";
import Countdown from "./components/Countdown";

export default {
  name: 'App',

  components: {
    Countdown,
    Streamer
  },

  data: () => ({
    streamers: [
      {
        channel: 'ToneHack',
        starting: '2021-09-10T17:00:00Z',
        length: 4,
        featured: true
      },
      {
        channel: 'JJvanTheMan',
        starting: '2021-09-10T21:00:00Z',
        length: 3,
        featured: false
      },
      {
        channel: 'Cloudmillion',
        starting: '2021-09-11T00:00:00Z',
        length: 2,
        featured: false
      },
      {
        channel: 'LythariDrow',
        starting: '2021-09-11T02:00:00Z',
        length: 3,
        featured: false
      },
      {
        channel: 'kougyoku_gentou',
        starting: '2021-09-11T05:00:00Z',
        length: 1,
        featured: false
      },
      {
        channel: 'Priestess_of_Athe',
        starting: '2021-09-11T06:00:00Z',
        length: 1,
        featured: false
      },
      {
        channel: 'ichbinmiah',
        starting: '2021-09-11T07:00:00Z',
        length: 3,
        featured: false
      },
      {
        channel: 'AmericanElm',
        starting: '2021-09-11T10:00:00Z',
        length: 3,
        featured: false
      },
      {
        channel: 'KitsukoKi',
        starting: '2021-09-11T13:00:00Z',
        length: 3,
        featured: false
      },
      {
        channel: 'MeatPowersTV',
        starting: '2021-09-11T16:00:00Z',
        length: 3,
        featured: false
      },
      {
        title: 'Speed run semi-finals featuring shadowrider38 and aoeixsz4!',
        channel: 'aoeixsz4',
        starting: '2021-09-11T19:00:00Z',
        length: 3,
        featured: false
      },
      {
        channel: 'PeteGoz',
        starting: '2021-09-11T22:00:00Z',
        length: 2,
        featured: false
      },
      {
        channel: 'Antigulp',
        starting: '2021-09-12T00:00:00Z',
        length: 3,
        featured: false
      },
      {
        channel: 'Diggitysc',
        starting: '2021-09-12T03:00:00Z',
        length: 2,
        featured: true
      },
      {
        channel: 'toddrafter',
        starting: '2021-09-12T05:00:00Z',
        length: 3,
        featured: false
      },
      {
        channel: 'ashpooljohn',
        starting: '2021-09-12T08:00:00Z',
        length: 3,
        featured: false
      },
      {
        channel: 'finitelycraig',
        starting: '2021-09-12T11:00:00Z',
        length: 3,
        featured: false
      },
      {
        channel: 'QueenXerxes',
        starting: '2021-09-12T14:00:00Z',
        length: 3,
        featured: false
      },
      {
        title: 'Speed run finals featuring luxidream and the winner of the semi-finals!',
        channel: 'luxidream',
        starting: '2021-09-12T17:00:00Z',
        length: 3,
        featured: true
      },
      {
        channel: 'theyflower',
        starting: '2021-09-12T20:00:00Z',
        length: 2,
        featured: false
      },
      {
        channel: 'd_i_s_p_e_r_s_e',
        starting: '2021-09-12T22:00:00Z',
        length: 3,
        featured: false
      },
      {
        channel: 'shadowrider38',
        starting: '2021-09-13T01:00:00Z',
        length: 3,
        featured: false
      },
    ]
  }),

  computed: {
    sortedStreamers () {
      return this.streamers.slice().sort((a, b) => {
        if (a.channel < b.channel) {
          return -1
        }
        if (b.channel < a.channel) {
          return 1
        }
        return 0
      })
    }

  }
};
</script>
