<template>
  <div class="nh-button">
    <div>┌―{{buttonEdge}}―┐</div>
    <div class="nh-click" @click="clickButton">│ {{label}} │</div>
    <div>└―{{buttonEdge}}―┘</div>
  </div>
</template>

<script>
export default {
  name: 'NHButton',

  props: ['label'],

    data: () => ({
    }),

    computed: {
      buttonEdge () {
        let returnText = ''
        for (let i = 0; i < this.label.length; i++) {
          returnText += '―'
        }
        return returnText
      }
    },

    methods: {
      clickButton: function (evt) {
        this.$emit('clicked')
        evt.preventDefault()
      }
    }
  }
</script>

<style>
.nh-click {
  cursor: pointer;
}
.nh-button {
  font-family: "Courier New", "Menlo", "DejaVu Sans Mono", "Courier", monospace;
}
</style>
