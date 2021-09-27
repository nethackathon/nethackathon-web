<template>
  <div>
    <div class="nh-text nh-checkbox" @click="clickCheck">
      <span v-html="check" /> <span>{{label}}</span>
    </div>
    <div v-if="hint">
      <span class="nh-text nh-text-small">{{hint}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NHCheckbox',

  props: ['checked', 'label', 'hint'],

    data: () => ({
    }),

    computed: {
      check () {
        return (this.checked) ? `[X]` : `[&nbsp;]`
      }
    },

    methods: {
      clickCheck: function (evt) {
        this.$emit('clicked')
        evt.preventDefault()
      }
    }
  }
</script>

<style>
.nh-text {
  font-family: "Courier New", "Menlo", "DejaVu Sans Mono", "Courier", monospace;
}
.nh-text-small {
  font-size: small;
}
.nh-checkbox {
  cursor: pointer;
}
</style>
