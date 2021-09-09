<template>
  <input
      type="text"
      class="charPicker"
      @keydown="pickChar"
      v-model="character"
      :style="{color}"
  />
</template>

<script>
export default {
  name: 'CharPicker',

  props: ['color', 'character'],

    data: () => ({
    }),

    computed: {
    },

    methods: {
      pickChar: function (evt) {
        if (evt.key.length === 1 && evt.key.match(/[a-zA-Z]/)) {
          this.$emit('pickChar', evt.key)
        }
        evt.preventDefault()
      }
    }
  }
</script>

<style>
  .charPicker {
    font-family: "Courier New", "Menlo", "DejaVu Sans Mono", "Courier", monospace;
    font-size: 18pt;
    font-weight: bold;
    width: 1.2em;
    height: 1.2em;
    padding: 0.1em;
    background-color: black;
  }
</style>
