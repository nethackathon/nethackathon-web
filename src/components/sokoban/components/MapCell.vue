<template>
  <span
    class="map-cell"
    :class="{highlight, 'dark-mode':darkMode}">{{symbol}}</span>
</template>

<script>
export default {
  name: 'MapCell',
  props: {
    character: String,
    highlight: Boolean,
    darkMode: Boolean,
    player: Boolean,
    boulder: Boolean,
    boulderChar: String,
    distance: Number
  },
  computed: {
    symbol: function () {
      /*
      if (this.distance !== undefined) {
        return (this.distance > 9) ? 'X' : this.distance + ''
      }
       */
      if (this.player) {
        return '@'
      } else if (this.boulder) {
        return this.boulderChar
      }
      return this.character
    }
  }
}
</script>

<style>
.map-cell {
  font-family: 'Menlo', monospace;
  color: black;
  background-color: white;
}
.dark-mode {
  color: white;
  background-color: #121212;
}
.highlight {
  background-color: rgb(157, 157, 157) !important;
  outline: 1px solid rgb(157, 157, 157);
}
</style>
