<template>
  <div>
    <label for="char-picker">Character: </label>
    <input
        id="char-picker"
        type="text"
        class="charPicker"
        @keydown="pickChar"
        v-model="character"
        :style="{color}"
    />
    <span style="font-size: small;">(Type any key.)</span>
  </div>
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
        if (evt.key.length === 1 && evt.key.match(/[\x20-\x7E]/)) {
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
  }
  input {
    outline: 0;
    border-bottom: 1px solid #666;
  }
</style>
