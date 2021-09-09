<template>
  <div class="nh-checkbox" @click="clickCheck">
    <span v-html="check" /> <span>{{label}}</span>
  </div>
</template>

<script>
export default {
  name: 'NHCheckbox',

  props: ['checked', 'label'],

    data: () => ({
    }),

    computed: {
      check () {
        console.log('this.checked', this.checked)
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
.nh-checkbox {
  cursor: pointer;
  font-family: "Courier New", "Menlo", "DejaVu Sans Mono", "Courier", monospace;
}
</style>
