<template>
  <div class="colorPicker">
    <div
        @click="togglePicker"
        class="colorSquare"
        :style="{backgroundColor: color}">
    </div>
    <div class="picker" v-if="showPicker">
      <div
          v-for="c in pickerColors"
          v-bind:key="c"
          @click="pickColor(c)"
          :style="{backgroundColor: c}"
          class="colorSquare">
      </div>
    </div>
  </div>
</template>

<script>
  import PALETTE from "../includes/palette"

  export default {
    name: 'ColorPicker',

    props: ['color'],

    data: () => ({
      showPicker: false
    }),

    computed: {
      pickerColors: function () {
        return PALETTE.filter((c) => c !== this.color)
      }
    },

    methods: {
      togglePicker: function () {
        this.showPicker = !this.showPicker
      },
      pickColor: function (c) {
        this.$emit('pickColor', c)
        this.showPicker = false
      }
    }
  }
</script>

<style>
  .colorPicker {
    position: relative;
  }
  .colorSquare {
    width: 30px;
    height: 20px;
  }
  .picker {
    position: absolute;
    top: 20px;
    left: 0;
  }
</style>
