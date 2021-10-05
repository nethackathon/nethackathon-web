<template>
  <div>
    <div class="nh-text nh-checkbox d-inline" @click="clickCheck">
      <span v-html="check" /> <span :title="hint">{{label}}</span>
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
  font-weight: bold;
}
.nh-text-small {
  font-size: small;
}
.nh-checkbox {
  cursor: pointer;
}
</style>
