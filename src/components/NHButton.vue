<template>
  <div class="nh-button" :class="{disabled, active}" :title="hint">
    <div>┌─{{buttonEdge}}─┐</div>
    <div class="nh-click" @click="clickButton">│ {{label}} │</div>
    <div>└─{{buttonEdge}}─┘</div>
  </div>
</template>

<script>
export default {
  name: 'NHButton',

  props: ['label', 'disabled', 'hint', 'active'],

    data: () => ({
    }),

    computed: {
      buttonEdge () {
        let returnText = ''
        for (let i = 0; i < this.label.length; i++) {
          returnText += '─'
        }
        return returnText
      }
    },

    methods: {
      clickButton: function (evt) {
        if (this.disabled) return
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
  display: inline-block;
  line-height: 1em;
  font-family: "Courier New", "Menlo", "DejaVu Sans Mono", "Courier", monospace;
  font-weight: bold;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}
.disabled {
  color: #666;
}
.active {
  color: green;
}
</style>
