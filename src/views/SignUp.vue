<template>
  <v-layout>
      <v-container v-if="!loading && !loggedIn">
        <v-row class="mt-5">
          <v-col offset-md="2" md="8" cols="12">
            <h1>We need you <small>to stream NetHack.</small></h1>
            <p>We are looking for 24 Twitch streamers to stream NetHack for two hours during the weekend of September 16th - September 18th.</p>
            <p>We'll be continuing the characters started by the previous streamer and raiding the next streamer on the schedule. There will be <em>many deaths</em>, and hopefully at least one ascension.</p>
            <p v-if="!signupsClosed"><strong>Sign up today!</strong> To get started
              <input type="button" class="twitch-login" v-on:click="redirectToTwitch" value="Log In with Twitch" /></p>
            <h3 v-if="signupsClosed">Sign-ups are closed, but please participate in the next event!</h3>
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
            <p>
              Fill out the form to sign up, the form is saved automatically.
            </p>
            <p>
              We organize the event using <a href="https://discord.com/">Discord</a>.
              Join the NetHackathon Discord server at: <a href="https://discord.gg/QWRa8kBvkh">https://discord.gg/QWRa8kBvkh</a> and introduce yourself!</p>
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
                  v-model="pronouns"
                  label="Preferred pronouns (e.g. they/them/their)"
                  @keyup="updateText"
              ></v-text-field>
              <v-text-field
                  v-model="discordUsername"
                  label="Discord username"
                  @keyup="updateText"
              ></v-text-field>
              <v-textarea
                  filled
                  v-model="notes"
                  label="Notes"
                  @keyup="updateText"
              ></v-textarea>
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
    <v-snackbar v-model="saving" :timeout="savingTimeout" color="warning">Saving</v-snackbar>
    <v-snackbar v-model="saved" :timeout="savedTimeout" color="success">Saved</v-snackbar>
    <v-snackbar v-model="error" :timeout="errorTimeout" color="error">{{errorText}}</v-snackbar>
  </v-layout>
</template>

<script>

import TimeGrid from "../components/TimeGrid";
import {DateTime} from "luxon";
import {getTwitchSchedule, postTwitchSchedule, postTwitchText} from "../services/signup.service";
import {throttle} from "lodash/lodash";

const throttledUpdateSchedule = throttle((schedule, remoteSchedule, cb, err) => {
      if (schedule.length !== remoteSchedule.length ||
          schedule.join() !== remoteSchedule.join()) {
        // if the schedule has changed
        const postedSchedule = [...schedule]
        postTwitchSchedule(postedSchedule).then(cb).catch(err)
      } else {
        cb()
      }
    }, 2000, {leading: false, trailing: true})

const throttledUpdateText = throttle((pronouns, remotePronouns, discordUsername, remoteDiscordUsername, notes, remoteNotes, cb, err) => {
  if (discordUsername !== remoteDiscordUsername ||
      notes !== remoteNotes ||
      pronouns !== remotePronouns) {
    // if the text has changed
    postTwitchText(discordUsername, notes, pronouns).then(cb).catch(err)
  } else {
    cb()
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
      this.remotePronouns = response.data.pronouns
      this.pronouns = this.remotePronouns
      this.remoteNotes = response.data.notes
      this.notes = this.remoteNotes
    } catch (err) {
      console.error(err)
      this.loggedIn = false
    } finally {
      this.loading = false
    }
    this.startDate = DateTime.fromISO('2022-09-16T17:00:00.000', {zone: 'utc'})
    this.endDate = DateTime.fromISO('2022-09-19T00:00:00.000', {zone: 'utc'})
  },

  data: () => ({
    signupsClosed: false,
    error: false,
    errorTimeout: 2000,
    errorText: '',
    savingTimeout: -1,
    savedTimeout: 2000,
    saving: false,
    saved: false,
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
    remotePronouns: '',
    pronouns: '',
    remoteNotes: '',
    notes: ''
  }),

  computed: {
  },

  methods: {
    redirectToTwitch() {
      const uri = (process.env.NODE_ENV === 'development') ? 'http://localhost:3000/twitch/auth' : 'https://api.nethackathon.org/twitch/auth'
      location.href = uri
    },
    updateText() {
      this.saving = true
      throttledUpdateText(this.pronouns, this.remotePronouns, this.discordUsername, this.remoteDiscordUsername, this.notes, this.remoteNotes, () => {
        this.remoteDiscordUsername = this.discordUsername
        this.remoteNotes = this.notes
        this.saving = false
        this.saved = true
      }, (err) => {
        console.error(err)
        this.saving = false
        this.error = true
        this.errorText = err.message
        this.loggedIn = false
      })
    },
    scheduleSlot(slot) {
      if (this.schedule.indexOf(slot.start.ts) > -1) {
        this.schedule = this.schedule.filter((s) => s !== slot.start.ts)
      } else {
        this.schedule.push(slot.start.ts)
      }
      this.saving = true
      throttledUpdateSchedule(this.schedule, this.remoteSchedule, () => {
        this.saving = false
        this.saved = true
        this.remoteSchedule = [...this.schedule]
      }, (err) => {
        console.error(err)
        this.saving = false
        this.error = true
        this.errorText = err.message
        this.loggedIn = false
      })
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
