<template>
  <v-layout>
      <v-container v-if="!loading && !loggedIn">
        <v-row class="mt-5">
          <v-col offset-md="2" md="8" cols="12" align="center">
            <input type="button" class="twitch-login" v-on:click="redirectToTwitch" value="Log In with Twitch" />
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
          <v-col cols="12" md="6">
        <span
            v-for="tab in tabs"
            v-bind:key="tab"
            :class="{'selected-tab':(tab === selectedTab)}"
            @click="selectedTab = tab"
            class="nh-tab nh-clickable nh-textarea">{{tab}}</span>
          </v-col>
        </v-row>
        
        <v-row v-if="selectedTab === 'Intrinsics'">
          <v-col>
            <v-container>
              <Intrinsics
                  :character-data="localData"
                  @update-intrinsic="updateIntrinsic"
                  @update-protection="updateProtection"
                  @update-can-pray="updateCanPray"
                  @update-last-prayed="updateLastPrayed"
              />
            </v-container>
          </v-col>
        </v-row>
        
        <v-row v-if="selectedTab === 'Notes'">
          <v-col>
            <div class="nh-textarea">
              <v-textarea outlined v-model="localData.notes" @keydown="updateNotes" cols="80" rows="24"/>
            </div>
          </v-col>
        </v-row>
        
        <v-row v-if="selectedTab === 'Egg hunt'">
          <v-col>
            <Achievement
                v-for="egg in eggHunt"
                v-bind:key="egg.name"
                :name="egg.name"
                :streamers="egg.streamers"
                :username="localData.username"
                @click-achievement="updateEgg(egg)"
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

import { get, getEggs, updateAchievement } from '../services/streamer.service';
import { update } from "../services/annotate.service";
import Intrinsics from "../components/annotate/Intrinsics";
import Achievement from "../components/streamers/Achievement";
import {debounce} from "debounce";

export default {
  name: 'Streamers',

  components: {
    Intrinsics,
    Achievement,
  },

  async created() {
    this.loading = true
    try {
      this.localData = await get()
      this.eggHunt = this.processEggs(await getEggs())
      this.loggedIn = true
    } catch (err) {
      console.error(err)
      this.loggedIn = false
    } finally {
      this.loading = false
    }
  },

  data: () => ({
    eggHunt: [],
    localData: {},
    error: false,
    errorTimeout: 2000,
    errorText: '',
    savingTimeout: -1,
    savedTimeout: 2000,
    saving: false,
    saved: false,
    loading: true,
    loggedIn: false,
    selectedTab: 'Intrinsics',
    tabs: ['Intrinsics', 'Notes', 'Egg hunt'],
  }),

  computed: {
  },

  methods: {
    processEggs(eggs) {
      const eggArray = []
      eggs.forEach((egg) => {
        let existingEgg = eggArray.find((e) => e.name === egg.name)
        if (existingEgg === undefined) {
          existingEgg = {
            name: egg.name,
            streamers: []
          }
          eggArray.push(existingEgg)
        }
        if (egg.username !== null) {
          existingEgg.streamers.push(egg.username)
        }
      })
      return eggArray
    },
    async updateEgg(egg) {
      this.eggHunt = this.processEggs(await updateAchievement(egg.name))
    },
    redirectToTwitch() {
      const uri = (process.env.NODE_ENV === 'development') ? 'http://localhost:3000/twitch/auth' : 'https://api.nethackathon.org/twitch/auth'
      location.href = uri
    },
    updateIntrinsic: function (intrinsic) {
      let i = this.localData.intrinsics.find((i) => i.name === intrinsic.name)
      i.value = !i.value
      update(this.localData)
    },
    updateProtection: function (value) {
      this.localData.protection = value
      update(this.localData)
    },
    updateCanPray: function () {
      this.localData.canPray = !this.localData.canPray
      update(this.localData)
    },
    updateLastPrayed: function (value) {
      this.localData.lastPrayed = value
      update(this.localData)
    },
    updateNotes: debounce(function () {
      update(this.localData)
    }, 1000),
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
#annotate {
  font-family: "Courier New", "Menlo", "DejaVu Sans Mono", "Courier", monospace;
}
.nh-clickable {
  cursor: pointer;
  font-weight: bold;
  text-decoration: underline;
}
.nh-modal {
  position: absolute;
  width: 450px;
  left: 50%;
  top: 15%;
  transform: translate(-50%);
  border: 1px solid #666;
  padding: 1em;
}
.theme--light.v-application .nh-modal {
  background: white;
}
.theme--dark.v-application .nh-modal {
  background: #121212;
}
.nh-tab {
  margin-right: 1em;
  padding: 0.3em;
}
.nh-link {
  text-decoration: underline;
}
.selected-tab {
  background-color: #999;
}
.theme--light.v-application {
  color: #000 !important;
}
.theme--dark.v-application {
  background-color: #121212 !important;
}
</style>
