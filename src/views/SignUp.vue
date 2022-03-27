<template>
  <v-layout>
      <v-container v-if="!loading && !loggedIn">
        <v-row class="mt-5">
          <v-col offset-md="2" md="8" cols="12">
            <h1>We need you <small>to stream NetHack.</small></h1>
            <p>We are looking for 24 Twitch streamers to commit to streaming NetHack for two hours during the weekend of April 15th - April 17th.</p>
            <p>We'll be continuing the characters started by the previous streamer and raiding the next streamer on the schedule. There will be <em>many deaths</em>, and hopefully at least one ascension.</p>
            <p><strong>Sign up today!</strong> To get started
            <input type="button" class="twitch-login" onclick="location.href='http://localhost:3000/signup/auth'" value="Log In with Twitch" />
            </p>
          </v-col>
        </v-row>
      </v-container>

      <v-container v-if="!loading && loggedIn">
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
            <v-form ref="form">
              <v-text-field
                  v-model="username"
                  label="Twitch username"
                  readonly
              ></v-text-field>
              <v-text-field
                  v-model="discordUsername"
                  label="Discord username"
                  @keyup="updateText"
              ></v-text-field>
              <p><small>Join the NetHackathon discord at: <a href="https://discord.gg/QWRa8kBvkh">https://discord.gg/QWRa8kBvkh</a></small></p>
              <v-textarea
                  filled
                  v-model="notes"
                  label="Notes"
                  @keyup="updateText"
              ></v-textarea>
              <p><small>* Twitch username is required</small></p>
            </v-form>
          </v-col>
        </v-row>
        <v-row>
          <v-col offset-md="2" md="8" cols="12">
            <TimeGrid
                @scheduleSlot="scheduleSlot"
                :start-date="startDate"
                :end-date="endDate"
                :schedule="schedule"
            />
          </v-col>
        </v-row>
      </v-container>
  </v-layout>
</template>

<script>

import TimeGrid from "../components/TimeGrid";
import {DateTime} from "luxon";
import {getTwitchSchedule, postTwitchSchedule, postTwitchText} from "../services/signup.service";
import {throttle} from "lodash/lodash";

const throttledUpdateSchedule = throttle((schedule, remoteSchedule) => {
      if (schedule.length !== remoteSchedule.length ||
          schedule.join() !== remoteSchedule.join()) {
        // if the schedule has changed
        const postedSchedule = [...schedule]
        postTwitchSchedule(postedSchedule).then(()=> {
          remoteSchedule = postedSchedule
        })
      }
    }, 2000, {leading: false, trailing: true})

const throttledUpdateText = throttle((discordUsername, remoteDiscordUsername, notes, remoteNotes, cb) => {
  if (discordUsername !== remoteDiscordUsername ||
      notes !== remoteNotes) {
    // if the text has changed
    postTwitchText(discordUsername, notes).then(() => {
      cb(discordUsername, notes)
    })
  }
}, 2000, {leading: false, trailing: true})

window.onbeforeunload = function(){
  throttledUpdateSchedule.flush()
  throttledUpdateText.flush()
}

export default {
  name: 'SignUp',

  components: {
    TimeGrid
  },

  async created() {
    this.loading = true
    try {
      const response = await getTwitchSchedule()
      this.loggedIn = true
      this.remoteSchedule = response.data.schedule
      this.schedule = [...this.remoteSchedule]
      this.username = response.data.username
      this.remoteDiscordUsername = response.data.discordUsername
      this.discordUsername = this.remoteDiscordUsername
      this.remoteNotes = response.data.notes
      this.notes = this.remoteNotes

    } catch (err) {
      console.error(err)
      this.loggedIn = false
    } finally {
      this.loading = false
    }
    this.startDate = DateTime.fromISO('2022-03-25T17:00:00.000', {zone: 'utc'})
    this.endDate = DateTime.fromISO('2022-03-28T00:00:00.000', {zone: 'utc'})
  },

  data: () => ({
    username: undefined,
    schedule: [],
    remoteSchedule: [],
    loading: true,
    loggedIn: false,
    twitchId: undefined,
    startDate: undefined,
    endDate: undefined,
    remoteDiscordUsername: '',
    discordUsername: '',
    remoteNotes: '',
    notes: ''
  }),

  computed: {
  },

  methods: {
    updateText() {
      throttledUpdateText(this.discordUsername, this.remoteDiscordUsername, this.notes, this.remoteNotes, () => {
        this.remoteDiscordUsername = this.discordUsername
        this.remoteNotes = this.notes
      })
    },
    scheduleSlot(slot) {
      if (this.schedule.indexOf(slot.start.ts) > -1) {
        this.schedule = this.schedule.filter((s) => s !== slot.start.ts)
      } else {
        this.schedule.push(slot.start.ts)
      }
      throttledUpdateSchedule(this.schedule, this.remoteSchedule)
    }
  },

  mounted: function () {
  },

};
</script>

<style>
.twitch-login {
  display: inline-flex;
  background-color: rgb(145, 71, 255);
  color: white !important;
  border-radius: 4px;
  font-size: 13pt;
  padding: .5em;
  margin: .5em;
  font-family: Inter, Roobert, "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 600;
  font-stretch: 100%;
}
</style>
