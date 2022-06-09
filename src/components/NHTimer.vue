<template>
  <div>
    <div class="nh-timer">{{elapsedDurationString}}</div>
    <div class="nh-controls">
      <NHButton label="☐" hint="Stop" @clicked="stopTimer" :active="!timerRunning" />
      <NHButton label=">" hint="Start" @clicked="startTimer" :active="timerRunning" />
      <NHButton label="Reset" @clicked="resetTimer" />
    </div>
  </div>
</template>

<script>
import {Duration} from "luxon";
import NHButton from "./NHButton";
import animationInterval from "../functions/animation-interval";

export default {
  name: 'NHTimer',

  components: {
    NHButton
  },

  props: ['darkMode'],

    data: () => ({
      startingTime: undefined,
      elapsedTime: 0,
      totalElapsedTime: 0,
      timerRunning: false,
      abortController: undefined
    }),

    computed: {
      elapsedDurationString: function () {
        return (this.elapsedDuration.hours + '').padStart(2, '0') + ':' +
               (this.elapsedDuration.minutes + '').padStart(2, '0') + ':' +
               (Math.round(this.elapsedDuration.seconds) + '').padStart(2, '0')
      },
      elapsedDuration: function () {
        return Duration.fromMillis(this.elapsedTime + this.totalElapsedTime)
            .shiftTo('hours', 'minutes', 'seconds').toObject()
      }
    },

    methods: {
      stopTimer() {
        if (this.timerRunning) {
          this.abortController.abort()
          this.timerRunning = false
          this.startingTime = undefined
          this.totalElapsedTime += this.elapsedTime
          this.elapsedTime = 0
        }
      },
      startTimer() {
        if (!this.timerRunning) {
          this.timerRunning = true
          this.abortController = new AbortController()
          if (this.startingTime === undefined) {
            this.startingTime = document.timeline ? document.timeline.currentTime : performance.now()
          }
          animationInterval(1000, this.abortController.signal, () => {
            const now = document.timeline ? document.timeline.currentTime : performance.now();
            this.elapsedTime = now - this.startingTime
          })
        }
      },
      resetTimer() {
        this.stopTimer()
        this.startingTime = undefined
        this.elapsedTime = 0
        this.totalElapsedTime = 0
      }
    }
  }
</script>

<style>
.nh-timer {
  display: inline-block;
  line-height: 1em;
  font-size: xx-large;
  font-family: "Courier New", "Menlo", "DejaVu Sans Mono", "Courier", monospace;
  font-weight: bold;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}
.nh-controls {
  font-size: small;
}
</style>
