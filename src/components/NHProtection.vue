<template>
  <div class="nh-input">
    <label for="nh-input">Protection: </label>
    <input
        :class="{nhDark: $vuetify.theme.dark, nhLight: !$vuetify.theme.dark}"
        id="nh-input"
        type="number"
        min="0"
        max="99"
        size="2"
        :value="protection"
        @change="changed"/>
  </div>
</template>

<script>
export default {
  name: 'NHProtection',

  props: ['protection'],

    data: () => ({
    }),

    computed: {
    },

    methods: {
      changed: function (evt) {
        this.$emit('changed', evt.target.value)
      }
    }
  }
</script>

<style>
.nhDark {
  color: white;
}
.nhLight {
  color: black;
}
.nh-input {
  font-family: "Courier New", "Menlo", "DejaVu Sans Mono", "Courier", monospace;
}
</style>
