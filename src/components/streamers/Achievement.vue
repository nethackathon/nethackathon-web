<template>
  <div>
    <NHCheckbox
        @clicked="clickAchievement"
        v-bind:key="name"
        :checked="(streamers.indexOf(username) > -1)"
        :label="name"
    />
    <span v-if="streamers.length > 0" class="streamer-list">{{streamerList}}</span>
  </div>
</template>

<script>
import NHCheckbox from "../NHCheckbox";

export default {
  name: 'Achievement',

  props: ['name', 'streamers', 'username'],
  
  data: () => ({
  }),
  
  components: {
    NHCheckbox
  },

  computed: {
    streamerList: function() {
      return [...this.streamers].sort().join(', ')
    }
  },

  methods: {
    clickAchievement: function () {
      this.$emit('click-achievement')
    }
  }
}
</script>

<style>
.streamer-list {
  margin-left: 2em;
}
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
