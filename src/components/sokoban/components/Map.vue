<template>
  <div class="map" :class="{darkMode}">
    <div
        class="map-row"
        v-for="row in sokoMap"
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
    sokoMap: Array,
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
  padding: 2em;
  font-family: 'Menlo', monospace;
  font-size: larger;
  white-space: pre;
  color: black;
  background-color: white;
}
.map-row {
  height: 1.2em;
}
.map.darkMode {
  color: white;
  background-color: #121212;
}
</style>
