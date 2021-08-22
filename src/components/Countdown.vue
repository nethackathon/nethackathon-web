<template>
  <h1 v-if="timeLeft">{{ duration.days }} days, {{ duration.hours }} hours, {{ duration.minutes }} minutes, and {{ duration.seconds }} seconds to go!</h1>
</template>

<script>
  export default {
    name: 'Countdown',

    props: ['timeLeft'],

    computed: {
      duration: function () {
        return this.timeLeft.toDuration(['days', 'hours', 'minutes', 'seconds', 'milliseconds']).toObject()
      }
    },
  }
</script>

<style>
</style>
