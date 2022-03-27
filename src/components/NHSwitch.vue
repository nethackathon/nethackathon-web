<template>
  <div class="nh-button" :class="{disabled}" :title="hint" @click="clickSwitch">
    <div>┌─{{switchEdge}}─┐</div>
    <div class="nh-click">│ {{offLabel}} │ {{onLabel}} │</div>
    <div>└─{{switchEdge}}─┘</div>
  </div>
</template>

<script>
export default {
  name: 'NHSwitch',

  props: ['onLabel', 'offLabel', 'isOn'],

    data: () => ({
    }),

    computed: {
      switchEdge () {
        let length = this.offLabel.length + this.onLabel.length + 3
        let returnText = ''
        for (let i = 0; i < length; i++) {
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
</style>
