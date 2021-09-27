<template>
  <div class="nh-input">
    <label for="nh-input">{{label}}: </label>
    <input
        :class="{nhDark: $vuetify.theme.dark, nhLight: !$vuetify.theme.dark}"
        id="nh-input"
        type="number"
        :min="min"
        :max="max"
        size="2"
        :value="value"
        @change="changed"/>
  </div>
</template>

<script>
export default {
  name: 'NHNumber',

  props: ['value', 'label', 'min', 'max'],

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
