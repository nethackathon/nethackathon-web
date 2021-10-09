<template>
  <div>
    <NHButton
        label="<<"
        hint="Slower"
        @clicked="$emit('slower')"
        :disabled="speedMultiplier === minMultiplier"
    />
    <NHButton
        label="☐"
        hint="stop"
        @clicked="$emit('stop')"
        :disabled="speedMultiplier === 0"
    />
    <NHButton
        label=">"
        hint="Play"
        @clicked="$emit('play')"
        :disabled="speedMultiplier !== 0"
    />
    <NHButton
        label=">>"
        hint="Faster"
        @clicked="$emit('faster')"
        :disabled="speedMultiplier === maxMultiplier"
    />
    <NHButton
        :label="status"
    />
    <NHButton
        label="X"
        hint="Exit replay mode"
        @clicked="$emit('exitReplay')"
    />
  </div>
</template>

<script>
import NHButton from "./NHButton";
export default {
  name: 'NHPlaybackControls',
  components: {NHButton},
  props: ['darkMode', 'speedMultiplier', 'minMultiplier', 'maxMultiplier', 'status'],

    data: () => ({
    }),

    computed: {
    },

    methods: {
    }
  }
</script>

<style>
.nh-text {
  font-family: "Courier New", "Menlo", "DejaVu Sans Mono", "Courier", monospace;
  font-weight: bold;
}
.nh-text-small {
  font-size: small;
}
.nh-checkbox {
  cursor: pointer;
}
</style>
