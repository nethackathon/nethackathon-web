<template>
  <v-app>
    <div class="djinni nethack" v-if="djinniVisible">
      &
    </div>
    <v-tooltip left>
      <template v-slot:activator="{ on, attrs }">
        <div
            v-bind="attrs"
            v-on="on"
            @click="clickLamp"
            @mousemove="rubLamp"
            class="magic-lamp nethack">
          (
        </div>
      </template>
      <span>{{lampMessage}}</span>
    </v-tooltip>
    <router-view />
  </v-app>
</template>

<script>

export default {
  name: 'App',

  created: function () {
    this.$vuetify.theme.dark = (localStorage.getItem('dark') === null) ? true : (localStorage.getItem('dark') === 'off')
  },

  data: () => ({
    djinniVisible: false,
    rubbed: 0,
    lampMessage: 'You see here a magic lamp.',
  }),

  methods: {
    rubLamp: function () {
      this.rubbed++
      if (this.rubbed % 100 === 0 && !this.djinniVisible) {
        this.lampMessage = 'You see a puff of smoke.'
      }
      if (this.rubbed % 157 === 0 && !this.djinniVisible) {
        this.lampMessage = 'You see here a magic lamp.'
      }
      if (this.rubbed % 1337 === 0 && !this.djinniVisible) {
        this.djinniVisible = true
        const random = Math.random()
        if (random < 0.2) {
          this.lampMessage = "I am in your debt. I will grant one wish!"
        } else if (random < 0.4) {
          this.lampMessage = "Thank you for freeing me!"
        } else if (random < 0.6) {
          this.lampMessage = "You freed me!"
        } else if (random < 0.8) {
          this.lampMessage = "It is about time!"
        } else {
          this.lampMessage = "You disturbed me, fool!"
        }
      }
    },
    clickLamp: function (evt) {
      let dark = (localStorage.getItem('dark') === null) ? 'off' : localStorage.getItem('dark')
      dark = (dark === 'off') ? 'on' : 'off'
      localStorage.setItem('dark', dark)
      this.$vuetify.theme.dark = (dark === 'off')
      evt.preventDefault()
    },
  }
};
</script>

<style>
.magic-lamp {
  bottom: 10px;
  right: 10px;
  cursor: pointer;
  z-index: 10;
}
.djinni {
  bottom: 85px;
  right: 10px;
}
.nethack {
  position: fixed;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background: #121212;
  width: 75px;
  height: 75px;
  text-align: center;
  line-height: 75px;
  color: #FFFF55;
  font-family: "Courier New", "Menlo", "DejaVu Sans Mono", "Courier", monospace;
  font-size: xxx-large;
  font-weight: bolder;
}
</style>
