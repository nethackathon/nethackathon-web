<template>
  <h1 v-if="startDate && timeLeft">{{ duration.days }} days, {{ duration.hours }} hours, {{ duration.minutes }} minutes, and {{ duration.seconds }} seconds to go!</h1>
</template>

<script>
  import { DateTime, Interval } from 'luxon';

  export default {
    name: 'Countdown',

    data: () => ({
      startDate: undefined,
      timeLeft: undefined,
    }),

    methods: {
      startCountDown: function () {
        setInterval(() => {
          if (this.startDate && this.timeLeft) {
            this.timeLeft = Interval.fromDateTimes(DateTime.now(), this.startDate)
          }
        }, 1000)
      }
    },

    created: function () {
      this.startDate = DateTime.fromISO('2021-09-10T17:00:00.000', {zone: 'utc'}),
      this.timeLeft =Interval.fromDateTimes(DateTime.now(), this.startDate)
    },

    mounted: function () {
      this.startCountDown()
    },

    computed: {
      duration: function () {
        return this.timeLeft.toDuration(['days', 'hours', 'minutes', 'seconds', 'milliseconds']).toObject()
      }
    },

  }
</script>

<style>
</style>
