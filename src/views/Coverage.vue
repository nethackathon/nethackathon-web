<template>
  <v-layout>
      <v-container v-if="!loading">
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
            <CoverageGrid
                :start-date="startDate"
                :end-date="endDate"
                :coverage="coverage"
            />
          </v-col>
        </v-row>
      </v-container>
  </v-layout>
</template>

<script>

import CoverageGrid from "../components/CoverageGrid";
import {DateTime} from "luxon";
import {getStreamersSchedule} from "../services/signup.service";

export default {
  name: 'Coverage',

  components: {
    CoverageGrid
  },

  async created() {
    this.loading = true
    try {
      const response = await getStreamersSchedule()
      let coverage = {}
      response.data.streamers.forEach((streamer) => {
        if (streamer.schedule === null) return
        const timeStamps = JSON.parse(streamer.schedule)
        timeStamps.forEach((ts) => {
          if (!Object.prototype.hasOwnProperty.call(coverage, ts)) coverage[ts] = [] 
          coverage[ts].push(streamer.username)
        })
      })
      this.coverage = coverage
    } catch (err) {
      console.error(err)
      this.loggedIn = false
    } finally {
      this.loading = false
    }
    this.startDate = DateTime.fromISO('2022-04-15T17:00:00.000', {zone: 'utc'})
    this.endDate = DateTime.fromISO('2022-04-18T00:00:00.000', {zone: 'utc'})
  },

  data: () => ({
    coverage: {},
    loading: true,
    startDate: undefined,
    endDate: undefined,
  }),

  computed: {
  },

  methods: {
  },

  mounted: function () {
  },

};
</script>

<style>
</style>
