<template>
  <v-container fluid id="annotate">
    <v-row>
      <v-col cols="12" md="2">
        <h1>#annotate</h1>
      </v-col>
      <v-col cols="12" md="6">
        <h1><small>Your NetHack companion app</small></h1>
      </v-col>
      <v-col cols="12" md="4" class="text-right">
        <NHTimer/>
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
      <v-col cols="12" md="6" class="text-right">
        <span v-if="loggedIn">Logged in as {{loggedInAs}} <span class="nh-link nh-clickable" @click="logOut">Log out</span></span>
        <span v-if="!loggedIn">Storing data in local storage, <span class="nh-link nh-clickable" href="#" @click="showLoginModal = true">Log in</span></span>
      </v-col>
    </v-row>
    <v-row v-if="selectedTab === 'Intrinsics'">
      <v-col>
        <NHCheckbox
            v-for="intrinsic in localData.intrinsics"
            @clicked="updateIntrinsic(intrinsic)"
            v-bind:key="intrinsic.name"
            :checked="intrinsic.value"
            :label="intrinsic.name"
        />
        <NHNumber
            :value="localData.protection"
            min="0"
            max="99"
            label="Protection"
            @changed="updateProtection"
        />
        <NHCheckbox
            @clicked="updateCanPray"
            :checked="localData.canPray"
            label="Can pray"
        />
        <NHNumber
            :value="localData.lastPrayed"
            min="0"
            max="99999"
            label="Last prayed"
            @changed="updateLastPrayed"
        />
      </v-col>
    </v-row>
    <v-row v-if="selectedTab === 'Notes'">
      <v-col>
        <div class="nh-textarea">
          <v-textarea outlined v-model="localData.notes" @keydown="updateNotes" cols="80" rows="24"/>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="selectedTab === 'Price ID'">
      <v-col>
        <div class="mb-3">
          <div style="display: inline-block; margin-right: 2em;">
            <NHNumber
                :value="localData.cha"
                min="1"
                max="25"
                label="Ch"
                @changed="updateCha"
            />
          </div>
          <div style="display: inline-block;">
            <NHCheckbox
                @clicked="updateTourist"
                :checked="localData.touristCapShirt"
                label="Dupe?*"
                hint="* Are you a tourist below level 15, or are wearing a dunce cap, or are wearing a visible shirt?"
            />
          </div>
        </div>
        <NHPriceId
            :cha="localData.cha"
            :is-tourist="localData.touristCapShirt"
            :dark-mode="this.$vuetify.theme.dark"
        />
      </v-col>
    </v-row>
    <v-row v-if="selectedTab === 'Sokoban'">
      <v-col>
        <Sokoban :logged-in="loggedIn" :logging-in="showLoginModal" @logIn="showLoginModal = true"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-divider class="mt-5 mb-16"/>
        <NHButton label="Reset" @clicked="resetAnnotate"/>
      </v-col>
    </v-row>
    <div class="nh-modal" v-if="showLoginModal">
      <NHLogin @loggedIn="onLoggedIn" @closeModal="showLoginModal = false"/>
    </div>
  </v-container>
</template>

<script>
import PALETTE from "../includes/palette"
// import INTRINSICS from "../includes/intrinsics"
// import CharPicker from "../components/CharPicker"
// import ColorPicker from "../components/ColorPicker"
import NHCheckbox from "../components/NHCheckbox"
import {update, read, reset} from "../services/annotate.service"
import { debounce } from "debounce"
import NHNumber from "../components/NHNumber";
import NHButton from "../components/NHButton";
import NHPriceId from "../components/NHPriceId";
import NHLogin from "../components/NHLogin";
import Sokoban from "../components/sokoban/Sokoban";
import NHTimer from "../components/NHTimer";

export default {
  name: 'Annotate',

  created: function () {
    this.loggedIn = (localStorage.getItem('nethackathon-jwt') !== null)
    this.loggedInAs = localStorage.getItem('loggedInAs')
  },

  components: {
    NHButton,
    NHNumber,
    NHCheckbox,
    NHPriceId,
    NHLogin,
    Sokoban,
    NHTimer,
  },

  mounted: async function () {
    this.localData = await read()
  },

  data: () => ({
    loggedIn: false,
    loggedInAs: '',
    showLoginModal: false,
    localData: {},
    passwordCharacter: 'a',
    passwordColor: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    selectedTab: 'Intrinsics',
    tabs: ['Intrinsics', 'Notes', 'Price ID', 'Sokoban'],
    debounce,
  }),

  methods: {
    pickColor: function (color) {
      this.passwordColor = color
    },
    pickChar: function (char) {
      this.passwordCharacter = char
    },
    updateIntrinsic: function (intrinsic) {
      let i = this.localData.intrinsics.find((i) => i.name === intrinsic.name)
      i.value = !i.value
      update(this.localData)
    },
    updateTourist: function () {
      this.localData.touristCapShirt = !this.localData.touristCapShirt
      update(this.localData)
    },
    updateNotes: debounce(function () {
      update(this.localData)
    }, 1000),
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
    updateCha: function (value) {
      this.localData.cha = value
      update(this.localData)
    },
    resetAnnotate: function () {
      reset().then((res) => this.localData = res)
    },
    onLoggedIn: async function () {
      this.showLoginModal = false
      this.loggedIn = true
      this.loggedInAs = localStorage.getItem('loggedInAs')
      this.localData = await read()
    },
    logOut: async function () {
      localStorage.removeItem('nethackathon-jwt')
      localStorage.removeItem('loggedInAs')
      this.loggedIn = false
      this.loggedInAs = ''
      // Update offline data
      this.localData = await read()
    }
  },

  computed: {
  }

};
</script>

<style>
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
