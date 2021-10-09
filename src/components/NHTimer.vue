<template>
  <div>
    <div class="nh-timer">{{elapsedDurationString}}</div>
    <div class="nh-controls">
      <NHButton label="☐" hint="Stop" @clicked="stopTimer" />
      <NHButton label=">" hint="Start" @clicked="startTimer" />
      <NHButton label="Reset" @clicked="resetTimer" />
    </div>
  </div>
</template>

<script>
import {Duration} from "luxon";
import NHButton from "./NHButton";

export default {
  name: 'NHTimer',

  components: {
    NHButton
  },

  props: ['darkMode'],

    data: () => ({
      startingTime: undefined,
      intervalId: undefined,
      elapsedTime: 0,
      totalElapsedTime: 0
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
        clearInterval(this.intervalId)
        this.startingTime = undefined
        this.intervalId = undefined
        this.totalElapsedTime += this.elapsedTime
        this.elapsedTime = 0
      },
      startTimer() {
        if (this.startingTime === undefined) {
          this.startingTime = Date.now()
        }
        if (this.intervalId === undefined) {
          this.intervalId = setInterval(() => {
            this.elapsedTime = Date.now() - this.startingTime
          }, 500)
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
