<template>
  <div class="map">
    <div
        class="map-row"
        v-for="row in map"
        v-bind:key="row.id"
    >
      <MapCell
          v-for="cell in row"
          v-bind:key="cell.id"
          :character="cell.character"
          :dark-mode="darkMode"
          :highlight="cell.highlight"
          :player="cell.player"
          :boulder="cell.boulder"
          :boulder-char="boulderChar"
          :distance="cell.distance"
      />
    </div>
  </div>
</template>

<script>
import MapCell from "./MapCell";

export default {
  name: 'Map',
  props: {
    map: Array,
    darkMode: Boolean,
    highlight: Array,
    highlightX: Number,
    highlightY: Number,
    boulderChar: String
  },
  components: {
    MapCell
  },
}
</script>

<style>
.map {
  padding-left: 10em;
  padding-top: 3em;
  width: 30em;
  height: 24em;
  font-family: 'Menlo', monospace;
  white-space: pre;
  color: white;
  background-color: black;
}
.map-row {
  height: 1em;
}
.map.invert {
  color: black;
  background-color: white;
}
.highlight {
  background-color: #666 !important;
}
</style>
